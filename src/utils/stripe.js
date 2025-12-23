import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Only create Stripe promise if key exists and is valid
let stripePromise = null

if (stripePublishableKey && stripePublishableKey.startsWith('pk_')) {
  stripePromise = loadStripe(stripePublishableKey)
} else {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is missing or invalid')
}

export const getStripe = async () => {
  if (!stripePublishableKey) {
    throw new Error('Stripe publishable key is not configured. Please check your environment variables.')
  }
  
  if (!stripePublishableKey.startsWith('pk_')) {
    throw new Error('Invalid Stripe publishable key format. Key should start with "pk_".')
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }

  return stripePromise
}

export const createCheckoutSession = async (isGift = false, giftRecipient = null) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isGift,
        giftRecipientEmail: giftRecipient?.email || null,
        giftRecipientName: giftRecipient?.name || null,
      }),
    })

    if (!response.ok) {
      // Try to parse error, but handle non-JSON responses
      let errorMessage = 'Failed to create checkout session'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If response isn't JSON, get text
        const text = await response.text()
        errorMessage = text || errorMessage
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Checkout session error:', error)
    throw error
  }
}

