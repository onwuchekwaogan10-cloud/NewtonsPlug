import { Link } from "react-router-dom";
import { PlugZap, Facebook, Instagram, MessageCircle, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <PlugZap className="w-6 h-6 text-green-500" />
              <span className="text-lg font-bold tracking-tight text-white">
                Newtons<span className="text-green-500">Plug</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-md mb-6">
              Access premium AI tools without paying full price. Grok AI, ChatGPT, Canva Pro, and more. 
              A product of Newtons Digital Plug.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/2348032679011" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors">
                <span className="sr-only">WhatsApp</span>
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61584809170154" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/newtonsdigitalplug/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@newtonsdigitalplug" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors">
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/newtons-digital-plug-a52624302/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">Pricing</Link></li>
              <li><Link to="/login" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">Login Portal</Link></li>
              <li><Link to="/faq" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">Terms and Conditions</Link></li>
              <li><Link to="/complaint" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">Complaint Policy</Link></li>
              <li><Link to="/status" className="text-sm text-zinc-400 hover:text-green-400 transition-colors">Service Status</Link></li>
              <li><span className="text-sm text-zinc-400">WhatsApp: 08032679011</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Newtons Digital Plug. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500 text-center md:text-right max-w-xl">
            NewtonsPlug is an independent access reselling service and is not affiliated with, endorsed by, or connected to X Corp, Grok AI, Anthropic, OpenAI, Canva, or any other third party tool listed on this platform. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
