# Deployment Guide - iDream Landing Page

## Step 1: Set Up HubSpot

### Option A: HubSpot Forms API (Recommended)

1. **Create HubSpot Account** (if you don't have one)
   - Go to https://www.hubspot.com
   - Sign up for free account

2. **Create a Form**
   - In HubSpot, go to **Marketing** → **Lead Capture** → **Forms**
   - Click **Create form**
   - Choose **Regular form**
   - Add an **Email** field (required)
   - Name it: "Waitlist Signup" or "iDream Waitlist"
   - Click **Publish**

3. **Get Your Credentials**
   - After creating the form, click on it
   - You'll see your **Form ID** (looks like: `abc12345-def6-7890-ghij-klmnopqrstuv`)
   - Your **Portal ID** is in the URL: `https://app.hubspot.com/forms/{PORTAL_ID}/...`
   - Or go to **Settings** → **Integrations** → **API key** to see your Portal ID

4. **Add Environment Variables**
   - Create a `.env` file in the project root:
   ```
   VITE_HUBSPOT_PORTAL_ID=your_portal_id_here
   VITE_HUBSPOT_FORM_ID=your_form_id_here
   ```

### Option B: Simple Email Collection (No HubSpot)

If you don't want to set up HubSpot right now, the form will automatically store emails in browser localStorage as a fallback. You can export them later.

## Step 2: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - iDream landing page"
   git branch -M main
   git remote add origin https://github.com/yourusername/idream.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click **Add New Project**
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (leave as is)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables in Vercel**
   - In your Vercel project, go to **Settings** → **Environment Variables**
   - Add:
     - `VITE_HUBSPOT_PORTAL_ID` = your portal ID
     - `VITE_HUBSPOT_FORM_ID` = your form ID
   - Click **Save**

4. **Deploy**
   - Click **Deploy**
   - Wait for deployment to complete
   - Your site will be live at: `https://your-project.vercel.app`

5. **Connect Custom Domain (idream.club)**
   - In Vercel project, go to **Settings** → **Domains**
   - Add `idream.club` and `www.idream.club`
   - Follow DNS instructions to point your domain to Vercel

## Step 3: Test Everything

1. **Test the Landing Page**
   - Visit your deployed URL
   - Check all sections load correctly
   - Test responsive design (mobile/tablet/desktop)

2. **Test Waitlist Form**
   - Enter a test email
   - Submit the form
   - Check HubSpot to see if contact was created
   - Or check browser localStorage (if HubSpot not configured)

3. **Test Navigation**
   - Click "Join the Waitlist" button (should scroll to form)
   - Test footer links (Privacy, Terms, About)

## Step 4: Submit to Stripe

Once your landing page is live:

1. **Prepare Your Stripe Application**
   - Have your landing page URL ready: `https://idream.club`
   - Make sure all pages are accessible
   - Test that the form works

2. **Submit Stripe Application**
   - Go to your Stripe dashboard
   - Complete the application
   - Provide your landing page URL
   - Stripe will review your site to understand your business

3. **What Stripe Will See**
   - Your landing page showing the product/service
   - Features and value proposition
   - Professional design
   - Contact information
   - Legal pages (Privacy, Terms)

## Troubleshooting

### HubSpot Not Working?
- Check that environment variables are set correctly
- Verify Form ID and Portal ID are correct
- Check browser console for errors
- Form will fallback to localStorage if HubSpot fails

### Build Errors?
- Make sure all dependencies are in package.json
- Run `npm install` locally first
- Check that all imports are correct

### Domain Not Working?
- DNS changes can take 24-48 hours
- Make sure DNS records are correct in your domain registrar
- Vercel will show you the exact DNS records needed

## Next Steps After Launch

1. **Monitor Waitlist Signups**
   - Check HubSpot dashboard regularly
   - Export contacts as needed

2. **Analytics** (Optional)
   - Add Google Analytics
   - Add Vercel Analytics (built-in)

3. **Email Marketing**
   - Set up email sequences in HubSpot
   - Send launch updates to waitlist

4. **Stripe Integration**
   - Once Stripe is approved, integrate payment processing
   - Set up product pages
   - Configure checkout


