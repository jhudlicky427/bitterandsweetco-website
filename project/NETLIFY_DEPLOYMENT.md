# Deploying Your Coffee Shop to Netlify

This guide will walk you through deploying your coffee shop website to Netlify and connecting your Squarespace domain.

## Prerequisites

- A GitHub account (free)
- A Netlify account (free - we'll create this)
- Your Squarespace domain ready to connect

## Step 1: Push Your Code to GitHub

1. Go to [GitHub](https://github.com) and sign in (or create a free account)
2. Click the "+" button in the top right and select "New repository"
3. Name it something like "coffee-shop-website"
4. Keep it **Public** (required for free Netlify)
5. Click "Create repository"
6. Follow the instructions to push your code, or use the provided commands

If you're working in this development environment, you can download your project files and upload them to GitHub.

## Step 2: Deploy to Netlify

### Option A: Connect GitHub (Recommended - Auto-deploys on changes)

1. Go to [Netlify](https://netlify.com) and sign up with your GitHub account
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub repositories
5. Select your coffee shop repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click "Add environment variables" and add your Supabase credentials:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
8. Click "Deploy site"

### Option B: Manual Deploy (Drag & Drop)

1. Go to [Netlify](https://netlify.com) and sign up
2. In your development environment, make sure you've run `npm run build`
3. Download the `dist` folder from your project
4. On Netlify dashboard, drag and drop the `dist` folder to the deployment area
5. Wait for deployment to complete

**Important:** With manual deploy, you'll need to add environment variables after:
- Go to Site settings → Environment variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy the site

## Step 3: Get Your Netlify Site URL

After deployment completes:
1. Netlify will give you a URL like `random-name-123456.netlify.app`
2. You can customize this: Site settings → Domain management → Options → Edit site name
3. Change it to something like `yourcoffeeshop.netlify.app`

## Step 4: Update Supabase Settings

Your site URL needs to be whitelisted in Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Authentication → URL Configuration
4. Add your Netlify URL to **Site URL**
5. Add your Netlify URL to **Redirect URLs**:
   - `https://yourcoffeeshop.netlify.app/**`
   - Later, also add your custom domain: `https://www.yourdomain.com/**`

## Step 5: Connect Your Squarespace Domain

Now let's connect your custom domain from Squarespace:

### In Netlify:

1. Go to your site in Netlify dashboard
2. Click "Domain settings"
3. Click "Add a domain"
4. Enter your domain (e.g., `www.yourdomain.com`)
5. Netlify will provide DNS records to configure

### In Squarespace:

1. Log into your [Squarespace account](https://account.squarespace.com)
2. Go to Settings → Domains → (select your domain)
3. Click "DNS Settings"
4. Add the DNS records Netlify provided:

**For subdomain (www):**
- Type: `CNAME`
- Host: `www`
- Value: `yourcoffeeshop.netlify.app`
- TTL: `3600`

**For root domain (optional):**
- Type: `A`
- Host: `@`
- Value: (IP address from Netlify)
- TTL: `3600`

5. Click "Add" for each record
6. Wait 24-48 hours for DNS propagation (usually faster, often just a few hours)

### Enable HTTPS:

1. Back in Netlify, go to Domain settings
2. Under HTTPS, click "Verify DNS configuration"
3. Once verified, click "Enable HTTPS"
4. Netlify will automatically provision an SSL certificate

## Step 6: Final Supabase Update

Once your custom domain is connected:

1. Go back to Supabase Dashboard
2. Authentication → URL Configuration
3. Update **Site URL** to your custom domain: `https://www.yourdomain.com`
4. Add to **Redirect URLs**: `https://www.yourdomain.com/**`
5. Keep the Netlify URL in redirect URLs as a backup

## Testing Your Deployment

1. Visit your custom domain
2. Test key functionality:
   - Browse the menu
   - Add items to cart
   - Try to login/register
   - Test the chatbot
   - Try booking an event
   - Submit a contact form
3. Check that admin login works at `/admin`

## Troubleshooting

### "Build failed" on Netlify
- Check that environment variables are set correctly
- Make sure `netlify.toml` is in your repository
- Check the build logs for specific errors

### "Authentication not working"
- Verify Supabase URLs are whitelisted
- Check that environment variables match your Supabase project
- Clear browser cache and try again

### "Domain not connecting"
- DNS changes can take 24-48 hours
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Make sure you added the correct DNS records in Squarespace

### "Site loads but features don't work"
- Check browser console for errors
- Verify environment variables are set in Netlify
- Make sure you redeployed after adding environment variables

## Environment Variables Reference

Your site needs these environment variables in Netlify:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your Supabase project dashboard → Settings → API

## Continuous Deployment

If you connected via GitHub:
- Every time you push changes to GitHub, Netlify automatically rebuilds and deploys
- You can see deployment history and rollback if needed
- Set up deploy notifications in Site settings → Build & deploy → Deploy notifications

## Cost

- Netlify free tier includes:
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Continuous deployment
  - Custom domains

This is more than enough for most small businesses!

## Need Help?

- Netlify Support: https://answers.netlify.com
- Supabase Support: https://supabase.com/support
- Check your deployment logs in Netlify for specific error messages

## Quick Reference

- **Netlify Dashboard:** https://app.netlify.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repository:** https://github.com/yourusername/your-repo
- **DNS Checker:** https://dnschecker.org

---

## Summary

1. Push code to GitHub
2. Connect GitHub to Netlify and deploy
3. Add environment variables in Netlify
4. Update Supabase URL configuration
5. Connect custom domain in Netlify
6. Add DNS records in Squarespace
7. Enable HTTPS in Netlify
8. Update Supabase with final domain
9. Test everything!

Your site will be live at your custom domain with automatic HTTPS and deployments!
