function ProductPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Your Vision Board
          </h2>
          <p className="font-mono text-2xl md:text-3xl text-gray-700">
            See your dreams come to life
          </p>
        </div>

        {/* Preview Container with Grid Paper */}
        <div className="relative p-12 bg-white rounded-lg shadow-2xl border-2 border-gray-300 fade-in slide-up">
          <div className="absolute inset-0 grid-paper-section opacity-30 rounded-lg"></div>
          
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <div className="inline-block px-6 py-3 bg-amber-100 border-2 border-amber-300 rounded-lg transform rotate-1 shadow-md">
                <span className="font-mono text-xl text-amber-800">3D Interactive Cork Board</span>
              </div>
            </div>
            
            {/* Placeholder for Spline scene or mockup */}
            <div className="bg-gray-100 rounded-lg p-20 mb-8 border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
              <p className="font-mono text-2xl text-gray-500">
                Your 3D vision board preview will appear here
              </p>
            </div>
            
            <p className="font-mono text-xl text-gray-700">
              Add goals, plan with AI, and order custom sticker sheets
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPreview

