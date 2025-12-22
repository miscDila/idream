function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Tap NFC Sticker",
      description: "Tap your NFC sticker on your physical vision board to open your digital board"
    },
    {
      number: "2",
      title: "Add Your Goals",
      description: "Create sticky notes with your dreams and goals on your 3D cork board"
    },
    {
      number: "3",
      title: "Order Custom Stickers",
      description: "Turn your goals into physical sticker sheets you can stick anywhere"
    },
    {
      number: "4",
      title: "Track & Celebrate",
      description: "Mark goals complete, share wins, and watch your dreams become reality"
    }
  ]

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="font-mono text-2xl md:text-3xl text-gray-700">
            Simple steps to turn your vision into reality
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col md:flex-row items-center gap-8 p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all fade-in slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Grid Paper Background */}
              <div className="absolute inset-0 grid-paper-dark opacity-15 rounded-lg"></div>
              
              <div className="relative z-10 flex-shrink-0">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg">
                  <span className="font-mono text-3xl font-bold text-white">
                    {step.number}
                  </span>
                </div>
              </div>
              
              <div className="relative z-10 flex-1 text-center md:text-left">
                <h3 className="font-mono text-2xl font-bold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="font-mono text-xl text-gray-700">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

