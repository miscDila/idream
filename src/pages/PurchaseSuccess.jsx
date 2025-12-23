import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PurchaseSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isGift = searchParams.get('is_gift') === 'true'
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Refresh user profile to get updated golden ticket status
    if (sessionId) {
      if (user) {
        refreshProfile()
      }
      setLoading(false)
    }
  }, [sessionId, refreshProfile, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {isGift ? 'Gift Sent Successfully!' : 'Purchase Successful!'}
            </h1>
            <p className="font-mono text-2xl text-gray-700 mb-8">
              {isGift
                ? "We've sent an email to the recipient with instructions to redeem their Golden Ticket."
                : 'Your Golden Ticket is now active. Start using all features!'}
            </p>

            {!isGift && (
              <div className="space-y-4 mb-8">
                <p className="font-mono text-lg text-gray-700 mb-4">
                  {user 
                    ? 'Your Golden Ticket is active!'
                    : "We've created an account for you. Check your email for login instructions."}
                </p>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}

            <div className="mt-8 pt-8 border-t-2 border-gray-300">
              <p className="font-mono text-sm text-gray-600">
                Questions? Contact us at support@idream.club
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

