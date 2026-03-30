import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, MonitorSmartphone, LogOut, Download, Copy, CheckCircle2, AlertTriangle, ExternalLink, Zap, MessageSquare, Key, User, ShieldCheck } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { handleFirestoreError } from "../lib/firestore-errors";
import { assignAccountToUser } from "../lib/account-pool";

export default function UserDashboard() {
  const [copied, setCopied] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [assignedAccount, setAssignedAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      // Listen to user profile
      const unsubscribeUser = onSnapshot(
        doc(db, "users", user.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        },
        (error) => handleFirestoreError(error, "get" as any, `users/${user.uid}`)
      );

      // Listen to user subscription
      const unsubscribeSub = onSnapshot(
        doc(db, "subscriptions", user.uid),
        async (docSnap) => {
          if (docSnap.exists()) {
            const subData = docSnap.data();
            setSubscription(subData);
            
            // Fetch assigned account if it exists
            if (subData.assignedAccountId) {
              try {
                const accDoc = await getDoc(doc(db, "access_accounts", subData.assignedAccountId));
                if (accDoc.exists()) {
                  setAssignedAccount(accDoc.data());
                }
              } catch (err) {
                console.error("Error fetching assigned account:", err);
              }
            }
          } else {
            setSubscription(null);
            setAssignedAccount(null);
          }
          setLoading(false);
        },
        (error) => {
          handleFirestoreError(error, "get" as any, `subscriptions/${user.uid}`);
          setLoading(false);
        }
      );

      return () => {
        unsubscribeUser();
        unsubscribeSub();
      };
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Auto-assign account if active but no account
  useEffect(() => {
    const autoAssign = async () => {
      if (!subscription || !userData) return;
      
      const now = new Date().getTime();
      const expiry = new Date(subscription.expiresAt).getTime();
      const isExpired = expiry - now <= 0;
      const isActive = subscription.status === "Active" && !isExpired;

      if (isActive && !subscription.assignedAccountId && !assigning) {
        setAssigning(true);
        setAssignError("");
        try {
          await assignAccountToUser(userData.uid, subscription.id || userData.uid);
        } catch (err: any) {
          setAssignError(err.message || "Failed to assign account. Please contact support.");
        } finally {
          setAssigning(false);
        }
      }
    };

    autoAssign();
  }, [subscription, userData, assigning]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const copyToClipboard = () => {
    if (!userData) return;
    navigator.clipboard.writeText(`newtonsplug.com/ref/${userData.uid?.substring(0, 8) || 'user'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCredentials = () => {
    if (!assignedAccount) return;
    const text = `URL: ${assignedAccount.url}\nUsername: ${assignedAccount.username}\nPassword: ${assignedAccount.password}`;
    navigator.clipboard.writeText(text);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const calculateTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return { days: 0, hours: 0, expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, expired: false };
  };

  const timeRemaining = subscription ? calculateTimeRemaining(subscription.expiresAt) : { days: 0, hours: 0, expired: true };
  const isActive = subscription && subscription.status === "Active" && !timeRemaining.expired;

  return (
    <div className="min-h-screen bg-zinc-950 py-10 relative">
      {/* Watermark overlay to discourage screenshots */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] flex flex-wrap justify-center items-center overflow-hidden rotate-[-15deg]">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="text-white font-mono text-2xl p-8 whitespace-nowrap">
            {userData?.name || userData?.email} • {userData?.phone || "NewtonsPlug"}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {userData?.name?.split(' ')[0] || 'User'}</h1>
            <p className="text-zinc-400">Your secure access portal.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 transition-colors w-fit"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {!subscription || timeRemaining.expired ? (
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-12 mb-8 text-center shadow-xl">
            <Zap className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Active Subscription</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              You currently don't have an active plan. Choose a plan to get instant access to premium AI tools.
            </p>
            <Link 
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
            >
              View Pricing Plans
            </Link>
          </div>
        ) : (
          /* Main Access Card */
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{subscription.plan} Plan</h2>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    {isActive ? 'Active' : 'Expired'}
                  </span>
                </div>
                <p className="text-zinc-400 flex items-center gap-2">
                  <MonitorSmartphone className="w-4 h-4" /> {subscription.devicesActive || 0} of {subscription.devicesTotal || 1} devices active
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <div className="text-sm text-zinc-500 mb-1">Time Remaining</div>
                <div className="flex items-center gap-2 text-xl font-mono text-white bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-800">
                  <Clock className={`w-5 h-5 ${isActive ? 'text-green-500' : 'text-red-500'}`} />
                  <span>{timeRemaining.days}d : {timeRemaining.hours}h</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-zinc-800">
              {assigning ? (
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-zinc-400">Assigning your secure access node...</p>
                </div>
              ) : assignError ? (
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-red-400 font-medium mb-2">{assignError}</p>
                  <a href="https://wa.me/2348032679011" target="_blank" rel="noreferrer" className="text-sm text-white underline">Contact Support</a>
                </div>
              ) : assignedAccount ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      <h3 className="font-bold text-white">Secure Access Node Assigned</h3>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                      {assignedAccount.name || "Node Alpha"}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Login URL</label>
                        <a href={assignedAccount.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 font-medium bg-green-500/10 px-4 py-3 rounded-lg transition-colors">
                          {assignedAccount.url} <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Username / Email</label>
                          <div className="flex items-center gap-2 text-white font-mono bg-zinc-900 px-3 py-2 rounded border border-zinc-800">
                            <User className="w-4 h-4 text-zinc-500" /> {assignedAccount.username}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Password</label>
                          <div className="flex items-center gap-2 text-white font-mono bg-zinc-900 px-3 py-2 rounded border border-zinc-800">
                            <Key className="w-4 h-4 text-zinc-500" /> {assignedAccount.password}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800">
                      <p className="text-xs text-zinc-500 flex items-start gap-2 max-w-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> 
                        <span><strong>SECURITY WARNING:</strong> Do not share these credentials. Our system tracks device logins. If multiple IPs are detected, the password will auto-rotate and your NewtonsPlug account will be permanently banned without refund.</span>
                      </p>
                      <button 
                        onClick={copyCredentials}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {copiedCreds ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copiedCreds ? "Copied!" : "Copy Details"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                  <p className="text-zinc-400">Your account is active but no access node is assigned yet. Please refresh the page.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Referral System */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Refer & Earn Cash
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Earn ₦500 cash for every friend who subscribes using your link. Withdraw directly to your bank account!
            </p>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 flex-1 font-mono text-sm text-zinc-300 truncate">
                newtonsplug.com/ref/{userData?.uid?.substring(0, 8) || 'user'}
              </div>
              <button 
                onClick={copyToClipboard}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors shrink-0"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{userData?.referrals || 0}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Friends Referred</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">₦{userData?.discountEarned || 0}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Earnings</div>
              </div>
            </div>

            <a 
              href={`https://wa.me/2348032679011?text=Hi%20Newton,%20I%20want%20to%20withdraw%20my%20referral%20earnings%20of%20%E2%82%A6${userData?.discountEarned || 0}.%20My%20email%20is%20${userData?.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors border border-zinc-700"
            >
              Withdraw Funds
            </a>
          </div>

          {/* Account Details & Actions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Account Actions</h3>
            
            <div className="space-y-3 flex-1">
              <Link 
                to="/pricing"
                className="w-full flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group"
              >
                <span className="font-medium text-white">Renew Subscription</span>
                <span className="text-green-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <Link 
                to="/pricing"
                className="w-full flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group"
              >
                <span className="font-medium text-white">Upgrade Plan</span>
                <span className="text-green-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <a 
                href="https://wa.me/2348032679011"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group"
              >
                <span className="font-medium text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-zinc-400" /> Contact Support
                </span>
                <span className="text-green-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
