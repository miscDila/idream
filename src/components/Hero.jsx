import { useState } from 'react'
import WaitlistModal from './WaitlistModal'

function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Grid Paper Section Background */}
        <div className="absolute inset-0 grid-paper-section opacity-30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Main Headline - Font Mono */}
          <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900 fade-in slide-up">
            Turn Your Dreams
            <br />
            Into Reality
          </h1>
          
          {/* Subheadline with Golden Ticket Info */}
          <div className="mb-8 fade-in slide-up stagger-1">
            <p className="font-mono text-2xl md:text-3xl text-gray-700 mb-4">
              Get Your Golden Ticket - $150 for Lifetime Access
            </p>
            <p className="font-mono text-xl md:text-2xl text-gray-600">
              The perfect gift to help someone achieve their goals for life
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-12 fade-in slide-up stagger-2 flex gap-4 justify-center flex-wrap">
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-2xl rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Join the Waitlist
            </button>
            <a
              href="/purchase"
              className="inline-block px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-mono text-2xl rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Get Golden Ticket
            </a>
          </div>
        </div>
      </section>
      <WaitlistModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default Hero

