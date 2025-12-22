function WaitlistForm() {
  return (
    <section id="waitlist" className="py-20 px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Section with Grid Paper */}
        <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="font-mono text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Join the Waitlist
            </h2>
            <p className="font-mono text-2xl md:text-3xl text-gray-700 mb-8">
              Be the first to know when we launch
            </p>

            {/* HubSpot Form Container - Using the exact embed code you provided */}
            <div className="hubspot-form-container">
              <div 
                className="hs-form-frame" 
                data-region="na2" 
                data-form-id="49318b89-e04e-488a-8cf9-ed653256e74d" 
                data-portal-id="244684440"
              ></div>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WaitlistForm

