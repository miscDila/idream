import { useEffect, useRef } from 'react'

function WaitlistForm() {
  const formRef = useRef(null)
  const formInitialized = useRef(false)

  useEffect(() => {
    // Wait for HubSpot script to load and then create form
    const initForm = () => {
      if (window.hbspt && formRef.current && !formInitialized.current) {
        try {
          window.hbspt.forms.create({
            region: 'na2',
            portalId: '244684440',
            formId: '49318b89-e04e-488a-8cf9-ed653256e74d',
            target: formRef.current
          })
          formInitialized.current = true
        } catch (error) {
          console.error('Error creating HubSpot form:', error)
        }
      } else if (!formInitialized.current) {
        // Retry if script not loaded yet
        setTimeout(initForm, 100)
      }
    }

    // Check if script is already loaded
    if (window.hbspt) {
      initForm()
    } else {
      // Wait for script to load (it's in the HTML head with defer)
      const checkScript = setInterval(() => {
        if (window.hbspt) {
          clearInterval(checkScript)
          initForm()
        }
      }, 100)

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkScript)
        if (!formInitialized.current) {
          console.error('HubSpot form failed to load')
        }
      }, 10000)
    }
  }, [])

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

            {/* HubSpot Form Container */}
            <div ref={formRef} className="hubspot-form-container min-h-[200px]">
              <div className="text-gray-500 font-mono">Loading form...</div>
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

