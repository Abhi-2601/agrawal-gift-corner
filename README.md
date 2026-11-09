# Agrawal Gift Corner

Premium gifting store in Mathura, Uttar Pradesh. Built with React + TypeScript + Vite + Supabase.

## Project Info
- **Business:** Agrawal Gift Corner
- **Location:** Mathura, UP, India
- **Currency:** INR (₹)
- **Contact:** WhatsApp +91 75799 51781 | Email agrawalgiftcorner@gmail.com
- **Hours:** Mon–Sat, 10 AM – 8 PM
- **Social:** Instagram @agrawal_gift_corner / Threads @agrawal_gift_corner

## Setup
1. `npm install`
2. Copy `.env.local` and fill `VITE_SUPABASE_ANON_KEY`
3. Apply migrations in Supabase SQL Editor
4. Configure Storage buckets and Google OAuth
5. `npm run dev`

## Features Built
- Home, Shop, Product Details, Cart, Checkout
- Account (profile, orders, wishlist, addresses)
- Admin Dashboard (products, categories, banners, orders, reviews, settings, media)
- Google Auth with session persistence
- Customization notes preserved through checkout (max 500 chars)
- Secure database function for atomic order creation + stock decrement
- RLS policies, Storage policies, Admin allowlist

## Security Notes
- Never expose service-role keys or DB passwords in client code
- Admin authorization enforced by database allowlist + RLS
- Customer cannot change payment status or access another customer's orders

## Deployment
- Build: `npm run build`
- Deploy to Vercel with `vercel.json` SPA config


## Visual Preview Mode
Enable local visual preview (before Supabase is fully configured):
  echo 'VITE_DEMO_MODE=true' >> .env.local
Then restart the server: npm run dev

Disable preview mode (use real database):
  Remove the VITE_DEMO_MODE entry from .env.local

The preview uses curated sample products from src/lib/demoData.ts — never inserted into Supabase.
View at: http://localhost:5173/ (homepage), /products (shop), /product/demo-box-01 (product)
