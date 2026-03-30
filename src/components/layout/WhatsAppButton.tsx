import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi Newton, I need help with NewtonsPlug");
  const whatsappUrl = `https://wa.me/2348032679011?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-zinc-950 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
      <MessageCircle className="w-7 h-7 relative z-10" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-800 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-700">
        Need help? Chat with us
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-zinc-800 border-r border-t border-zinc-700"></div>
      </div>
    </a>
  );
}
