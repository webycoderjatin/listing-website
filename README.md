# LocalFind MVP

A production-ready local business directory MVP.

## Features Included
- Complete business owner flow (Registration -> Listing -> Payment -> Approval).
- NextAuth role-based authentication (Admin, Business Owner, User).
- Razorpay Payment Gateway Integration (₹399/year subscription).
- Admin Moderation Dashboard (Approve, Reject, Suspend).
- SEO-friendly public pages (Homepage, Search, Public Profiles).
- Clean, responsive Tailwind CSS UI.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js
- Razorpay

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Razorpay test account (for payments)
- Cloudinary account (for image uploads - setup instructions deferred to future iterations but architecture is ready)

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   npm install ts-node typescript -D # Required for seeding if not installed globally
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your details.
   ```bash
   cp .env.example .env
   ```
   **Important:** Update the `DATABASE_URL` with your local PostgreSQL connection string.

3. **Initialize Database**
   Run Prisma migrations to create the tables in your PostgreSQL database.
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Seed Database**
   Run the seed script to populate categories and test businesses.
   Add this to your `package.json`:
   ```json
   "prisma": {
     "seed": "ts-node --compiler-options {\\\"module\\\":\\\"CommonJS\\\"} prisma/seed.ts"
   }
   ```
   Then run:
   ```bash
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Test Accounts

**Admin User:**
- Email: `admin@localfind.com`
- Password: `admin123`

**Business Owner User:**
- Email: `owner1@localfind.com`
- Password: `owner123`

## Testing the Complete MVP Flow
1. Open the homepage `http://localhost:3000`.
2. Click **List Your Business**.
3. Create a new user account via the registration page.
4. Fill out the "Add New Business" form and submit.
5. On the payment page, click **Pay ₹399 Now** (use Razorpay Test Credentials, e.g., Card: 4111 1111 1111 1111).
6. Upon success, you'll be redirected to your dashboard, and your listing status will be `PENDING_APPROVAL`.
7. Log out, then log in using the **Admin User** credentials.
8. Go to `http://localhost:3000/admin/businesses` and click **Approve** on the new listing.
9. Go back to the public homepage or search page and verify the business is now publicly visible!

## Intentionally Deferred Features
- Forgot Password flow.
- Direct Cloudinary file upload from the client (architecture and UI place holders are ready, but omitted to prevent environment variable configuration headaches during MVP validation).
- Complex analytics charts.
- Subscriptions/Auto-renewal via Razorpay (currently a one-off ₹399 payment for 1 year).
