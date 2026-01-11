# E-Summit '26 Platform

> Built by Yashvanth S | Tech Team | E-Cell IIITDM Kancheepuram

The official web platform for E-Summit '26, featuring a high-performance landing page, user registration portal, and a comprehensive administration dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase (Postgres)
- **Caching**: Redis (Pro-tier caching for high-speed scanning)
- **Styling**: Tailwind CSS, Framer Motion
- **Performance**: Server Actions, RPC Functions

## Core Features

### User Portal
- **Immersive Landing Page**: Spotlight effects, bento grids, and smooth scrolling (Lenis).
- **Authentication**: Secure Google OAuth login for IIITDM and external users.
- **Dashboard**: View tickets, QR codes, and merchandise status.
- **PWA Support**: Installable as a native-like app on mobile.

### Admin Command Center
- **Unified View**: Real-time aggregation of Tickets, Merch, and Accommodation stats.
- **Pass Verification**: Advanced search and filter tools for verifying payment proofs.
- **Band Distribution**: Track physical wristband issuance with group logic.
- **QR Scanner**: Sub-100ms verification for event entry using Redis caching.
- **Merch Store**: Order management, payment verification, and delivery tracking.
- **Data Export**: Bulk CSV exports for all datasets.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file with the following keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `KV_REDIS_URL` (Connection string)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Architecture Highlights
- **Hybrid Caching**: Uses Redis for high-frequency reads (scanning) and Postgres for transactional data.
- **Optimized Queries**: Uses SQL RPC functions to prevent N+1 query performance issues.
- **Security**: Row Level Security (RLS) enabled on all database tables.

---
Property of E-Cell IIITDM Kancheepuram
