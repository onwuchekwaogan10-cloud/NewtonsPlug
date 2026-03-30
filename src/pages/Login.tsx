import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlugZap, Lock, Mail, AlertCircle } from "lucide-react";
import { auth, db } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export default function Login() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms and Conditions to login.");
      return;
    }

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists, if not create them
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const referredBy = localStorage.getItem("referredBy");
        
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          role: "user",
          createdAt: new Date().toISOString(),
          referredBy: referredBy || null,
          referrals: 0,
          discountEarned: 0
        });
        
        // Clear the referral code from storage after it's used
        if (referredBy) {
          localStorage.removeItem("referredBy");
        }
      }
      
      // Navigation is handled by onAuthStateChanged
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login with Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="relative">
            <PlugZap className="w-12 h-12 text-green-500 relative z-10" />
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Secure Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Access your premium AI tools securely.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-zinc-900/80 backdrop-blur-xl py-8 px-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:px-10 border border-zinc-800">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 bg-zinc-950 border-zinc-800 rounded text-green-500 focus:ring-green-500 focus:ring-offset-zinc-900"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="text-zinc-400">
                    I agree to the <Link to="/terms" className="text-green-400 hover:text-green-300">Terms and Conditions</Link>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-zinc-950 bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-green-500 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in with Google"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-500">
                  First time here?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Access is created automatically after payment. <br/>
              <Link to="/pricing" className="font-medium text-green-400 hover:text-green-300 mt-2 inline-block">
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-zinc-600 mt-8">
          Protected by NewtonsPlug Security. No raw credentials are ever exposed.
        </p>
      </div>
    </div>
  );
}
