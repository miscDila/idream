function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Paper Section Background */}
      <div className="absolute inset-0 grid-paper-section opacity-30"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Coming Soon Badge - Sticky Note Style */}
        <div className="inline-block mb-6 px-4 py-2 bg-amber-100 border-2 border-amber-300 rounded-lg transform rotate-[-2deg] shadow-md fade-in">
          <span className="font-mono text-2xl text-amber-800">Coming Soon</span>
        </div>
        
        {/* Main Headline - Font Mono */}
        <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900 fade-in slide-up">
          Turn Your Dreams
          <br />
          Into Reality
        </h1>
        
        {/* CTA Button */}
        <div className="mt-12 fade-in slide-up stagger-2">
          <a
            href="#waitlist"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-2xl rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero

