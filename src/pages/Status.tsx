import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export default function Status() {
  const tools = [
    { name: "Grok AI (X Premium)", status: "operational", lastUpdated: "2 mins ago" },
    { name: "NewtonsPlug Portal", status: "operational", lastUpdated: "Just now" },
    { name: "Paystack Payments", status: "operational", lastUpdated: "5 mins ago" },
    { name: "WhatsApp Bot", status: "operational", lastUpdated: "10 mins ago" },
    { name: "ChatGPT Plus", status: "maintenance", lastUpdated: "1 hour ago", note: "Coming soon" },
    { name: "Canva Pro", status: "maintenance", lastUpdated: "1 hour ago", note: "Coming soon" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Service Status</h1>
          <p className="text-xl text-zinc-400">Real-time status of all NewtonsPlug tools and systems.</p>
        </div>

        {/* Overall Status Banner */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-400">All Core Systems Operational</h2>
            <p className="text-zinc-400 text-sm mt-1">Access to Grok AI and the portal is running smoothly.</p>
          </div>
        </div>

        {/* Individual Tools */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-bold text-white">System Components</h3>
          </div>
          
          <div className="divide-y divide-zinc-800">
            {tools.map((tool, i) => (
              <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                <div>
                  <h4 className="text-lg font-medium text-white flex items-center gap-2">
                    {tool.name}
                    {tool.note && <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">{tool.note}</span>}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2">
                    <Clock className="w-3 h-3" /> Last updated: {tool.lastUpdated}
                  </div>
                </div>
                
                <div>
                  {tool.status === 'operational' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-bold">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      OPERATIONAL
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      MAINTENANCE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
          <h3 className="text-lg font-bold text-white mb-2">Experiencing issues?</h3>
          <p className="text-zinc-400 mb-4 text-sm">If you're having trouble accessing a tool that shows as operational, please let us know.</p>
          <a 
            href="https://wa.me/2348032679011?text=Hi%20Newton,%20I%20am%20experiencing%20an%20issue%20with%20my%20access"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 font-bold text-sm underline underline-offset-4"
          >
            Report an issue via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
