import Hero from '../components/Hero'
import Features from '../components/Features'
import WaitlistForm from '../components/WaitlistForm'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <WaitlistForm />
      <Footer />
    </div>
  )
}

export default LandingPage

