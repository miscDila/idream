import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoldenTicketCard from '../components/Purchase/GoldenTicketCard'
import PurchaseTypeSelector from '../components/Purchase/PurchaseTypeSelector'
import GiftForm from '../components/Purchase/GiftForm'
import { getStripe, createCheckoutSession } from '../utils/stripe'

function PurchasePage() {
  const [isGift, setIsGift] = useState(false)
  const [giftRecipient, setGiftRecipient] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()

  // Check if logged-in user already has a golden ticket
  if (user && userProfile?.has_golden_ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10 text-center">
              <h2 className="font-mono text-4xl font-bold text-gray-900 mb-4">
                You Already Have a Golden Ticket!
              </h2>
              <p className="font-mono text-xl text-gray-700 mb-6">
                You're all set. Head to your dashboard to start using your features.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlePurchase = async () => {
    if (isGift && (!giftRecipient.name || !giftRecipient.email)) {
      setError('Please fill in all gift recipient information')
      return
    }

    setLoading(true)
    setError('')

    try {
      const sessionId = await createCheckoutSession(isGift, isGift ? giftRecipient : null)
      const stripe = await getStripe()
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err) {
      setError(err.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-mono text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Get Your Golden Ticket
          </h1>
          <p className="font-mono text-2xl text-gray-700 mb-2">
            Lifetime access to all features - $150
          </p>
          <p className="font-mono text-lg text-gray-600">
            {isGift 
              ? '🎁 Give the gift of achieving dreams - recipient gets an email with their Golden Ticket'
              : 'Purchase for yourself or as a gift - no account needed to start'}
          </p>
        </div>

        {!user && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg text-center">
            <p className="font-mono text-sm text-blue-800">
              💡 You can purchase without an account. We'll create one for you after payment, or you can{' '}
              <Link to="/login" className="underline font-bold">sign in first</Link> if you already have an account.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <GoldenTicketCard />
          </div>

          <div className="relative p-8 bg-white rounded-lg shadow-xl border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            
            <div className="relative z-10">
              <PurchaseTypeSelector isGift={isGift} onChange={setIsGift} />

              {isGift && (
                <GiftForm recipient={giftRecipient} onChange={setGiftRecipient} />
              )}

              {!isGift && !user && (
                <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                  <p className="font-mono text-sm text-amber-800 mb-2">
                    <strong>For yourself:</strong> We'll create an account for you using your email from Stripe checkout.
                  </p>
                  <p className="font-mono text-sm text-amber-800">
                    After payment, you'll receive login instructions via email.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-3">
                  <p className="font-mono text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-2xl rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Purchase for $150`}
              </button>

              <p className="mt-4 font-mono text-sm text-center text-gray-600">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchasePage

