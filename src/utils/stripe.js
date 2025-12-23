import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '../lib/supabase'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const getStripe = () => stripePromise

export const createCheckoutSession = async (isGift = false, giftRecipient = null) => {
  // Get auth token from Supabase
  const { data: { session } } = await supabase.auth.getSession()
  
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session ? `Bearer ${session.access_token}` : '',
    },
    body: JSON.stringify({
      isGift,
      giftRecipientEmail: giftRecipient?.email || null,
      giftRecipientName: giftRecipient?.name || null,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create checkout session')
  }

  const { sessionId } = await response.json()
  return sessionId
}

