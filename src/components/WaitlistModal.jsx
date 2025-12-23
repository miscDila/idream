import { useEffect } from 'react'

function WaitlistModal({ isOpen, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div 
        className="relative bg-white rounded-lg shadow-xl border-2 border-gray-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* Modal Content */}
        <div className="p-12">
          <div className="relative">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="font-mono text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Join the Waitlist
              </h2>
              <p className="font-mono text-2xl md:text-3xl text-gray-700 mb-8">
                Be the first to know when we launch
              </p>

              {/* HubSpot Form Container */}
              <div className="hubspot-form-container min-h-[400px]">
                <iframe
                  src="https://41ofq0.share-na2.hsforms.com/2STGLieBOSIqM-e1lMlbnTQ"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  className="w-full border-0"
                  title="HubSpot Waitlist Form"
                />
              </div>

              <p className="mt-6 text-sm text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitlistModal

