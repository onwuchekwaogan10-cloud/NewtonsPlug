export default function Terms() {
  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
          <p className="text-zinc-400 mb-8">Last Updated: March 2026</p>
          
          <div className="space-y-8 text-zinc-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using NewtonsPlug ("the Service"), you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our service. NewtonsPlug is a product of Newtons Digital Plug.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>
                NewtonsPlug provides shared and dedicated access to premium third-party AI tools (such as Grok AI) via a secure portal. 
                We do not own these tools, nor are we affiliated with X Corp, Anthropic, OpenAI, or Canva. We manage access credentials 
                and provide a secure gateway for usage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Account Sharing & Device Limits</h2>
              <p className="text-red-400 font-bold mb-2">STRICTLY PROHIBITED:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sharing your NewtonsPlug portal access with anyone outside your purchased plan limit.</li>
                <li>Attempting to extract, view, or change the raw credentials of the underlying AI tool accounts.</li>
                <li>Using more devices simultaneously than your plan allows (Starter: 2, Pro: 1, Creator: 2).</li>
              </ul>
              <p className="mt-4 font-bold text-white">
                Violation of these rules will result in an immediate, permanent ban without refund. Our system automatically flags suspicious IP addresses and simultaneous logins.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Refunds and Downtime</h2>
              <p>
                <strong>No Refunds:</strong> Due to the digital nature of the service, all sales are final. We do not offer refunds once access has been granted.
              </p>
              <p className="mt-4">
                <strong>Downtime Compensation:</strong> If the underlying AI service (e.g., Grok AI) goes down, or our portal experiences downtime lasting more than 24 consecutive hours, your subscription will be extended by the equivalent number of days lost.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Account Suspension</h2>
              <p>
                NewtonsPlug reserves the right to suspend or terminate any account at any time for suspicious activity, abuse of the AI tools (violating their respective terms of service), or violation of these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data</h2>
              <p>
                We collect your name, email, phone number, and IP address solely for the purpose of providing the service, preventing abuse, and processing payments. We do not sell your data. Payments are processed securely via Paystack.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
