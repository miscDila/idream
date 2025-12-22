# iDream.club Landing Page

Landing page for iDream.club - a vision board platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- Grid paper sections with light blue grid lines
- Font-mono for headers
- Handwritten font (Caveat placeholder, will be replaced with custom font)
- HubSpot integration for waitlist
- Responsive design

## Custom Font

To add your custom handwritten font:
1. Generate font file from handwriting sample using Calligraphr.com or similar
2. Place font files (.woff2, .woff) in `public/fonts/`
3. Update `src/index.css` with @font-face declarations:
   ```css
   @font-face {
     font-family: 'YourHandwriting';
     src: url('/fonts/your-handwriting.woff2') format('woff2'),
          url('/fonts/your-handwriting.woff') format('woff');
     font-weight: normal;
     font-style: normal;
   }
   ```
4. Update `tailwind.config.js` to use custom font:
   ```js
   fontFamily: {
     'handwritten': ['YourHandwriting', 'cursive'],
   }
   ```

## HubSpot Integration

1. **Create HubSpot Account** (free tier works)
   - Sign up at https://www.hubspot.com

2. **Create a Form**
   - Go to Marketing → Lead Capture → Forms
   - Create a new form with an Email field
   - Publish the form

3. **Get Your Credentials**
   - **Portal ID**: Found in HubSpot Settings → Integrations → API key, or in the form URL
   - **Form ID**: Found in the form settings after creating it

4. **Add Environment Variables**
   - Create a `.env` file in the project root:
   ```
   VITE_HUBSPOT_PORTAL_ID=your_portal_id_here
   VITE_HUBSPOT_FORM_ID=your_form_id_here
   ```
   - **For Vercel**: Add these in Vercel dashboard → Settings → Environment Variables

5. **Test**
   - The form will submit to HubSpot when configured
   - If HubSpot isn't configured, emails are stored in browser localStorage as fallback

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Build: `npm run build`
- Deploy the `dist` folder to your hosting service

