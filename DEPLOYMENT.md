# Deployment Guide

This guide will help you deploy the Vehicle Detection System Registration Portal to production.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## Step 1: Set up Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "vehicle-detection-registration"
   - Set a strong database password
   - Choose a region close to your users
   - Click "Create new project"

2. **Configure Database Schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `database-schema.sql`
   - Paste and run the SQL commands
   - Verify tables are created in the Table Editor

3. **Get API Keys**
   - Go to Settings > API
   - Copy your Project URL
   - Copy your anon/public key

## Step 2: Deploy to Vercel

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/vehicle-detection-registration.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, go to Settings > Environment Variables and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project.vercel.app`

## Step 3: Configure Supabase Security

1. **Set up Row Level Security (RLS)**
   - In Supabase dashboard, go to Authentication > Policies
   - The database schema already includes basic RLS policies
   - For production, consider more restrictive policies

2. **Configure CORS**
   - Go to Settings > API
   - Add your Vercel domain to allowed origins
   - Example: `https://your-project.vercel.app`

## Step 4: Test Your Deployment

1. **Test Public Forms**
   - Visit your deployed URL
   - Test installation registration form
   - Test mobility OS account registration
   - Verify data appears in Supabase

2. **Test Admin Portal**
   - Go to `/admin`
   - Login with your admin credentials
   - Test dashboard functionality
   - Test calendar drag-and-drop

## Step 5: Production Optimizations

### Security Enhancements
- Change default admin credentials
- Implement proper authentication (Auth0, Supabase Auth, etc.)
- Add rate limiting
- Enable HTTPS only

### Performance Optimizations
- Enable Vercel Analytics
- Configure CDN caching
- Optimize images
- Enable compression

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Set up uptime monitoring

## Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_SUPABASE_URL=your_dev_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_supabase_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@localhost
NEXT_PUBLIC_ADMIN_PASSWORD=dev_password
```

### Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_prod_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_supabase_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_ADMIN_PASSWORD=secure_production_password
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify Supabase URL and key are correct
   - Check if RLS policies are blocking access
   - Ensure database is not paused

2. **Build Failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check Vercel build logs

3. **Environment Variables Not Working**
   - Ensure variables are prefixed with `NEXT_PUBLIC_`
   - Redeploy after adding new variables
   - Check variable names match exactly

### Getting Help

- Check Vercel deployment logs
- Check Supabase logs in dashboard
- Review browser console for errors
- Check network tab for failed requests

## Maintenance

### Regular Tasks
- Monitor database usage
- Update dependencies monthly
- Review and rotate admin credentials
- Backup database regularly

### Scaling Considerations
- Upgrade Supabase plan if needed
- Consider Vercel Pro for better performance
- Implement caching strategies
- Monitor API rate limits

## Cost Estimation

### Free Tier (Small Scale)
- Vercel: Free (100GB bandwidth)
- Supabase: Free (500MB database, 50MB file storage)
- Total: $0/month

### Production Scale
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Total: ~$45/month

This should handle thousands of form submissions and provide excellent performance.
