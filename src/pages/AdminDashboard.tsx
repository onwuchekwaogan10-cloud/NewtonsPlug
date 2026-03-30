import { useState, useEffect } from "react";
import { Users, CreditCard, AlertTriangle, Settings, Search, MoreVertical, Download, Plus, MessageSquare, CheckCircle, XCircle, RefreshCw, UserMinus } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import AccountPoolTab from "../components/admin/AccountPoolTab";
import { revokeAccountFromUser } from "../lib/account-pool";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen to users
    const unsubscribeUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        if (err.message.includes("Missing or insufficient permissions")) {
          setError("Access Denied. You do not have admin privileges.");
        } else {
          handleFirestoreError(err, OperationType.GET, "users");
        }
        setLoading(false);
      }
    );

    // Listen to subscriptions
    const unsubscribeSubs = onSnapshot(
      collection(db, "subscriptions"),
      (snapshot) => {
        const subsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubscriptions(subsData);
      },
      (err) => {
        if (!err.message.includes("Missing or insufficient permissions")) {
          handleFirestoreError(err, OperationType.GET, "subscriptions");
        }
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeSubs();
    };
  }, []);

  const handleSuspend = async (subId: string) => {
    if (!window.confirm("Are you sure you want to suspend this subscription?")) return;
    try {
      await updateDoc(doc(db, "subscriptions", subId), { status: "Suspended" });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `subscriptions/${subId}`);
    }
  };

  const handleActivate = async (subId: string) => {
    if (!window.confirm("Are you sure you want to activate this subscription?")) return;
    try {
      await updateDoc(doc(db, "subscriptions", subId), { status: "Active" });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `subscriptions/${subId}`);
    }
  };

  const handleClearEarnings = async (userId: string) => {
    if (!window.confirm("Mark earnings as paid and reset to ₦0?")) return;
    try {
      await updateDoc(doc(db, "users", userId), { discountEarned: 0 });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleRevokeAccount = async (userId: string, subId: string, accountId: string) => {
    if (!window.confirm("Are you sure you want to revoke this user's assigned account? This will free up a slot in the pool.")) return;
    try {
      await revokeAccountFromUser(userId, subId, accountId);
      alert("Account successfully revoked.");
    } catch (err) {
      console.error("Failed to revoke account:", err);
      alert("Failed to revoke account. Check console for details.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 py-20 flex items-center justify-center">
        <div className="bg-zinc-900 border border-red-500/30 p-8 rounded-2xl max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate Stats
  const activeSubs = subscriptions.filter(s => s.status === "Active").length;
  const totalEarningsOwed = users.reduce((acc, user) => acc + (user.discountEarned || 0), 0);
  const flaggedSubs = subscriptions.filter(s => s.devicesActive > s.devicesTotal).length;

  const stats = [
    { label: "Total Users", value: users.length.toString(), trend: "Registered" },
    { label: "Active Subscriptions", value: activeSubs.toString(), trend: "Currently Paying" },
    { label: "Total Owed (Referrals)", value: `₦${totalEarningsOwed.toLocaleString()}`, trend: "Pending Payouts", alert: totalEarningsOwed > 0 },
    { label: "Flagged Accounts", value: flaggedSubs.toString(), trend: "Device Limit Exceeded", alert: flaggedSubs > 0 }
  ];

  // Combine user and sub data for the table
  const tableData = users.map(user => {
    // Find their most recent subscription
    const userSubs = subscriptions.filter(s => s.userId === user.uid);
    // Sort by createdAt desc
    userSubs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latestSub = userSubs[0];

    return {
      ...user,
      subscription: latestSub
    };
  }).filter(user => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (user.name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q));
  });

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Plan", "Status", "Devices", "Referrals", "Owed"];
    const csvData = tableData.map(user => {
      const sub = user.subscription;
      const isExpired = sub && new Date(sub.expiresAt) < new Date();
      const displayStatus = !sub ? "No Plan" : isExpired ? "Expired" : sub.status;
      const devices = sub ? `${sub.devicesActive}/${sub.devicesTotal}` : "0/0";
      
      return [
        user.name || "",
        user.email || "",
        sub?.plan || "None",
        displayStatus,
        devices,
        user.referrals || 0,
        user.discountEarned || 0
      ].join(",");
    });
    
    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `newtonsplug_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBroadcast = () => {
    const emails = tableData.map(u => u.email).filter(Boolean).join(",");
    window.location.href = `mailto:?bcc=${emails}&subject=Update from NewtonsPlug`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-green-500" /> Admin Control Panel
            </h1>
            <p className="text-zinc-400 mt-1">Manage users, subscriptions, and payouts.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg border border-zinc-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={handleBroadcast}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              <MessageSquare className="w-4 h-4" /> Broadcast
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-zinc-900 border ${stat.alert ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-800'} rounded-xl p-6`}>
              <div className="text-sm text-zinc-400 mb-2">{stat.label}</div>
              <div className="text-3xl font-bold text-white mb-2">{loading ? "..." : stat.value}</div>
              <div className={`text-sm font-medium ${stat.alert ? 'text-red-400 flex items-center gap-1' : 'text-green-400'}`}>
                {stat.alert && <AlertTriangle className="w-4 h-4" />} {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 mb-6 w-fit overflow-x-auto max-w-full">
          {["users", "pool", "payouts", "tools", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg capitalize transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {tab === "pool" ? "Account Pool" : tab}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          
          {activeTab === "pool" ? (
            <AccountPoolTab />
          ) : activeTab === "users" ? (
            <>
              {/* Toolbar */}
              <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row justify-between gap-4 bg-zinc-900/50">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..." 
                    className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800">
                      <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
                      <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan & Status</th>
                      <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Devices</th>
                      <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Referrals / Owed</th>
                      <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">Loading users...</td>
                      </tr>
                    ) : tableData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">No users found.</td>
                      </tr>
                    ) : tableData.map((user) => {
                      const sub = user.subscription;
                      const isExpired = sub && new Date(sub.expiresAt) < new Date();
                      const displayStatus = !sub ? "No Plan" : isExpired ? "Expired" : sub.status;
                      const isFlagged = sub && sub.devicesActive > sub.devicesTotal;

                      return (
                        <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-xs text-zinc-500">{user.email}</div>
                            <div className="text-xs text-zinc-600 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-white">{sub ? sub.plan : "None"}</div>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                displayStatus === 'Active' ? 'bg-green-500/10 text-green-400' :
                                displayStatus === 'Suspended' ? 'bg-red-500/10 text-red-400' :
                                'bg-zinc-800 text-zinc-400'
                              }`}>
                                {displayStatus}
                              </span>
                            </div>
                            {sub && <div className="text-xs text-zinc-500 mt-1">Exp: {new Date(sub.expiresAt).toLocaleDateString()}</div>}
                          </td>
                          <td className="p-4">
                            {sub ? (
                              <div className={`text-sm font-mono ${isFlagged ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                                {sub.devicesActive}/{sub.devicesTotal}
                              </div>
                            ) : (
                              <div className="text-sm text-zinc-600">-</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-white">{user.referrals || 0} friends</div>
                            <div className={`text-sm font-bold mt-1 ${user.discountEarned > 0 ? 'text-green-400' : 'text-zinc-500'}`}>
                              ₦{user.discountEarned || 0}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {user.discountEarned > 0 && (
                                <button 
                                  onClick={() => handleClearEarnings(user.id)}
                                  className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                  title="Mark earnings as paid"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              )}
                              
                              {sub && sub.status === "Active" && (
                                <button 
                                  onClick={() => handleSuspend(sub.id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                  title="Suspend Subscription"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              )}
                              
                              {sub && sub.status === "Suspended" && (
                                <button 
                                  onClick={() => handleActivate(sub.id)}
                                  className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                  title="Activate Subscription"
                                >
                                  <RefreshCw className="w-5 h-5" />
                                </button>
                              )}
                              
                              {sub && sub.assignedAccountId && (
                                <button 
                                  onClick={() => handleRevokeAccount(user.id, sub.id, sub.assignedAccountId)}
                                  className="p-2 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"
                                  title="Revoke Assigned Account"
                                >
                                  <UserMinus className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950">
                <span className="text-sm text-zinc-500">Showing {tableData.length} users</span>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-zinc-500">
              This section is under construction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
