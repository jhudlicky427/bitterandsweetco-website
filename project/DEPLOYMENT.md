# Deployment Guide

This guide covers deploying the Bitter & Sweet Co. application to various platforms.

## Prerequisites

Before deploying:

1. Complete Supabase setup with all migrations
2. Configure authentication settings
3. Test locally with production environment variables
4. Build successfully: `npm run build`

## Environment Variables

Required environment variables for deployment:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add environment variables
7. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Netlify Deployment

### Method 1: GitHub Integration

1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18
6. Add environment variables
7. Click "Deploy site"

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Supabase Edge Functions Deployment

The project includes Edge Functions for server-side operations.

### Prerequisites

Ensure the Supabase CLI is not used - functions are deployed via the Supabase dashboard or MCP tools.

### Environment Variables for Edge Functions

Edge functions automatically have access to:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Additional variables (if needed):
- `RESEND_API_KEY` (for email functionality)

## Custom Domain Setup

### Vercel

1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify

1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Configure DNS records

## SSL/HTTPS

Both Vercel and Netlify automatically provision SSL certificates for custom domains.

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] All pages are accessible
- [ ] Authentication works
- [ ] Database operations succeed
- [ ] Images and assets load
- [ ] Navigation works properly
- [ ] Mobile responsive design works
- [ ] Admin panel is accessible
- [ ] Cart functionality works
- [ ] Chatbot responds correctly
- [ ] Forms submit successfully
- [ ] No console errors

## Performance Optimization

### Build Optimization

1. Minimize bundle size
2. Enable compression
3. Optimize images
4. Use lazy loading for routes

### Supabase Optimization

1. Enable connection pooling
2. Add database indexes
3. Optimize queries
4. Use select specific columns

### CDN Configuration

Both Vercel and Netlify provide CDN by default. Assets are automatically cached.

## Monitoring

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

### Analytics

Consider adding analytics:
- Google Analytics
- Plausible
- Fathom

### Performance Monitoring

- Vercel Analytics (built-in)
- Netlify Analytics (built-in)
- Web Vitals tracking

## Rollback Strategy

### Vercel

1. Go to deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Netlify

1. Go to deploys
2. Find previous deployment
3. Click "Publish deploy"

## Troubleshooting

### Build Fails

- Check Node version (18+)
- Verify all dependencies are in package.json
- Check for TypeScript errors
- Review build logs

### Runtime Errors

- Verify environment variables are set
- Check Supabase connection
- Review browser console
- Check network requests

### Database Connection Issues

- Verify Supabase credentials
- Check RLS policies
- Ensure migrations ran successfully
- Test queries in Supabase dashboard

### Authentication Issues

- Verify Supabase Auth is enabled
- Check redirect URLs in Supabase settings
- Confirm email settings
- Test user creation manually

## Continuous Deployment

Both platforms support automatic deployments:

1. Push to main branch triggers production deployment
2. Push to other branches creates preview deployments
3. Pull requests generate preview URLs

## Security Best Practices

- Never commit `.env` files
- Use environment variables for all secrets
- Enable Supabase RLS on all tables
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use HTTPS only
- Implement rate limiting if needed

## Support

For deployment issues:

- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Supabase: [supabase.com/support](https://supabase.com/support)
