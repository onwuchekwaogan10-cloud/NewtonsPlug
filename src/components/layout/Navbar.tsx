import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlugZap, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Status", path: "/status" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <PlugZap className="w-8 h-8 text-green-500 relative z-10 group-hover:text-green-400 transition-colors" />
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full group-hover:bg-green-400/40 transition-all"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Newtons<span className="text-green-500">Plug</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-green-400 bg-green-500/10"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center gap-4 ml-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold text-zinc-950 bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all"
                  >
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-bold text-zinc-950 bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all"
                >
                  Login Portal
                </Link>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "text-green-400 bg-green-500/10"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-zinc-950 bg-green-500 hover:bg-green-400 text-center flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-zinc-800 text-center flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 mt-4 rounded-md text-base font-bold text-zinc-950 bg-green-500 hover:bg-green-400 text-center"
              >
                Login Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
