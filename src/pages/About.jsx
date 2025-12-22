import Footer from '../components/Footer'

function About() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-mono text-5xl font-bold mb-8">About iDream.club</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="font-mono text-2xl text-gray-700 mb-6">
              We believe that writing down your dreams is the first step to making them come true.
            </p>
            <p className="font-mono text-lg text-gray-700 mb-4">
              iDream.club combines the power of digital planning with the tangible reminder of physical vision boards. 
              Create your goals on our 3D interactive cork board, get AI-powered action plans, and order custom sticker 
              sheets to keep your dreams visible every day.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Our Mission</h2>
            <p className="font-mono text-lg text-gray-700">
              To help people turn their dreams into reality through visualization, planning, and action.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="font-mono text-3xl font-bold mb-4">Contact</h2>
            <p className="font-mono text-lg text-gray-700">
              Have questions? Reach out to us at hello@idream.club
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About

