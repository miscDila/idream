// Vercel serverless function
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Check for Stripe secret key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set')
    return res.status(500).json({ message: 'Server configuration error' })
  }

  try {
    const { isGift, giftRecipientEmail, giftRecipientName } = req.body

    // Get base URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://idream.club'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Golden Ticket - Lifetime Access',
              description: 'Lifetime access to vision board planning, community groups, and physical stickers. Virtual delivery by Christmas!',
            },
            unit_amount: 15000, // $150.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}${isGift ? '&is_gift=true' : ''}`,
      cancel_url: `${baseUrl}/purchase?canceled=true`,
      metadata: {
        isGift: isGift ? 'true' : 'false',
        giftRecipientEmail: giftRecipientEmail || '',
        giftRecipientName: giftRecipientName || '',
      },
    })

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return res.status(500).json({ 
      message: error.message || 'Failed to create checkout session',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

