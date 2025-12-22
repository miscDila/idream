function Features() {
  const features = [
    {
      title: "Create Your Vision Board",
      description: "Build your digital 3D cork board with all your goals and dreams",
      icon: "📌"
    },
    {
      title: "Plan with AI",
      description: "Get personalized action plans powered by AI to achieve your goals",
      icon: "🤖"
    },
    {
      title: "Order Custom Stickers",
      description: "Turn your goals into physical sticker sheets for your pocket vision board",
      icon: "📦"
    },
    {
      title: "Track & Share Wins",
      description: "Celebrate your achievements and share with the community",
      icon: "🏆"
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Features
          </h2>
          <p className="font-mono text-2xl md:text-3xl text-gray-700">
            Everything you need to make your dreams come true
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all transform hover:scale-105 hover:rotate-1 fade-in slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Grid Paper Background for this card */}
              <div className="absolute inset-0 grid-paper-dark opacity-20 rounded-lg"></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-mono text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="font-mono text-lg text-gray-700">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

