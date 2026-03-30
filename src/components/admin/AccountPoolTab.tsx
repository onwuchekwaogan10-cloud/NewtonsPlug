import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Edit2, Users, Link as LinkIcon, Key, User } from "lucide-react";
import { handleFirestoreError, OperationType } from "../../lib/firestore-errors";

export default function AccountPoolTab() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    url: "https://x.com/i/grok",
    username: "",
    password: "",
    maxUsers: 4
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "access_accounts"),
      (snapshot) => {
        const accs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccounts(accs);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "access_accounts");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "access_accounts"), {
        ...formData,
        currentUsers: 0,
        assignedUsers: [],
        status: "active",
        createdAt: new Date().toISOString()
      });
      setIsAdding(false);
      setFormData({
        name: "",
        url: "https://x.com/i/grok",
        username: "",
        password: "",
        maxUsers: 4
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "access_accounts");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this account? Users assigned to it will lose access.")) return;
    try {
      await deleteDoc(doc(db, "access_accounts", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `access_accounts/${id}`);
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading accounts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div>
          <h2 className="text-lg font-bold text-white">Access Account Pool</h2>
          <p className="text-sm text-zinc-400">Manage X/Grok accounts that are automatically assigned to users.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg transition-colors"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> Add Account</>}
        </button>
      </div>

      {isAdding && (
        <div className="p-6 border-b border-zinc-800 bg-zinc-950">
          <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Display Name (e.g., Node Alpha)</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Max Users Allowed</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.maxUsers}
                onChange={e => setFormData({...formData, maxUsers: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Login URL</label>
              <input 
                required
                type="url" 
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Username / Email</label>
              <input 
                required
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
              <input 
                required
                type="text" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg transition-colors">
                Save Account to Pool
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-zinc-500">
            No accounts in the pool. Add one to start automatically assigning users.
          </div>
        )}
        
        {accounts.map(account => {
          const isFull = account.currentUsers >= account.maxUsers;
          
          return (
            <div key={account.id} className={`bg-zinc-950 border ${isFull ? 'border-yellow-500/30' : 'border-zinc-800'} rounded-xl p-5 relative overflow-hidden`}>
              {isFull && <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg">FULL</div>}
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{account.name}</h3>
                <button onClick={() => handleDelete(account.id)} className="text-zinc-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <User className="w-4 h-4" /> {account.username}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Key className="w-4 h-4" /> {account.password}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400 truncate">
                  <LinkIcon className="w-4 h-4 shrink-0" /> <a href={account.url} target="_blank" rel="noreferrer" className="hover:text-green-400 truncate">{account.url}</a>
                </div>
              </div>
              
              <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Users className="w-4 h-4 text-green-500" />
                  Assigned Users
                </div>
                <div className={`font-mono text-sm font-bold ${isFull ? 'text-yellow-500' : 'text-green-400'}`}>
                  {account.currentUsers} / {account.maxUsers}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
