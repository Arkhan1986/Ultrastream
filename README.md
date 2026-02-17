# UltraStream - Professional IPTV SaaS Platform

A modern, Netflix-style IPTV streaming platform built with Next.js, featuring HLS video playback, M3U playlist parsing, and subscription management.

## Features

### Core Functionality
- **M3U/M3U8 Playlist Parser**: Automatically parses and categorizes channels from M3U playlists
- **HLS Video Player**: Built with hls.js for cross-browser compatibility and adaptive streaming
- **CORS Proxy**: Built-in proxy to handle CORS issues with external streams
- **Channel Sidebar**: Organized, searchable channel list with category grouping
- **Dark Mode UI**: Professional Netflix-style interface with gradient accents

### Authentication & Monetization
- **Supabase Authentication**: Secure user authentication with email/password
- **Stripe Integration**: Subscription management with Pro plan ($9.99/month)
- **User Profiles**: Track user preferences and subscription status

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Video Player**: hls.js
- **Authentication**: Supabase
- **Payments**: Stripe
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Arkhan1986/ultrastream.git
cd ultrastream
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
Create a \`.env.local\` file with the following:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
\`\`\`

4. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Loading a Playlist

1. Sign up or sign in to your account
2. Enter an M3U or M3U8 playlist URL in the input field
3. Click "Load Playlist" to parse and display channels
4. Select a channel from the sidebar to start streaming

### Example Playlist URLs

- IPTV-ORG Community: \`https://iptv-org.github.io/iptv/index.m3u\`
- Or use your own M3U/M3U8 playlist URL

## Project Structure

\`\`\`
ultrastream/
├── app/
│   ├── api/
│   │   ├── checkout/      # Stripe checkout API
│   │   └── proxy/         # CORS proxy for streams
│   ├── player/            # Main player page
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Login/home page
├── components/
│   ├── ChannelSidebar.tsx # Channel list sidebar
│   ├── LoginForm.tsx      # Authentication form
│   └── VideoPlayer.tsx    # HLS video player
├── contexts/
│   └── AuthContext.tsx    # Authentication context
└── lib/
    ├── m3u-parser.ts      # M3U playlist parser
    └── supabase.ts        # Supabase client
\`\`\`

## Key Components

### M3U Parser
Parses M3U/M3U8 playlists and extracts:
- Channel names
- Stream URLs
- Channel logos
- Category groups

### Video Player
Features include:
- HLS.js integration for adaptive streaming
- Automatic error recovery
- Cross-browser compatibility
- Loading states and error messages

### CORS Proxy
Handles CORS issues by proxying stream requests through the Next.js API, allowing playback of streams that would otherwise be blocked.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Docker

## Supabase Setup

1. Create a new Supabase project
2. Enable Email authentication in Authentication settings
3. Create the following tables:

\`\`\`sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Configure webhook endpoints for subscription events
4. Update the checkout session with your pricing

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Video playback powered by [hls.js](https://github.com/video-dev/hls.js/)
- Authentication by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)
- Community playlists from [IPTV-ORG](https://github.com/iptv-org/iptv)
