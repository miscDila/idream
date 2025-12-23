# iDream.club MVP Setup Guide

This guide will help you set up the iDream.club MVP with all required services and configurations.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Stripe account
- A Notion account (for OAuth setup)
- An email service account (Resend or SendGrid)

## Step 1: Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Run the database migration:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the migration

4. Create a storage bucket for win images:
   - Go to Storage in Supabase dashboard
   - Create a new bucket named `win-images`
   - Set it to public
   - Add RLS policy: Allow authenticated users to upload, allow public read

5. Get your service role key:
   - Go to Settings → API
   - Copy the `service_role` key (keep this secret!)

## Step 2: Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API keys
3. Create a webhook endpoint:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe-webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret

## Step 3: Notion OAuth Setup

1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Create a new integration
3. Set redirect URI: `https://yourdomain.com/notion/callback`
4. Copy the OAuth client ID and secret

## Step 4: Email Service Setup

Choose one:

### Option A: Resend
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard

### Option B: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with mail send permissions

## Step 5: Environment Variables

Create a `.env` file in the project root:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

For Vercel deployment, add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Server-side only (not exposed to client)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Notion
VITE_NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=https://yourdomain.com/notion/callback

# Email
RESEND_API_KEY=your_resend_api_key
# OR
SENDGRID_API_KEY=your_sendgrid_api_key

# Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Development

```bash
npm run dev
```

## Step 8: Create Admin User

After creating your first user account, you'll need to manually set yourself as admin:

1. Go to Supabase dashboard → Table Editor → `users`
2. Find your user record
3. Set `is_admin` to `true`

## Step 9: Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

## API Routes Setup

The API routes in the `api/` folder need to be configured:

1. **`/api/create-checkout-session`**: Creates Stripe checkout sessions
2. **`/api/stripe-webhook`**: Handles Stripe webhook events
3. **`/api/notion-oauth`**: Handles Notion OAuth callback (needs to be created)
4. **`/api/notion-goals`**: Fetches goals from Notion (needs to be created)

These routes will work automatically with Vercel serverless functions.

## Next Steps

1. Test the purchase flow with Stripe test mode
2. Connect your Notion workspace
3. Create your first group
4. Test the sticker order system
5. Set up email notifications

## Troubleshooting

- **Database errors**: Make sure you ran the migration SQL
- **Stripe errors**: Check your API keys and webhook configuration
- **Notion errors**: Verify OAuth redirect URI matches exactly
- **Storage errors**: Ensure the `win-images` bucket exists and is public

