import { Link } from "react-router-dom";
import { CheckCircle2, Shield, Zap, Clock, Users, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShownExitIntent]);

  const tools = ["Grok AI", "ChatGPT", "Canva Pro", "Midjourney", "Adobe Firefly", "More Coming Soon"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-green-500/30 p-8 rounded-2xl max-w-md w-full relative shadow-[0_0_50px_rgba(34,197,94,0.15)]"
          >
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-white mb-2">Wait! Don't leave yet.</h3>
            <p className="text-zinc-300 mb-6">
              Get your first week for <span className="text-green-400 font-bold">₦1,000</span> today only.
            </p>
            <a 
              href="https://wa.me/2348032679011?text=Hi%20Newton,%20I%20want%20to%20claim%20my%20N1000%20first%20week%20offer"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg text-center transition-colors"
              onClick={() => setShowExitIntent(false)}
            >
              WhatsApp Us Now to Claim
            </a>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-zinc-950 to-zinc-950"></div>
        
        {/* Animated particles/glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Access Premium AI Tools <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Without Paying Full Price
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto">
              Grok AI, ChatGPT, Canva Pro and more — Weekly Plans from ₦2,000. 
              Built for Nigerian creators, businesses, and students.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/pricing"
                className="px-8 py-4 bg-green-500 text-zinc-950 font-bold text-lg rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:bg-green-400 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Get Access Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/pricing"
                className="px-8 py-4 bg-zinc-800 text-white font-bold text-lg rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700 w-full sm:w-auto justify-center flex"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Savings Banner */}
      <section className="bg-zinc-900 border-y border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
            <div className="text-zinc-400 text-base md:text-lg">
              SuperGrok price: <span className="line-through decoration-red-500">₦41,531.70/month</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-zinc-700"></div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-green-500 fill-green-500 shrink-0" />
              <span>From <span className="text-green-400">₦2,000/week</span> on NewtonsPlug</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-green-500/10 border-b border-green-500/20 py-3 overflow-hidden flex">
        <motion.div 
          className="flex whitespace-nowrap gap-8 items-center"
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...tools, ...tools, ...tools].map((tool, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-green-400 font-bold tracking-wider uppercase text-sm">{tool}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* How It Works */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Get premium access in three simple steps. No complicated setups, no VPNs required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Your Plan", desc: "Select a weekly or monthly plan and pay securely via Paystack." },
              { step: "02", title: "Instant Access", desc: "Receive instant access through your personal secure dashboard." },
              { step: "03", title: "Start Creating", desc: "Start using premium AI tools immediately without limits." }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
                <div className="text-7xl font-extrabold text-zinc-800/40 absolute top-4 right-6 group-hover:text-green-500/10 transition-colors pointer-events-none">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                <p className="text-zinc-400 relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: CheckCircle2, text: "100% Working Access" },
              { icon: Zap, text: "Instant Activation" },
              { icon: Users, text: "Nigerian Support" },
              { icon: Shield, text: "Secure Encrypted Portal" },
              { icon: Shield, text: "Paystack Secured" }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                  <badge.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-zinc-300">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial Banner */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-green-500/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Not sure yet? Try 24 hours FREE</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Limited to 10 slots monthly. Experience the full power of Grok AI before you pay a dime.
            </p>
            <a 
              href="https://wa.me/2348032679011?text=Hi%20Newton,%20I%20want%20to%20claim%20my%20free%2024%20hour%20trial%20on%20NewtonsPlug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-green-400 font-bold rounded-lg border border-green-500/50 hover:bg-green-500/10 transition-colors"
            >
              Claim Free Trial via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-bold mb-6">
              <Users className="w-4 h-4" /> Join 5000+ Nigerians already using NewtonsPlug
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Chidi O.", plan: "Pro Plan User", quote: "Been using this for my YouTube scripts. Grok is insanely fast and NewtonsPlug makes it so affordable." },
              { name: "Sarah T.", plan: "Starter Plan User", quote: "I was skeptical about shared accounts but the portal is so secure. Never had a single login issue in 3 weeks." },
              { name: "Emmanuel K.", plan: "Creator Plan User", quote: "The dedicated access is perfect. Support responds on WhatsApp in minutes. Highly recommended for freelancers." }
            ].map((review, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
                <div className="flex gap-1 text-green-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-zinc-300 mb-6 italic">"{review.quote}"</p>
                <div>
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-sm text-zinc-500">{review.plan}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Got Questions?</h2>
          <p className="text-zinc-400 mb-8">We've got answers. Check out our full FAQ page to learn more about how NewtonsPlug works.</p>
          <Link 
            to="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Read Full FAQ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
