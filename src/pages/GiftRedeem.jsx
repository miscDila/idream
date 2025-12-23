import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function GiftRedeem() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { user, signIn, signUp } = useAuth()
  const [giftInfo, setGiftInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid redemption link')
      setLoading(false)
      return
    }

    // Verify gift token and get gift info
    verifyGiftToken(token)
  }, [token])

  const verifyGiftToken = async (token) => {
    try {
      const { data, error } = await supabase
        .from('golden_tickets')
        .select('*, purchaser:users!golden_tickets_purchaser_id_fkey(full_name, email)')
        .eq('gift_token', token)
        .eq('is_gift', true)
        .is('gift_redeemed_at', null)
        .single()

      if (error) throw error
      setGiftInfo(data)
    } catch (err) {
      setError('Invalid or already redeemed gift token')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (e) => {
    e.preventDefault()
    setError('')
    setRedeeming(true)

    try {
      // If user is not logged in, create account or sign in
      if (!user) {
        if (isSignUp) {
          await signUp(email, password, fullName)
        } else {
          await signIn(email, password)
        }
        // Wait a moment for auth to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Redeem the gift
      const { error: redeemError } = await supabase
        .from('golden_tickets')
        .update({
          recipient_id: user?.id || (await supabase.auth.getUser()).data.user?.id,
          gift_redeemed_at: new Date().toISOString(),
        })
        .eq('gift_token', token)

      if (redeemError) throw redeemError

      // Update user's golden ticket status
      const userId = user?.id || (await supabase.auth.getUser()).data.user?.id
      await supabase
        .from('users')
        .update({
          has_golden_ticket: true,
          golden_ticket_purchased_at: new Date().toISOString(),
        })
        .eq('id', userId)

      navigate('/dashboard?redeemed=true')
    } catch (err) {
      setError(err.message || 'Failed to redeem gift')
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error && !giftInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10 text-center">
              <h1 className="font-mono text-4xl font-bold text-gray-900 mb-4">
                Invalid Gift Link
              </h1>
              <p className="font-mono text-xl text-gray-700 mb-6">{error}</p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎁</div>
              <h1 className="font-mono text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                You've Received a Golden Ticket!
              </h1>
              {giftInfo && (
                <p className="font-mono text-xl text-gray-700">
                  {giftInfo.gift_recipient_name} - A gift from {giftInfo.purchaser?.full_name || 'someone special'}
                </p>
              )}
            </div>

            {!user ? (
              <div>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`mr-4 px-6 py-3 rounded-lg border-2 font-mono ${
                      !isSignUp
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`px-6 py-3 rounded-lg border-2 font-mono ${
                      isSignUp
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleRedeem} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required={isSignUp}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                        placeholder={giftInfo?.gift_recipient_name || 'John Doe'}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                      placeholder={giftInfo?.gift_recipient_email || 'you@example.com'}
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                      <p className="font-mono text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={redeeming}
                    className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg disabled:opacity-50"
                  >
                    {redeeming ? 'Redeeming...' : 'Redeem Golden Ticket'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-mono text-xl text-gray-700 mb-6">
                  You're signed in! Click below to redeem your Golden Ticket.
                </p>
                <button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg disabled:opacity-50"
                >
                  {redeeming ? 'Redeeming...' : 'Redeem Golden Ticket'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

