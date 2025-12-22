import Footer from '../components/Footer'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-mono text-5xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="font-mono text-xl text-gray-700 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Information We Collect</h2>
            <p className="font-mono text-lg text-gray-700 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-mono text-lg text-gray-700">
              <li>Email address (for waitlist signups)</li>
              <li>Name and contact information (when placing orders)</li>
              <li>Shipping address (for order fulfillment)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">How We Use Your Information</h2>
            <p className="font-mono text-lg text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-mono text-lg text-gray-700">
              <li>Send you updates about our launch</li>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders</li>
              <li>Improve our services</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">HubSpot Integration</h2>
            <p className="font-mono text-lg text-gray-700">
              We use HubSpot to manage our contact list and send you updates. 
              Your email address will be stored in HubSpot and subject to their privacy policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Contact Us</h2>
            <p className="font-mono text-lg text-gray-700">
              If you have questions about this Privacy Policy, please contact us at hello@idream.club
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy

