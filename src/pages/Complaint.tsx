import { MessageSquare, Clock, CheckCircle, ShieldAlert } from "lucide-react";

export default function Complaint() {
  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Complaint Policy</h1>
          <p className="text-xl text-zinc-400">We take your experience seriously. Here is how we handle issues.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Step 1: Report</h3>
            <p className="text-sm text-zinc-400">Message 08032679011 on WhatsApp with your complaint and registered email.</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Step 2: Response</h3>
            <p className="text-sm text-zinc-400">We guarantee a response within 2 hours during our business hours (8am - 10pm).</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Step 3: Resolution</h3>
            <p className="text-sm text-zinc-400">Full resolution within 24 hours. Downtime complaints are handled within 1 hour.</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Our Commitment to You</h2>
          </div>
          
          <div className="space-y-6 text-zinc-300">
            <p>
              At Newtons Digital Plug, building trust with the Nigerian creator and business community is our top priority. We understand that you rely on these AI tools for your work, and any disruption costs you time and money.
            </p>
            
            <h3 className="text-lg font-bold text-white mt-8 mb-2">Downtime Compensation</h3>
            <p>
              If you experience an issue that prevents you from accessing the service for more than 24 hours (whether due to our portal or the underlying AI provider), we will automatically extend your subscription by the equivalent number of days lost. You will never pay for time you couldn't use.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 mb-2">Before Posting on Social Media</h3>
            <p>
              We kindly ask that you follow this complaint process before airing grievances on social media. 99% of issues are simple technical glitches (like a stuck session or browser cache) that our support team can fix in minutes via WhatsApp.
            </p>

            <div className="mt-10 p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-center">
              <p className="text-white font-bold mb-4">Ready to report an issue?</p>
              <a 
                href="https://wa.me/2348032679011?text=Hi%20Newton,%20I%20have%20a%20complaint%20about%20my%20NewtonsPlug%20access"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg transition-colors"
              >
                Message Support Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
