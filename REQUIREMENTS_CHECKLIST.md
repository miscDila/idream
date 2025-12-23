# What You Need to Provide

This checklist outlines everything you need to set up and provide to get the MVP running.

## ✅ Supabase Setup (You Need to Do This)

### 1. Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com) and create a new project
- [ ] Wait for the project to finish provisioning

### 2. Run Database Migration
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
- [ ] Paste and execute it in the SQL Editor
- [ ] Verify all tables were created (users, golden_tickets, groups, etc.)

### 3. Create Storage Bucket
- [ ] Go to Storage in Supabase dashboard
- [ ] Click "New bucket"
- [ ] Name it: `win-images`
- [ ] Set it to **Public** (uncheck "Private bucket")
- [ ] Create the bucket
- [ ] Go to Policies tab and add:
  - **INSERT policy**: Allow authenticated users to upload
  - **SELECT policy**: Allow public read access

### 4. Get Your Supabase Credentials
After setup, provide me:
- [ ] **VITE_SUPABASE_URL** - Found in Settings → API → Project URL
- [ ] **VITE_SUPABASE_ANON_KEY** - Found in Settings → API → anon/public key
- [ ] **SUPABASE_SERVICE_ROLE_KEY** - Found in Settings → API → service_role key (keep this secret!)

---

## ✅ Stripe Setup (You Need to Do This)

### 1. Create Stripe Account
- [ ] Sign up at [stripe.com](https://stripe.com) if you don't have one
- [ ] Complete account verification

### 2. Get API Keys
- [ ] Go to Developers → API keys
- [ ] Copy your **Publishable key** (starts with `pk_`)
- [ ] Copy your **Secret key** (starts with `sk_`) - keep this secret!

### 3. Set Up Webhook
- [ ] Go to Developers → Webhooks
- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://yourdomain.com/api/stripe-webhook` (use your actual domain)
- [ ] Select event: `checkout.session.completed`
- [ ] Add endpoint
- [ ] Copy the **Signing secret** (starts with `whsec_`)

**Provide me:**
- [ ] **VITE_STRIPE_PUBLISHABLE_KEY** - Your publishable key
- [ ] **STRIPE_SECRET_KEY** - Your secret key (for server-side only)
- [ ] **STRIPE_WEBHOOK_SECRET** - Your webhook signing secret

---

## ✅ Notion OAuth Setup (You Need to Do This)

### 1. Create Notion Integration
- [ ] Go to [notion.so/my-integrations](https://notion.so/my-integrations)
- [ ] Click "New integration"
- [ ] Name it: "iDream Vision Board"
- [ ] Select your workspace
- [ ] Set capabilities: Read content, Update content
- [ ] Create integration

### 2. Set Up OAuth
- [ ] In your integration settings, go to OAuth
- [ ] Set redirect URI: `https://yourdomain.com/notion/callback` (use your actual domain)
- [ ] Save changes

**Provide me:**
- [ ] **VITE_NOTION_CLIENT_ID** - Found in your integration settings
- [ ] **NOTION_CLIENT_SECRET** - Found in OAuth section
- [ ] **NOTION_REDIRECT_URI** - The full redirect URL you set

---

## ✅ Email Service (Choose One)

### Option A: Resend (Recommended - Easier Setup)
- [ ] Sign up at [resend.com](https://resend.com)
- [ ] Verify your domain (or use their test domain for development)
- [ ] Get your API key from dashboard

**Provide me:**
- [ ] **RESEND_API_KEY** - Your Resend API key

### Option B: SendGrid
- [ ] Sign up at [sendgrid.com](https://sendgrid.com)
- [ ] Create API key with "Mail Send" permissions
- [ ] Copy the API key

**Provide me:**
- [ ] **SENDGRID_API_KEY** - Your SendGrid API key

---

## ✅ Domain & Deployment Info

**Provide me:**
- [ ] **Your production domain** (e.g., `idream.club` or `www.idream.club`)
- [ ] **NEXT_PUBLIC_BASE_URL** - Full URL: `https://yourdomain.com`

---

## ✅ Optional: Custom Assets

Currently, the app uses:
- ✅ Default favicon (exists in `public/favicon.svg`)
- ✅ System fonts (no custom fonts needed)
- ✅ User-uploaded images (stored in Supabase)

**Optional improvements you could add:**
- [ ] Custom logo/brand image (if you want to replace text logo)
- [ ] Custom favicon (if you want something different)
- [ ] Social media preview images (for better sharing)

---

## 📋 Summary: What I Need From You

Once you've completed the setups above, provide me with these values:

### Environment Variables for `.env` file:
```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
VITE_NOTION_CLIENT_ID=your_client_id_here
```

### Environment Variables for Vercel (server-side only):
```env
STRIPE_SECRET_KEY=your_secret_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NOTION_CLIENT_SECRET=your_notion_secret_here
NOTION_REDIRECT_URI=https://yourdomain.com/notion/callback
RESEND_API_KEY=your_resend_key_here
# OR
SENDGRID_API_KEY=your_sendgrid_key_here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## 🚀 Quick Start Order

1. **Supabase** - Set up project, run migration, create storage bucket
2. **Stripe** - Create account, get keys, set up webhook
3. **Notion** - Create integration, set OAuth redirect
4. **Email** - Choose Resend or SendGrid
5. **Domain** - Know your production domain

Once you have all the credentials, I can help you:
- Create the `.env` file
- Set up Vercel environment variables
- Test the integrations
- Deploy to production

---

## ❓ Questions?

If you get stuck on any step, let me know and I can help troubleshoot!

