import { useState, useEffect } from "react";
import { Check, Zap, Star, Crown } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";

const SubscribeButton = ({ plan, user, isMonthly, navigate }: { plan: any, user: User | null, isMonthly: boolean, navigate: any }) => {
  const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_0e1fc0fab152766ae7ab819f5d28d69298d4d0fe";

  const config = {
    reference: (new Date()).getTime().toString() + "_" + Math.floor(Math.random() * 1000000),
    email: user?.email || "guest@example.com",
    amount: plan.priceAmount * 100,
    publicKey: PAYSTACK_KEY,
    text: `Choose ${plan.name.split(' ')[0]}`,
  };

  const initializePayment = usePaystackPayment(config) as any;

  const handleSuccess = async (reference: any) => {
    if (!user) return;
    
    const days = isMonthly ? 30 : 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const planNameRaw = plan.name.split(' ')[0];
    const planName = planNameRaw.charAt(0) + planNameRaw.slice(1).toLowerCase();
    const devicesTotal = planName === "Starter" ? 2 : planName === "Pro" ? 1 : 2;

    try {
      await setDoc(doc(db, "subscriptions", user.uid), {
        userId: user.uid,
        plan: planName,
        status: "Active",
        expiresAt: expiresAt.toISOString(),
        devicesTotal: devicesTotal,
        devicesActive: 0,
        createdAt: new Date().toISOString(),
        reference: reference.reference
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving subscription:", error);
      alert("Payment successful but activation failed. Please contact support.");
    }
  };

  const handleClose = () => {
    console.log("Payment window closed.");
  };

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!PAYSTACK_KEY) {
      alert("Paystack Public Key is missing. Please add VITE_PAYSTACK_PUBLIC_KEY to your environment variables in AI Studio settings.");
      return;
    }
    initializePayment(handleSuccess, handleClose);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 rounded-xl font-bold text-center transition-all mt-auto ${
        plan.popular 
          ? 'bg-green-500 text-zinc-950 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
          : 'bg-zinc-800 text-white hover:bg-zinc-700'
      }`}
    >
      Choose {plan.name.split(' ')[0]}
    </button>
  );
};

export default function Pricing() {
  const [isMonthly, setIsMonthly] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const plans = [
    {
      name: "STARTER PLAN",
      icon: Zap,
      price: isMonthly ? "₦6,500" : "₦2,000",
      priceAmount: isMonthly ? 6500 : 2000,
      period: isMonthly ? "/month" : "/week",
      originalPrice: isMonthly ? "₦41,531.70" : "₦10,380",
      description: "Best for: Casual users and beginners",
      features: [
        "2 users sharing one account",
        "Grok AI access",
        "2 device slots",
        "Standard session priority",
        "24 hour support response",
        "Account rotated monthly"
      ],
      popular: false
    },
    {
      name: "PRO PLAN",
      icon: Star,
      price: isMonthly ? "₦11,000" : "₦3,500",
      priceAmount: isMonthly ? 11000 : 3500,
      period: isMonthly ? "/month" : "/week",
      originalPrice: isMonthly ? "₦83,063.40" : "₦20,765",
      description: "Best for: Daily users and professionals",
      features: [
        "1 dedicated user",
        "Grok AI access",
        "1 device slot",
        "Medium session priority",
        "12 hour support response",
        "Dedicated account not shared",
        "Renewal reminder included"
      ],
      popular: true
    },
    {
      name: "CREATOR PLAN",
      icon: Crown,
      price: isMonthly ? "₦16,000" : "₦5,500",
      priceAmount: isMonthly ? 16000 : 5500,
      period: isMonthly ? "/month" : "/week",
      originalPrice: isMonthly ? "₦124,595.10" : "₦31,150",
      description: "Best for: YouTubers, creators, and businesses",
      features: [
        "1 dedicated user",
        "Grok AI access",
        "2 device slots",
        "Highest session priority",
        "Instant support response (1hr)",
        "Reserved account never rotated",
        "First access to new tools",
        "Free AI prompt pack included",
        "Renewal reminder included"
      ],
      popular: false
    }
  ];

  return (
    <div className="py-20 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-zinc-400">Choose the perfect plan for your AI needs. No hidden fees, cancel anytime.</p>
          
          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isMonthly ? 'text-white' : 'text-zinc-500'}`}>Weekly</span>
            <button 
              onClick={() => setIsMonthly(!isMonthly)}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-zinc-800 border border-zinc-700 transition-colors focus:outline-none"
            >
              <span 
                className={`inline-block h-6 w-6 transform rounded-full bg-green-500 transition-transform ${isMonthly ? 'translate-x-9' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isMonthly ? 'text-white' : 'text-zinc-500'}`}>
              Monthly <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Save up to 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-2xl border ${plan.popular ? 'border-green-500 bg-zinc-900/80 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-zinc-800 bg-zinc-900/40'} p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${plan.popular ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">{plan.name}</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                <div className="text-sm text-zinc-500 mt-1">
                  Market price: <span className="line-through">{plan.originalPrice}</span>
                </div>
              </div>
              
              <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <SubscribeButton plan={plan} user={user} isMonthly={isMonthly} navigate={navigate} />
            </div>
          ))}
        </div>

        {/* Savings Table */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">See How Much You Save</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="p-4 text-sm font-semibold text-zinc-400">Plan</th>
                  <th className="p-4 text-sm font-semibold text-zinc-400">NewtonsPlug</th>
                  <th className="p-4 text-sm font-semibold text-zinc-400">SuperGrok</th>
                  <th className="p-4 text-sm font-semibold text-green-400">You Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="p-4 text-sm text-white font-medium">Starter Monthly</td>
                  <td className="p-4 text-sm text-zinc-300">₦6,500</td>
                  <td className="p-4 text-sm text-zinc-500">₦41,531.70</td>
                  <td className="p-4 text-sm text-green-400 font-bold">₦35,031.70</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-white font-medium">Pro Monthly</td>
                  <td className="p-4 text-sm text-zinc-300">₦11,000</td>
                  <td className="p-4 text-sm text-zinc-500">₦83,063.40 <span className="text-xs">(2 months value)</span></td>
                  <td className="p-4 text-sm text-green-400 font-bold">₦72,063.40</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-white font-medium">Creator Monthly</td>
                  <td className="p-4 text-sm text-zinc-300">₦16,000</td>
                  <td className="p-4 text-sm text-zinc-500">₦124,595.10 <span className="text-xs">(3 months value)</span></td>
                  <td className="p-4 text-sm text-green-400 font-bold">₦108,595.10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
