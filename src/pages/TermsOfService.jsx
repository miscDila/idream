import Footer from '../components/Footer'

function TermsOfService() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-mono text-5xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="font-mono text-xl text-gray-700 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Service Description</h2>
            <p className="font-mono text-lg text-gray-700">
              iDream.club provides a digital vision board platform where users can create goals, 
              plan with AI, and order custom printed sticker sheets.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">User Responsibilities</h2>
            <p className="font-mono text-lg text-gray-700 mb-4">
              Users are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-mono text-lg text-gray-700">
              <li>Providing accurate information</li>
              <li>Maintaining the security of their account</li>
              <li>Using the service in compliance with applicable laws</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Custom Products</h2>
            <p className="font-mono text-lg text-gray-700">
              Custom sticker sheets are made-to-order and non-refundable once printing begins. 
              Refunds are available for orders cancelled within 24 hours.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Contact Us</h2>
            <p className="font-mono text-lg text-gray-700">
              If you have questions about these Terms, please contact us at hello@idream.club
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsOfService

