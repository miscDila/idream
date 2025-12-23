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

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { isGift, giftRecipientEmail, giftRecipientName } = req.body

    // Get user from Supabase session (you'll need to pass auth token)
    // For now, we'll create the session and handle user association in webhook
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

    return res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return res.status(500).json({ message: error.message })
  }
}

