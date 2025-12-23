import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ message: `Webhook Error: ${err.message}` })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      // Get customer email from Stripe checkout
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name || ''
      const metadata = session.metadata || {}
      const isGift = metadata.isGift === 'true'

      if (!customerEmail) {
        console.error('No customer email in Stripe session')
        return res.status(400).json({ message: 'No customer email found' })
      }

      // Find existing user or create new one
      let { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single()

      let userId

      if (!user) {
        // User doesn't exist - we'll create the golden ticket first
        // and they can sign up later to claim it by email
        // For now, create a temporary UUID that we'll associate with the email
        // When they sign up with that email, we'll link the ticket
        
        // Create a placeholder user record (without auth user)
        // The trigger will handle creating the auth user when they sign up
        const tempUserId = crypto.randomUUID()
        
        // Insert into users table (this will fail the foreign key check)
        // So we need a different approach - store the email and link later
        userId = null // We'll handle this in the golden ticket creation
      } else {
        userId = user.id
      }

      const giftToken = isGift ? crypto.randomBytes(32).toString('hex') : null

      // If user doesn't exist yet, we need to create them first
      // Use Supabase Admin API to create auth user
      if (!userId) {
        try {
          // Create auth user using admin API
          const adminSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          )

          const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: {
              full_name: customerName,
            },
          })

          if (createError) {
            console.error('Error creating user:', createError)
            // Fallback: create user record without auth (they'll sign up later)
            // We'll store purchaser_email instead of purchaser_id
          } else {
            userId = newUser.user.id
            // User profile should be created by trigger, but ensure it exists
            await supabase
              .from('users')
              .upsert({
                id: userId,
                email: customerEmail,
                full_name: customerName,
              }, { onConflict: 'id' })
          }
        } catch (err) {
          console.error('Error in user creation:', err)
        }
      }

      // If still no userId, we'll need to handle this case
      // For now, we'll create the ticket and link it by email later
      if (!userId && !isGift) {
        // Store purchaser email in a custom field for later linking
        // We'll need to add purchaser_email field or handle differently
        console.log('Warning: No user ID, ticket will be linked by email:', customerEmail)
      }

      // Create golden ticket record
      // Note: If userId is null, this will fail - we need purchaser_id
      // So we must have a userId at this point
      if (!userId) {
        throw new Error('Cannot create golden ticket without user ID')
      }

      const { data: goldenTicket, error: ticketError } = await supabase
        .from('golden_tickets')
        .insert({
          purchaser_id: userId,
          stripe_payment_intent_id: session.payment_intent,
          is_gift: isGift,
          gift_recipient_email: metadata.giftRecipientEmail || null,
          gift_recipient_name: metadata.giftRecipientName || null,
          gift_token: giftToken,
        })
        .select()
        .single()

      if (ticketError) {
        console.error('Error creating golden ticket:', ticketError)
        throw ticketError
      }

      if (isGift) {
        // Send gift email (you'll need to implement email sending)
        const giftUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/gift-redeem?token=${giftToken}`
        
        // Update gift_sent_at
        await supabase
          .from('golden_tickets')
          .update({ gift_sent_at: new Date().toISOString() })
          .eq('id', goldenTicket.id)

        // TODO: Send email to recipient
        // You can use Resend, SendGrid, or Supabase Edge Function for this
        console.log('Gift email should be sent to:', metadata.giftRecipientEmail)
        console.log('Gift redemption URL:', giftUrl)
      } else {
        // Activate ticket for purchaser
        await supabase
          .from('users')
          .update({
            has_golden_ticket: true,
            golden_ticket_purchased_at: new Date().toISOString(),
          })
          .eq('id', userId)

        // TODO: Send welcome email with login instructions
        // If user was just created, send them a password reset link or magic link
        console.log('Purchase successful for:', customerEmail)
        console.log('User ID:', userId)
      }
    } catch (error) {
      console.error('Error processing webhook:', error)
      return res.status(500).json({ message: error.message })
    }
  }

  return res.status(200).json({ received: true })
}

