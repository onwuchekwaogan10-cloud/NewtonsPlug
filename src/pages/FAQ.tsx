import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Grok AI and why should I use it?",
      a: "Grok AI is an advanced artificial intelligence developed by xAI (Elon Musk's company). It has real-time access to the X (Twitter) platform, making it incredibly powerful for up-to-date research, content creation, and coding. It's known for being fast, witty, and having fewer restrictions than other AI models."
    },
    {
      q: "Why is NewtonsPlug cheaper than subscribing directly?",
      a: "We purchase premium accounts in bulk and manage them securely through our proprietary portal. By optimizing device slots and session times, we can split the cost among users (for shared plans) or offer discounted dedicated access, passing the savings directly to you."
    },
    {
      q: "How do I receive my access after payment?",
      a: "Access is instant. Once your Paystack payment is successful, our system automatically activates your account. You'll receive a WhatsApp message with login instructions, and you can immediately log into the NewtonsPlug portal to start using the tools."
    },
    {
      q: "Can I share my login details with someone else?",
      a: "No. Sharing your NewtonsPlug portal login is strictly prohibited and violates our terms. Our system monitors IP addresses and simultaneous device logins. If you exceed your plan's device limit, your account will be automatically flagged and suspended without refund."
    },
    {
      q: "How many devices can I use at the same time?",
      a: "It depends on your plan. The Starter Plan allows 2 devices, the Pro Plan allows 1 device, and the Creator Plan allows 2 devices. If you try to log in on more devices, access will be blocked until you log out of an existing session."
    },
    {
      q: "What happens if the service goes down?",
      a: "If the underlying AI tool (like Grok) is down for maintenance, or our portal experiences an outage lasting more than 24 hours, we will automatically extend your subscription by the exact number of days lost. You never lose money on downtime."
    },
    {
      q: "How do I renew my subscription?",
      a: "You will receive an automated WhatsApp reminder 3 days, 1 day, and on the day of your expiry. You can click the renewal link in the message, or click the 'Renew Subscription' button directly inside your User Dashboard."
    },
    {
      q: "Is my payment information safe?",
      a: "100% safe. We do not store your card details. All payments are processed securely by Paystack, Africa's leading payment gateway."
    },
    {
      q: "What is the free trial and how do I get it?",
      a: "We offer a 24-hour free trial to let you test the portal and Grok AI. We limit this to 10 slots per month to prevent abuse. Click the 'Claim Free Trial' button on the homepage to request a slot via WhatsApp."
    },
    {
      q: "How does the referral program work?",
      a: "Inside your dashboard, you have a unique referral link. When a friend signs up using your link, they get ₦500 off their first purchase, and you get ₦500 credit applied automatically to your next renewal."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-zinc-400">Everything you need to know about NewtonsPlug.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border ${openIndex === index ? 'border-green-500/50 bg-zinc-900/80' : 'border-zinc-800 bg-zinc-900/30'} rounded-xl overflow-hidden transition-all duration-200`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-green-400' : 'text-white'}`}>
                  {faq.q}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-zinc-400 mb-6">We're here to help. Send us a message on WhatsApp.</p>
          <a 
            href="https://wa.me/2348032679011?text=Hi%20Newton,%20I%20have%20a%20question%20about%20NewtonsPlug"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg transition-colors"
          >
            Chat with Support
          </a>
        </div>
      </div>
    </div>
  );
}
