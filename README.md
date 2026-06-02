# StudyFlowHQ

An academic essay writing service platform built with Next.js 14, Supabase, and deployed on Vercel.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Styling**: Tailwind CSS + custom CSS variables
- **Deployment**: Vercel

## Pages
| Route | Description |
|---|---|
| `/` | Homepage — hero, services, how it works, top writers |
| `/order` | Order submission form with price calculator |
| `/writers` | Browse all expert writers |
| `/auth/login` | Sign in |
| `/auth/register` | Sign up |
| `/dashboard` | Student dashboard — orders overview |
| `/admin` | Admin dashboard — all orders + user management |

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase credentials
npm run dev
```

## Supabase Setup
1. Create project at supabase.com
2. Run `supabase/migrations/001_schema.sql` in SQL Editor
3. Enable Email auth in Authentication settings
4. Copy URL + anon key to `.env.local`

## Deploy to Vercel
1. Push to GitHub
2. Import repo on vercel.com
3. Add env variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

## Make yourself admin
After signing up, run this in Supabase SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```
