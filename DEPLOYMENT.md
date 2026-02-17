# Deployment Instructions for UltraStream

## GitHub Repository Setup

Since GitHub integration is not enabled in the sandbox, follow these steps to push your code to GitHub:

### Step 1: Create GitHub Repository

1. Go to https://github.com/Arkhan1986
2. Click "New repository" or go to https://github.com/new
3. Repository name: `ultrastream`
4. Description: "Professional IPTV SaaS Platform with Next.js, HLS player, and Stripe integration"
5. Choose "Public" or "Private"
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 2: Push Code to GitHub

After creating the repository, run these commands in your terminal:

```bash
cd /home/ubuntu/ultrastream
git remote add origin https://github.com/Arkhan1986/ultrastream.git
git branch -M main
git push -u origin main
```

If you need to authenticate, GitHub will prompt you to use a Personal Access Token (PAT) instead of password.

### Step 3: Create Personal Access Token (if needed)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "UltraStream Deploy"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token and use it as your password when pushing

## Vercel Deployment

### Quick Deploy

1. Go to https://vercel.com/new
2. Import your GitHub repository: `Arkhan1986/ultrastream`
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
4. Click "Deploy"

### Environment Variables Setup

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `your_supabase_project_url`
   
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `your_supabase_anon_key`
   
   - Name: `STRIPE_SECRET_KEY`
   - Value: `your_stripe_secret_key`

3. Redeploy after adding variables

## Alternative: Manual Git Push from Local Machine

If you prefer to work from your local machine:

1. Download the project as a ZIP file from the sandbox
2. Extract it on your local machine
3. Open terminal in the project directory
4. Run:
```bash
git remote add origin https://github.com/Arkhan1986/ultrastream.git
git branch -M main
git push -u origin main
```

## Supabase Configuration

Before the app works properly, you need to set up Supabase:

1. Go to your Supabase project: https://supabase.com/dashboard/project/qnsgkpkqztiqqxaimrul
2. Go to Authentication → Providers
3. Enable Email provider
4. Go to SQL Editor and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playlists" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Stripe Configuration

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/dashboard
2. Get your API keys from Developers → API keys
3. Set up webhook endpoints:
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events to listen: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Testing

After deployment:

1. Visit your Vercel URL
2. Sign up with a test email
3. Load a playlist: `https://iptv-org.github.io/iptv/index.m3u`
4. Test channel playback
5. Test Stripe checkout (use test card: 4242 4242 4242 4242)

## Troubleshooting

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check Supabase email provider is enabled
- Ensure tables are created with proper RLS policies

### Video Playback Issues
- Many public IPTV streams have geo-restrictions
- Some streams require specific headers or authentication
- The CORS proxy should handle most CORS issues

### Stripe Issues
- Ensure you're using test mode keys for testing
- Verify webhook endpoints are configured
- Check Stripe logs for detailed error messages

## Production Checklist

Before going to production:

- [ ] Replace test Stripe keys with live keys
- [ ] Set up proper Supabase RLS policies
- [ ] Configure custom domain in Vercel
- [ ] Set up monitoring and error tracking
- [ ] Add rate limiting to API routes
- [ ] Implement proper logging
- [ ] Add analytics (Vercel Analytics, Google Analytics)
- [ ] Test on multiple devices and browsers
- [ ] Set up backup and recovery procedures
- [ ] Review and update privacy policy and terms of service

## Support

For issues or questions:
- GitHub Issues: https://github.com/Arkhan1986/ultrastream/issues
- Email: your-email@example.com
