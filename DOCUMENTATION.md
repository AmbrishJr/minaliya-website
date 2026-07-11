# Minaliya Website — Complete Project Documentation

> **Live URL:** [https://www.minaliya.in](https://www.minaliya.in)
> **Repository:** [https://github.com/AmbrishJr/minaliya-website](https://github.com/AmbrishJr/minaliya-website)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Architecture](#4-architecture)
5. [Database Schema](#5-database-schema)
6. [Authentication System](#6-authentication-system)
7. [Features & Code Explainability](#7-features--code-explainability)
8. [Server Actions & API Routes](#8-server-actions--api-routes)
9. [Workflows](#9-workflows)
10. [Utility Modules](#10-utility-modules)
11. [Component Reference](#11-component-reference)
12. [Scripts & Maintenance](#12-scripts--maintenance)

---

## 1. Project Overview

Minaliya is a full-stack e-commerce website built for **Minaliya Goods And Services**, a Chennai-based company specializing in traditional wooden cold-pressed oils (Mara Chekku oil) — groundnut oil, coconut oil, and sesame oil.

The platform provides:
- A public-facing storefront with product catalog, blog, subscription plans, and informational pages
- A complete checkout and payment flow powered by Razorpay
- Automated GST-compliant invoice generation (PDF + email)
- A comprehensive admin dashboard for managing products, orders, blog, CMS content, and analytics
- OTP-based customer authentication via WhatsApp and email

### Key Differentiators

- **GST-compliant invoicing** — Automatically generates tax invoices with HSN codes, CGST/SGST breakdowns, and amount-in-words after every successful payment
- **Dual invoice delivery** — Invoices are delivered both as a downloadable PDF (hosted on Cloudinary) and as a rich HTML inline email
- **Serverless PDF generation** — Uses `@react-pdf/renderer` instead of Puppeteer, making it compatible with Vercel's serverless functions
- **Full CMS** — Hero slides, footer, header/announcement bar, and blog are all admin-managed through the dashboard
- **Analytics engine** — Built-in analytics with monthly revenue trends, category breakdown, inventory alerts, and AI-like recommendation system

---

## 2. Tech Stack

### Core

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | React framework (App Router, Server Actions, Server Components) |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | v4 | Utility-first styling (via `@tailwindcss/postcss`) |

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL (Neon Serverless) | Primary database |
| Prisma ORM v7.8.0 | Database client, schema, migrations |
| `@prisma/adapter-neon` | Serverless-compatible connection adapter |

### Payment

| Technology | Purpose |
|---|---|
| Razorpay v2.9.6 | Payment gateway (Indian payment processor) |
| Razorpay Webhooks | Server-side payment confirmation fallback |

### File Storage & Media

| Technology | Purpose |
|---|---|
| Cloudinary v2.10.0 | Product images, blog images, invoice PDF hosting |

### Email & Notifications

| Technology | Purpose |
|---|---|
| Webaroo Email Gateway | OTP emails, invoice emails, shipment notifications |
| AiSensy WhatsApp API | WhatsApp OTP delivery |

### PDF Generation

| Technology | Purpose |
|---|---|
| `@react-pdf/renderer` v4.5.1 | Server-side GST-compliant invoice PDF rendering |

### UI & Animation

| Technology | Purpose |
|---|---|
| Framer Motion v12.38.0 | Page transitions, micro-interactions |
| Lucide React v1.14.0 | Icon library |
| clsx v2.1.1 | Conditional class name utility |

### SEO & Analytics

| Technology | Purpose |
|---|---|
| Google Analytics 4 | Web analytics |
| Google Search Console | Search verification |
| Bing Webmaster Tools | Search verification |
| Dynamic `sitemap.ts` | Auto-generated XML sitemap |
| Dynamic `robots.ts` | Crawler directives |
| JSON-LD (`JsonLd.tsx`) | Structured data for search engines |

### Design System

| Resource | Details |
|---|---|
| Fonts | Playfair Display (headings), Inter (body), Cormorant Garamond (display) |
| Color Palette | Custom CSS variables: cream, forest, amber, wood, terra, stone — all with shade scales (50–900) |
| Custom CSS | `globals.css` — 948 lines of design tokens, glass effects, custom components |

---

## 3. Getting Started

### Prerequisites

- **Node.js** v18+ (recommended v20)
- **npm** or **yarn**
- **PostgreSQL** database (Neon recommended for serverless)
- **Razorpay** account (test + live keys)
- **Cloudinary** account (for image/PDF hosting)
- **Webaroo** email gateway credentials
- **AiSensy** WhatsApp campaign API key

### Environment Variables

Create a `.env` file in the project root:

```env
# ─── Database ───
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/minaliya?sslmode=require"

# ─── Admin Credentials ───
ADMIN_EMAIL="mailme@minaliya.in"
ADMIN_PHONE="+917824807770"
ADMIN_SECRET="your-admin-secret-key"

# ─── Razorpay ───
RAZORPAY_KEY_ID="rzp_live_xxx"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# ─── Cloudinary ───
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ─── Email (Webaroo) ───
EMAIL_OTP_API_URL="https://email-gateway.example.com/api/send"
EMAIL_OTP_USERID="your-userid"
EMAIL_OTP_PASSWORD="your-password"
EMAIL_OTP_FROM_NAME="Minaliya"

# ─── WhatsApp OTP (AiSensy) ───
AISENSY_API_KEY="your-aisensy-key"
AISENSY_CAMPAIGN_NAME="your-campaign"
AISENSY_USER_NAME="your-username"

# ─── App ───
NEXT_PUBLIC_BASE_URL="https://www.minaliya.in"
OTP_SECRET="your-otp-hmac-secret"

# ─── Company Details (for invoices) ───
COMPANY_GST="33APKPD8864Q3Z3"
COMPANY_PHONE="+91 98414 22998"
COMPANY_ADDRESS="Old No 87, New No 78, Shop No 3, Kodambakkam Road, Mettupalayam, West Mambalam, Chennai – 600033, Tamil Nadu, India"
COMPANY_FSSAI="12423002001621"

# ─── SEO ───
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE="your-verification-code"
NEXT_PUBLIC_BING_VERIFICATION="your-bing-code"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate deploy

# (Optional) Seed hero slides
npx tsx prisma/seed.ts
```

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000`.

### Build

```bash
npm run build    # Generates Prisma client + builds Next.js
npm run start    # Starts production server
```

### Vercel Deployment

1. Push to GitHub
2. Import the repository in Vercel dashboard
3. Set all environment variables in Vercel's project settings
4. Vercel will auto-detect Next.js and deploy

**Important:** The build script in `package.json` runs `prisma generate && next build` — Vercel will handle this automatically.

---

## 4. Architecture

### Directory Structure

```
minaliya-website-main/
├── prisma/
│   ├── schema.prisma          # Database schema (11 models)
│   ├── migrations/            # 8 migration folders
│   └── seed.ts                # Hero slides seeder
├── public/
│   ├── logo.png               # Company logo
│   ├── products/              # Static product images
│   └── invoices/              # Generated invoice PDFs (legacy)
├── scripts/
│   ├── find-pdf-order.ts      # Debug: audit invoice PDFs
│   └── send-test-email.ts     # Test: send invoice email
├── src/
│   ├── actions/               # Next.js Server Actions (8 files)
│   │   ├── admin.ts           # Admin login/logout/verify
│   │   ├── adminData.ts       # Admin CRUD operations (1034 lines)
│   │   ├── analytics.ts       # Analytics engine
│   │   ├── auth.ts            # Customer OTP auth
│   │   ├── inquiry.ts         # Bulk inquiry submission
│   │   ├── invoice.ts         # Invoice regeneration/resend
│   │   ├── lookupPincode.ts   # Indian pincode lookup
│   │   └── order.ts           # Order creation/retrieval
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout (providers, meta)
│   │   ├── globals.css        # Design system (948 lines)
│   │   ├── shop/              # Product catalog
│   │   ├── about/             # About page
│   │   ├── benefits/          # Health benefits
│   │   ├── contact/           # Contact form
│   │   ├── blog/              # Blog listing + detail
│   │   ├── subscription/      # Subscription plans
│   │   ├── checkout/          # Checkout flow
│   │   ├── account/           # User dashboard
│   │   ├── wishlist/          # Wishlist page
│   │   ├── payment/           # Success/failure pages
│   │   ├── policies/          # Privacy, terms, returns, shipping
│   │   ├── admin/             # Admin panel (10 sections)
│   │   └── api/               # REST API routes
│   ├── components/            # React components (13 directories)
│   ├── context/               # React Context providers (4)
│   ├── data/                  # Static product data
│   └── lib/                   # Utilities & services (16 files)
├── proxy.ts                   # Admin route middleware
├── next.config.ts             # Next.js config (Cloudinary images)
├── prisma.config.ts           # Prisma Neon adapter config
├── postcss.config.mjs         # Tailwind v4 PostCSS
├── eslint.config.mjs          # ESLint v9 flat config
└── package.json
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                   │
│  React Contexts: AuthContext ─ CartContext ─ WishlistContext       │
│       │                    │                  │                    │
│       ▼                    ▼                  ▼                    │
│  localStorage          localStorage       localStorage            │
│  (minaliya-auth)       (minaliya-cart-*)  (minaliya-wishlist)     │
└──────────┬──────────────────┬───────────────────┬────────────────┘
           │ Server Actions   │ API Routes        │
           ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Vercel)                        │
│                                                                   │
│  Server Actions (src/actions/)    API Routes (src/app/api/)      │
│  ├── admin.ts                     ├── razorpay/                  │
│  ├── adminData.ts                 │   ├── create-order           │
│  ├── analytics.ts                 │   ├── verify-payment         │
│  ├── auth.ts                      │   └── webhook                │
│  ├── inquiry.ts                   ├── auth/                      │
│  ├── invoice.ts                   │   ├── register               │
│  ├── lookupPincode.ts             │   └── lookup                 │
│  └── order.ts                     ├── admin/                     │
│                                   │   ├── upload                 │
│  Services (src/lib/)              │   └── delete-image           │
│  ├── prisma.ts (DB client)        ├── orders/                    │
│  ├── razorpay.ts (Payments)       │   ├── [id]/invoice           │
│  ├── cloudinary.ts (Files)        │   └── retry-invoices         │
│  ├── email.ts (Email gateway)     └── header-settings            │
│  ├── invoiceService.tsx                                         │
│  ├── invoicePDF.tsx (PDF render)                                │
│  └── invoiceEmailTemplate.ts                                    │
└──────────┬──────────────────┬───────────────────┬────────────────┘
           │                  │                   │
           ▼                  ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│  PostgreSQL   │  │  Razorpay    │  │  External Services    │
│  (Neon)       │  │  (Payments)  │  │  ├── Cloudinary       │
│  11 models    │  │  Orders +    │  │  ├── Webaroo (Email)  │
│               │  │  Webhooks    │  │  └── AiSensy (WhatsApp)│
└──────────────┘  └──────────────┘  └──────────────────────┘
```

### Key Design Patterns

1. **Server Actions for mutations** — All data writes (order creation, product CRUD, user updates) use Next.js Server Actions with `"use server"` directive. This eliminates the need for manual API route boilerplate for most operations.

2. **React Context for client state** — Four contexts manage all client-side state:
   - `AuthProvider` — User session, login modal, profile
   - `CartProvider` — Cart items with per-user localStorage
   - `WishlistProvider` — Wishlist items in localStorage
   - `OrderProvider` — Client-side order cache

3. **Optimistic updates** — User profile changes are applied to localStorage immediately, then persisted to PostgreSQL in the background. If the DB write fails, the local state remains consistent.

4. **Per-user cart with guest merge** — Cart data is stored in `minaliya-cart-{mobile}` in localStorage. On login, the guest cart is merged with the DB cart (max quantity wins for duplicates).

5. **Fire-and-forget invoice pipeline** — After payment verification, the server returns 200 immediately, then processes invoice generation and email sending asynchronously. A retry endpoint exists for failed invoices.

6. **Dual payment confirmation** — Both the client-side `verify-payment` route AND the Razorpay webhook handle payment confirmation. The webhook acts as a safety net if the client-side verification fails.

7. **Singleton CMS settings** — Footer and header settings use a singleton pattern (single row with `id="default"`) in the database, with hardcoded defaults as fallback.

---

## 5. Database Schema

The database uses PostgreSQL (hosted on Neon) with Prisma ORM. There are **11 models** organized into 3 groups:

### User Models

#### `User`
Customer accounts with authentication and profile data.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `name` | String? | Customer's display name |
| `email` | String? (unique) | Email address |
| `phoneNumber` | String? (unique) | Phone number (primary auth identifier) |
| `image` | String? | Profile image URL |
| `newsletterSubscribed` | Boolean | Default: true |
| `addresses` | Json? | Array of `{ id, name, addressLine1, addressLine2, city, state, zipCode, phone, isDefault }` |
| `cart` | Json? | Array of `CartItem` objects (slug, name, image, price, size, quantity) |
| `role` | Role (enum) | `USER` or `ADMIN` |
| `orders` | Relation | One-to-many → Order |
| `subscriptions` | Relation | One-to-many → Subscription |

### Product Models

#### `Category`
Product categories (e.g., Groundnut Oil, Coconut Oil, Sesame Oil).

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `name` | String (unique) | Category display name |
| `slug` | String (unique) | URL-safe slug |
| `description` | String? | Optional description |
| `products` | Relation | One-to-many → Product |

#### `Product`
Individual products within categories.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `name` | String | Product name |
| `slug` | String (unique) | URL-safe slug |
| `description` | String | Product description |
| `price` | Decimal(10,2) | Original price |
| `discountPrice` | Decimal(10,2)? | Sale price (optional) |
| `stock` | Int | Inventory count |
| `images` | String[] | Array of Cloudinary URLs |
| `imagePublicIds` | String[] | Parallel array of Cloudinary public IDs (for deletion) |
| `isFeatured` | Boolean | Show on homepage |
| `sortOrder` | Int | Display ordering |
| `categoryId` | String (FK) | → Category |
| `specifications` | Json? | Technical details like extraction method, origin |

#### `Order`
Customer orders with full payment and invoice lifecycle tracking.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `userId` | String? (FK) | → User (optional for guest checkout) |
| `status` | OrderStatus (enum) | 8 states: PENDING → CONFIRMED → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED / CANCELLED / RETURNED |
| `totalAmount` | Decimal(10,2) | Order total |
| `shippingAddress` | Json | `{ name, email, phone, address, city, state, pinCode }` |
| `paymentStatus` | String | "PENDING", "PAID", "FAILED" |
| `paymentMethod` | String | "razorpay" |
| `razorpayOrderId` | String? (unique) | Razorpay order ID |
| `razorpayPaymentId` | String? | Razorpay payment ID |
| `awbNumber` | String? | Shipping tracking number (ST Courier) |
| `invoiceNumber` | String? (unique) | e.g., "INV-XXXXXXXX" |
| `invoiceUrl` | String? | Cloudinary URL of generated PDF |
| `invoiceGenerated` | Boolean | PDF generated flag |
| `invoiceSent` | Boolean | Email sent flag |
| `invoiceEmailStatus` | String? | "PENDING", "PROCESSING", "SENT", "FAILED" |
| `invoiceEmailSentAt` | DateTime? | When email was sent |
| `invoiceEmailMessageId` | String? | Email gateway message ID |
| `invoiceDate` | DateTime? | Invoice generation timestamp |
| `items` | Relation | One-to-many → OrderItem |

#### `OrderItem`
Line items within an order.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `orderId` | String (FK) | → Order |
| `productId` | String (FK) | → Product |
| `quantity` | Int | Ordered quantity |
| `price` | Decimal(10,2) | Price at time of purchase (snapshot) |

### Commerce Models

#### `BulkInquiry`
B2B wholesale order inquiry submissions from the contact/bulk-order form.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `name` | String | Contact person |
| `company` | String? | Company name |
| `email` | String | Contact email |
| `phone` | String | Contact phone |
| `product` | String | Product of interest |
| `quantity` | Int | Desired quantity |
| `message` | String? | Additional notes |

#### `Subscription`
Recurring oil subscription plans.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `userId` | String? (FK) | → User |
| `plan` | SubscriptionPlan (enum) | `MONTHLY`, `QUARTERLY`, `ANNUAL` |
| `status` | SubscriptionStatus (enum) | `ACTIVE`, `PAUSED`, `CANCELLED`, `EXPIRED` |
| `oilPreference` | String? | "groundnut", "coconut", "sesame" |
| `startDate` | DateTime | Subscription start |
| `nextDelivery` | DateTime? | Next scheduled delivery |
| `address` | Json | Delivery address |
| `phone` | String | Contact phone |
| `email` | String? | Contact email |
| `razorpayOrderId` | String? | Razorpay order ID |
| `razorpaySubscriptionId` | String? | Razorpay subscription ID |
| `totalAmount` | Decimal(10,2) | Subscription amount |

### CMS Models

#### `Blog`
Blog posts with structured content and SEO metadata.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `title` | String | Blog title |
| `slug` | String (unique) | URL-safe slug |
| `content` | Json | Array of `ContentBlock` objects: `{ type: "heading"|"paragraph"|"list"|"image", text?: string, items?: string[] }` |
| `images` | String[] | Cloudinary URLs |
| `imagePublicIds` | String[] | Cloudinary public IDs |
| `imageAlt` | String? | SEO alt text |
| `imageTitle` | String? | SEO title attribute |
| `imageCaption` | String? | Image caption |
| `imageDescription` | String? | SEO description |
| `author` | String? | Author name |
| `publishedAt` | DateTime | Publication date |

#### `HeroSlide`
Homepage hero carousel slides with structured headlines.

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `label` | String | Slide label (admin reference) |
| `headline` | Json | Array of `{ text: string, style: "display" \| "serif-italic" \| "sans" }` |
| `subtitle` | String | Sub-headline text |
| `image` | String | Banner image URL |
| `imagePublicId` | String? | Cloudinary public ID |
| `imageAlt` | String? | Alt text |
| `accentColor` | String | Default: "#C47700" |
| `badge` | String? | Optional badge text |
| `bgPrimary` | String | Primary background color |
| `bgSecondary` | String | Secondary background color |
| `bgAccent` | String | Accent background color |
| `sortOrder` | Int | Display ordering |
| `isActive` | Boolean | Show/hide toggle |

#### `FooterSettings`
Singleton model for CMS-controlled footer content.

| Field | Type | Notes |
|---|---|---|
| `id` | String | Always "default" |
| `data` | Json | Full footer configuration (company info, links, social media, section toggles) |

#### `HeaderSettings`
Singleton model for CMS-controlled announcement bar.

| Field | Type | Notes |
|---|---|---|
| `id` | String | Always "default" |
| `data` | Json | Announcement bar items and settings |

### Enums

```prisma
enum Role { USER, ADMIN }

enum OrderStatus {
  PENDING, CONFIRMED, PROCESSING, SHIPPED,
  OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED
}

enum SubscriptionPlan { MONTHLY, QUARTERLY, ANNUAL }

enum SubscriptionStatus { ACTIVE, PAUSED, CANCELLED, EXPIRED }
```

### Entity Relationships

```
User ──1:N──> Order ──1:N──> OrderItem ──N:1──> Product
User ──1:N──> Subscription
Category ──1:N──> Product
```

---

## 6. Authentication System

The project has **two separate authentication systems**: one for admins and one for customers.

### 6.1 Admin Authentication (Cookie-Based)

**Files:**
- `src/actions/admin.ts` — Server actions (login, logout, verify)
- `src/app/admin/login/page.tsx` — Login form
- `proxy.ts` — Route-level middleware

**Flow:**

```
Admin visits /admin/login
        │
        ▼
Enters email + phone
        │
        ▼
adminLogin() compares against ADMIN_EMAIL + ADMIN_PHONE env vars
        │
        ├── Mismatch → Return error
        │
        └── Match → Generate token: base64(ADMIN_SECRET:timestamp:random)
                     │
                     ▼
              Set httpOnly cookie "minaliya-admin-session" (24h expiry)
                     │
                     ▼
              Redirect to /admin
```

**Middleware (`proxy.ts`):**
- Intercepts all `/admin/*` routes
- Allows `/admin/login` (redirects to `/admin` if already authenticated)
- Validates cookie: base64-decodes and checks it starts with `ADMIN_SECRET:`
- Redirects unauthenticated users to `/admin/login`

**Key Code Pattern (`src/actions/admin.ts`):**

```typescript
// Token generation
const token = Buffer.from(`${secret}:${Date.now()}:${Math.random().toString(36)}`).toString("base64");

// Cookie setting
cookies().set("minaliya-admin-session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
});
```

### 6.2 Customer Authentication (OTP-Based)

**Files:**
- `src/actions/auth.ts` — OTP send/verify, user registration
- `src/context/AuthContext.tsx` — Client-side state management
- `src/components/auth/LoginModal.tsx` — Login UI
- `src/lib/auth-utils.ts` — Phone/email normalization helpers
- `src/app/api/auth/register/route.ts` — User registration API
- `src/app/api/auth/lookup/route.ts` — User lookup API

**Flow:**

```
Customer clicks "Login" → LoginModal opens
        │
        ▼
Enters name + mobile number
        │
        ▼
sendOtpAction(name, mobile)
  ├── Generate 6-digit OTP
  ├── Sign with HMAC-SHA256 (OTP_SECRET, 5-min expiry)
  └── Send via AiSensy WhatsApp API
        │
        ▼
Customer enters OTP
        │
        ▼
verifyOtpAction(mobile, otp, otpToken)
  ├── Verify HMAC signature (timing-safe comparison)
  ├── Check expiry (5 minutes)
  └── Look up user by phone
        │
        ├── User exists → Return user data → Login
        │
        └── User not found → needsRegistration: true
                  │
                  ▼
            POST /api/auth/register
                  │
                  ▼
            Create user in DB → Login
```

**Dual Channel OTP:**
- Primary: WhatsApp via AiSensy (`sendOtpAction`)
- Fallback: Email via Webaroo (`sendEmailOtpAction`)
- Both use the same HMAC-signed token mechanism

**User State Persistence:**
- Client-side: `localStorage` key `minaliya-auth`
- Server-side: PostgreSQL `User` table
- Sync: Optimistic update to localStorage → background async persist to DB via `updateUserAction()`

**Registration Merge Logic (`/api/auth/register`):**
- Same phone + same email on same account → Update profile
- Same phone + email on different accounts → Merge (delete orphan if no orders) or return 409 conflict
- Phone exists with different email → Conflict error
- New phone + email → Create new user

---

## 7. Features & Code Explainability

### 7.1 Homepage

**File:** `src/app/page.tsx`

The homepage is a server component that renders the following sections in order:

1. **Hero Slides** (`HeroSection`) — Auto-rotating carousel of CMS-managed slides with structured headlines (multiple text styles), CTAs, and configurable accent colors
2. **Featured Products** (`FeaturedProducts`) — Grid of products marked `isFeatured: true`
3. **Trust Section** (`TrustSection`) — Company trust badges
4. **Why Cold Pressed** (`WhyColdPressed`) — Educational content about cold-pressed oil benefits
5. **Process** (`ProcessSection`) — Visual explanation of the Mara Chekku extraction process
6. **Benefits** (`BenefitsSection`) — Health benefits overview
7. **Testimonials** (`TestimonialsSection`) — Customer reviews
8. **FAQ** (`FAQSection`) — Expandable questions and answers
9. **Blog Preview** (`BlogPreview`) — Latest 3 blog posts
10. **WhatsApp CTA** (`WhatsAppCTA`) — Direct WhatsApp order link

### 7.2 Product Catalog & Shop

**Files:**
- `src/app/shop/page.tsx` — Shop page (server component)
- `src/components/shop/ShopContent.tsx` — Client-side filtering and grid
- `src/components/shop/ProductDetail.tsx` — Individual product page

**How it works:**

- Products are fetched from PostgreSQL via Prisma and displayed in a responsive grid
- Category filtering is done client-side using URL search params
- `ShopContent` handles:
  - Category filter tabs
  - Product grid with responsive card layout
  - Sort by price/name
  - Mobile card layout (stacked cards with image on top)
- `ProductDetail` renders:
  - Image gallery (Cloudinary-hosted, AVIF/WebP optimized)
  - Price display (original + discount)
  - Add to cart with size selection
  - Product specifications from the JSON field
  - Related products

**Product Name Convention:**
All product names are displayed with the brand prefix via `productDisplayName()`:
```
"Groundnut Oil" → "Minaliya Wooden Cold Pressed Groundnut Oil"
```

### 7.3 Shopping Cart

**Files:**
- `src/context/CartContext.tsx` — Cart state management
- `src/components/cart/CartDrawer.tsx` — Slide-out cart drawer

**Architecture:**

The cart uses a **per-user localStorage** strategy:

```
Guest: localStorage["minaliya-cart-guest"] = [{slug, name, image, price, size, quantity}, ...]
User:  localStorage["minaliya-cart-+919876543210"] = [...]
```

**Login/Logout Cart Merge:**

```
GUEST LOGIN:
  1. Snapshot guest cart
  2. Load user's DB cart
  3. Merge: DB cart is base, guest items added on top
     - Duplicate items (same slug + size): take MAX quantity
     - Unique items: append
  4. Save merged cart to user's key + sync to DB
  5. Clear guest cart

USER LOGOUT:
  1. Save current cart to user's personal key
  2. Switch to guest cart key
  3. Load guest cart (empty by default)
```

**Cart Operations:**
- `addItem(item, quantity)` — Adds item or increments quantity if exists
- `removeItem(slug, size)` — Removes item by slug+size composite key
- `updateQuantity(slug, size, quantity)` — Updates quantity (removes if <= 0)
- `clearCart()` — Empties the cart
- All mutations automatically persist to localStorage and sync to DB (if logged in)

### 7.4 Checkout & Payment (Razorpay)

**Files:**
- `src/app/checkout/page.tsx` — Checkout page
- `src/components/checkout/CheckoutClient.tsx` — Checkout form
- `src/app/api/razorpay/create-order/route.ts` — Creates Razorpay order
- `src/app/api/razorpay/verify-payment/route.ts` — Verifies payment signature
- `src/app/api/razorpay/webhook/route.ts` — Webhook handler
- `src/actions/order.ts` — Order creation with stock validation

**Checkout Flow:**

```
Customer proceeds to checkout
        │
        ▼
CheckoutClient renders:
  ├── Address form (auto-fills state from pincode lookup)
  ├── Order summary (items, prices, total)
  └── "Pay" button
        │
        ▼
Click "Pay" → createOrder() server action
  ├── Validate all items exist and have sufficient stock
  ├── Inside a Prisma transaction:
  │   ├── Decrement stock for each product
  │   ├── Create Order record (status: PENDING)
  │   └── Create OrderItem records
  └── Return orderId
        │
        ▼
POST /api/razorpay/create-order
  ├── Rate limit check (5 req/60s per IP, in-memory)
  ├── Check if order already has a Razorpay order (reuse if so)
  ├── Create Razorpay order with amount + receipt
  ├── Link razorpayOrderId to DB order immediately
  └── Return { orderId: razorpayOrderId, dbOrderId }
        │
        ▼
Razorpay checkout opens (client-side SDK)
        │
        ├── Payment succeeds → verify-payment endpoint
        │   ├── Verify HMAC-SHA256 signature
        │   ├── Update order: status=PAID, razorpayPaymentId
        │   └── Fire-and-forget: processInvoice(orderId)
        │
        └── Payment fails → Webhook catches it
            ├── Verify x-razorpay-signature
            └── Update order: status=FAILED (for payment.failed event)
```

**Rate Limiting:**
The `create-order` endpoint uses an in-memory per-IP rate limiter:
- Window: 60 seconds
- Limit: 5 requests per IP
- Returns 429 if exceeded
- Resets on server restart (acceptable for a single-instance deployment)

**Stock Validation:**
Order creation uses a Prisma interactive transaction to atomically:
1. Check stock for all items
2. Decrement stock
3. Create order + order items
If any step fails, the entire transaction rolls back — no partial orders or incorrect stock.

### 7.5 Invoice System (PDF + Email)

**Files:**
- `src/lib/invoiceService.tsx` — Invoice orchestration (generate, process, retry)
- `src/lib/invoicePDF.tsx` — React-PDF document component
- `src/lib/invoiceEmailTemplate.ts` — HTML email template generator
- `src/lib/email.ts` — Email gateway integration
- `src/lib/numberToWords.ts` — Indian number-to-words converter
- `src/lib/cloudinary.ts` — PDF upload to Cloudinary

**Invoice Generation Pipeline:**

```
processInvoice(orderId) called (from verify-payment or webhook)
        │
        ▼
Check: Already sent? → Skip
Check: Currently processing? → Skip (prevent duplicates)
        │
        ▼
Set invoiceEmailStatus = "PROCESSING"
        │
        ▼
Assign invoiceNumber: "INV-{last 8 chars of orderId}"
        │
        ▼
sendInvoiceEmail(order, orderItems)
  │
  ├── Build InvoiceData:
  │   ├── Company details (from env vars)
  │   ├── Customer details (from shippingAddress JSON)
  │   ├── Line items with HSN codes:
  │   │   ├── Groundnut oil → 15089091
  │   │   ├── Sesame oil → 15155091
  │   │   └── Coconut oil → 15131100
  │   ├── GST calculation: 5% (split CGST 2.5% + SGST 2.5%)
  │   └── Amount in words (Indian numbering: lakhs, crores)
  │
  ├── Generate HTML email via generateInvoiceEmailHTML()
  │   └── Responsive HTML with table-based layout
  │       ├── Company header + logo
  │       ├── "Tax Invoice" title
  │       ├── Bill-to section
  │       ├── Items table (SNo, Item, HSN/SAC, Qty, Unit, Price, Discount, GST, Amount)
  │       ├── Summary (subtotal, discount, SGST/CGST, round-off, total, received, balance)
  │       ├── Amount in words
  │       └── Footer
  │
  └── Send via Webaroo email gateway
        │
        ▼
On success:
  ├── Set invoiceEmailStatus = "SENT"
  ├── Set invoiceSent = true
  ├── Record invoiceEmailSentAt timestamp
  └── Record invoiceEmailMessageId

On failure:
  └── Set invoiceEmailStatus = "FAILED"
```

**PDF Generation (On-Demand):**

When a user downloads an invoice (`GET /api/orders/[id]/invoice`):

```
Check if invoiceUrl exists in DB
  ├── Yes → Redirect to Cloudinary URL
  └── No → Generate on-the-fly:
        ├── Build InvoiceData (same as email)
        ├── Render via @react-pdf/renderer → Buffer
        ├── Upload to Cloudinary
        ├── Save URL to DB
        └── Return PDF as download
```

**GST Compliance:**
- GST rate: 5% (standard for food products in India)
- Split: CGST 2.5% + SGST 2.5% (intra-state) or IGST 5% (inter-state)
- HSN codes mapped per product type
- Invoice includes: GSTIN, FSSAI number, company address, amount in words
- Format follows Indian tax invoice standards

### 7.6 Order Management

**Files:**
- `src/actions/order.ts` — Order creation, user order retrieval
- `src/actions/adminData.ts` — Admin order operations
- `src/lib/order-status.ts` — Status configuration and utilities
- `src/app/account/page.tsx` — Customer order dashboard
- `src/components/shared/OrderStatusBadge.tsx` — Status badge component
- `src/components/shared/OrderStatusTimeline.tsx` — Visual timeline

**Order Status Flow:**

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
   │                                                              │
   │←────────────── CANCELLED ──────────────────────────────────────│
   │                                                              │
   └──────────────────────────────────────── RETURNED ─────────────┘
```

**Status Configuration (`order-status.ts`):**

Each status has:
- Display label
- Color scheme (bg, border, text colors)
- Lucide icon
- Terminal status flag (DELIVERED, CANCELLED, RETURNED)

**Admin Order Operations:**
- `updateOrderStatus(id, status)` — Changes status; auto-sends shipment email when status becomes SHIPPED
- `updateOrderAwb(id, awb)` — Adds tracking number; auto-sends email if already shipped
- `deleteOrder(id)` — Cascading delete of order items
- `getAllOrders()` — Returns all orders with items and products
- `getRecentOrders(limit)` — Returns latest N orders

**Customer Order View:**
- Orders are fetched via `getUserOrders()` which queries all orders and filters by matching the shipping address email or phone against the current user
- Displays order timeline, items, tracking number, and invoice download link

### 7.7 Subscription Plans

**Files:**
- `src/app/subscription/page.tsx` — Subscription page
- `src/components/subscription/SubscriptionClient.tsx` — Subscription form

**Plans:**
| Plan | Frequency | Description |
|---|---|---|
| Monthly | Every month | 1L oil delivery |
| Quarterly | Every 3 months | 3L oil delivery |
| Annual | Every 12 months | 12L oil delivery (best value) |

The subscription system collects:
- Plan selection
- Oil preference (groundnut, coconut, sesame)
- Delivery address
- Contact details

Note: Full recurring payment integration with Razorpay Subscriptions is partially implemented (model fields exist) but the checkout flow currently uses one-time payments.

### 7.8 Blog CMS

**Files:**
- `src/app/blog/page.tsx` — Blog listing (server component)
- `src/app/blog/[slug]/page.tsx` — Blog detail page
- `src/lib/blog.ts` — Data access layer
- `src/components/admin/BlogClient.tsx` — Admin blog editor

**Content Structure:**

Blog content is stored as a JSON array of `ContentBlock` objects:

```typescript
interface ContentBlock {
  type: "heading" | "paragraph" | "list" | "image";
  text?: string;        // For heading, paragraph
  items?: string[];     // For list
}
```

**Admin Blog Management:**
- Create/edit/delete blog posts
- Rich content editor with block-based content
- Image upload to Cloudinary
- SEO metadata (alt text, title, description)
- Slug auto-generation from title
- Published date management

### 7.9 Admin Dashboard

**Files:**
- `src/app/admin/(dashboard)/page.tsx` — Dashboard overview
- `src/components/admin/AdminDashboardClient.tsx` — Dashboard UI
- `src/actions/adminData.ts` — All admin CRUD (1034 lines)
- `src/actions/analytics.ts` — Analytics engine

**Dashboard Sections:**

| Section | Route | Description |
|---|---|---|
| Overview | `/admin` | Stats cards, charts, recent orders |
| Orders | `/admin/orders` | Order management with status updates |
| Products | `/admin/products` | Product CRUD with image upload |
| Blog | `/admin/blog` | Blog post management |
| Inquiries | `/admin/inquiries` | Bulk inquiry submissions |
| Hero Slides | `/admin/hero-slides` | Homepage carousel management |
| Footer | `/admin/footer` | Footer CMS |
| Header | `/admin/header-settings` | Announcement bar CMS |
| Analytics | `/admin/analytics` | Revenue analytics and insights |

**Analytics Engine (`analytics.ts`):**

`getAnalyticsData(months?)` generates:

1. **Monthly Revenue Series** — Revenue, order count, average order value per month
2. **MoM Growth** — Month-over-month percentage change
3. **Category Breakdown** — Revenue by product category with market share %
4. **Top Products** — Top 5 products by revenue
5. **Status Distribution** — Order count per status
6. **Inventory Alerts** — Products with stock <= 10
7. **Bulk Inquiry Highlights** — Recent inquiry summary
8. **Recommendations** — Priority-ranked action items:
   - **High:** Process pending orders, restock out-of-stock items
   - **Medium:** Low stock alerts, revenue declines, high cancellation rates
   - **Low:** Growth opportunities, category concentration warnings

**Admin Components (20 components):**

| Component | Purpose |
|---|---|
| `AdminLayoutClient` | Sidebar + header layout wrapper |
| `AdminHeader` | Top navigation with user info |
| `AdminSidebar` | Navigation sidebar |
| `AdminDashboardClient` | Dashboard overview with stats |
| `ProductsTableClient` | Product CRUD table with mobile cards |
| `AddProductModal` | Product creation/edit modal |
| `OrdersTable` | Order management table |
| `OrderStatusBadge` | Colored status indicator |
| `BlogClient` | Blog post management |
| `HeroSlidesClient` | Hero slide management |
| `FooterCMSClient` | Footer content editor |
| `HeaderSettingsClient` | Announcement bar editor |
| `AnalyticsClient` | Analytics dashboard |
| `InquiriesTable` | Inquiry list view |
| `StatCard` | Simple stat display card |
| `InteractiveStatCard` | Animated stat card |
| `GrowthChart` | Revenue/order growth chart |
| `QuickActionsPanel` | Quick action buttons |
| `RecommendationsPanel` | AI-like recommendations |
| `DashboardRecentOrders` | Recent orders widget |

### 7.10 Wishlist

**Files:**
- `src/context/WishlistContext.tsx` — Wishlist state management
- `src/app/wishlist/page.tsx` — Wishlist page
- `src/components/wishlist/WishlistClient.tsx` — Wishlist grid UI

Wishlist is purely client-side, stored in `localStorage["minaliya-wishlist"]`.

**Operations:**
- `addItem(item)` — Add product to wishlist
- `removeItem(slug)` — Remove by slug
- `toggleWishlist(item)` — Add if not present, remove if present
- `isInWishlist(slug)` — Check membership
- `clearWishlist()` — Empty the wishlist

Wishlist items contain: `{ slug, name, image, price, originalPrice }`.

### 7.11 Contact & Bulk Inquiry

**Files:**
- `src/app/contact/page.tsx` — Contact page with form and map
- `src/components/contact/ContactForm.tsx` — Contact form
- `src/actions/inquiry.ts` — Bulk inquiry submission

**Contact Form:**
- Name, email, phone, message fields
- Submits to a contact endpoint (or WhatsApp redirect)

**Bulk Inquiry:**
- Separate form for B2B wholesale inquiries
- Fields: name, company, email, phone, product, quantity, message
- Stored in `BulkInquiry` table
- Viewable in admin dashboard at `/admin/inquiries`

### 7.12 Hero Slides CMS

**Files:**
- `src/components/home/HeroSection.tsx` — Homepage carousel
- `src/components/admin/HeroSlidesClient.tsx` — Admin slide editor
- `src/actions/adminData.ts` — CRUD operations

**Structured Headlines:**
Each slide has a `headline` field that is a JSON array of styled text segments:

```json
[
  { "text": "Minaliya ", "style": "display" },
  { "text": "Wooden Cold Pressed", "style": "serif-italic" },
  { "text": " Oils", "style": "sans" }
]
```

This allows each part of the headline to render in a different font style, creating visually rich hero sections.

**Admin Features:**
- Create/edit/delete slides
- Reorder slides (drag & drop or sort order)
- Toggle active/inactive
- Upload banner images to Cloudinary
- Configure accent colors, background colors, badges
- Auto-delete old Cloudinary images on replace

### 7.13 Footer & Header CMS

**Files:**
- `src/lib/footer-data.ts` — Footer data access
- `src/lib/footer-defaults.ts` — Default footer content
- `src/lib/header-data.ts` — Header data access
- `src/lib/header-defaults.ts` — Default announcement items
- `src/components/admin/FooterCMSClient.tsx` — Footer editor
- `src/components/admin/HeaderSettingsClient.tsx` — Header editor

**Footer CMS (`FooterSettings`):**
Admin can configure:
- Company description
- Contact info (address, phone, email, hours)
- Quick links
- Product categories
- Legal pages
- Social media links
- Google Maps embed
- Payment method icons
- Show/hide toggle for every section

**Header CMS (`HeaderSettings`):**
Admin can configure:
- Announcement bar items (text, links)
- Active/inactive toggle per item

Both use a **singleton pattern**: single row in the database with `id="default"`. If no row exists, hardcoded defaults are returned.

### 7.14 SEO & Analytics

**Files:**
- `src/app/sitemap.ts` — Dynamic sitemap
- `src/app/robots.ts` — Robots.txt generation
- `src/components/seo/JsonLd.tsx` — Structured data
- `src/app/layout.tsx` — Meta tags

**SEO Implementation:**
- Dynamic sitemap generated from products, blog posts, and static pages
- Robots.txt with crawler directives
- JSON-LD structured data for products (Organization, Product schema)
- Open Graph and Twitter Card meta tags
- Google Analytics 4 integration via `NEXT_PUBLIC_GA_ID`
- Google Search Console and Bing Webmaster Tools verification

### 7.15 ChatBot

**File:** `src/components/common/ChatBot.tsx`

A WhatsApp-based chatbot widget that:
- Appears as a floating button on all pages
- Redirects to WhatsApp with a pre-filled message
- Provides quick-action buttons for common queries (order status, products, etc.)

---

## 8. Server Actions & API Routes

### 8.1 Server Actions

#### `src/actions/admin.ts`

| Action | Parameters | Description |
|---|---|---|
| `adminLogin(email, phone)` | Email, phone number | Validates against env vars, sets httpOnly cookie |
| `adminLogout()` | None | Deletes cookie, redirects to `/admin/login` |
| `verifyAdminSession()` | None | Reads and validates admin session cookie |

#### `src/actions/auth.ts`

| Action | Parameters | Description |
|---|---|---|
| `sendOtpAction(name, mobile)` | Customer name, phone | Generates OTP, sends via AiSensy WhatsApp |
| `sendEmailOtpAction(name, email)` | Customer name, email | Generates OTP, sends via Webaroo email |
| `verifyOtpAction(mobile, otp, otpToken, email?, channel?)` | Phone, OTP, signed token | Verifies HMAC signature, returns user or needsRegistration |
| `updateUserAction(currentMobile, data)` | Current phone, partial user data | Upserts user profile with P2002 duplicate handling |

#### `src/actions/order.ts`

| Action | Parameters | Description |
|---|---|---|
| `createOrder(data)` | Order data with items | Transactional: validates stock → decrements → creates Order + OrderItems |
| `getUserOrders(email?, phone?)` | Optional email/phone | Fetches all orders, filters by shipping address match |

#### `src/actions/invoice.ts`

| Action | Parameters | Description |
|---|---|---|
| `regenerateInvoice(orderId)` | Order ID | Admin-only. Force-regenerates invoice PDF |
| `resendInvoiceEmailAction(orderId)` | Order ID | Admin-only. Re-sends invoice email |

#### `src/actions/inquiry.ts`

| Action | Parameters | Description |
|---|---|---|
| `submitInquiry(data)` | Inquiry form data | Creates BulkInquiry record |

#### `src/actions/adminData.ts`

| Action | Description |
|---|---|
| `getAdminDashboardStats()` | Revenue, order count, product count, trends |
| `getAllOrders()` | All orders with items and products |
| `getRecentOrders(limit)` | Latest N orders |
| `updateOrderStatus(id, status)` | Change order status (auto-sends shipment email) |
| `updateOrderAwb(id, awb)` | Add tracking number (auto-sends email if shipped) |
| `deleteOrder(id)` | Delete order and cascade items |
| `getAllProducts()` | All products with category |
| `getAllCategories()` | All categories |
| `createProduct(input)` | Create product |
| `updateProduct(id, input)` | Update product |
| `deleteProduct(id)` | Delete product (cascade items, Cloudinary cleanup) |
| `reorderProducts(ids)` | Update sort order for products |
| `getAllInquiries()` | All bulk inquiries |
| `deleteInquiry(id)` | Delete inquiry |
| `createBlog(input)` | Create blog post |
| `updateBlog(id, input)` | Update blog post |
| `deleteBlog(id)` | Delete blog post (Cloudinary cleanup) |
| `getHeroSlides()` | All hero slides |
| `getActiveHeroSlides()` | Active slides only (public) |
| `createHeroSlide(input)` | Create hero slide |
| `updateHeroSlide(id, input)` | Update hero slide (auto-deletes old image) |
| `deleteHeroSlide(id)` | Delete hero slide |
| `reorderHeroSlides(ids)` | Update slide sort order |
| `updateFooterSettings(data)` | Upsert footer CMS content |
| `updateHeaderSettings(data)` | Upsert header CMS content |

#### `src/actions/analytics.ts`

| Action | Parameters | Description |
|---|---|---|
| `getAnalyticsData(months?)` | Lookback months (default 6) | Full analytics: revenue, growth, categories, top products, alerts, recommendations |

#### `src/actions/lookupPincode.ts`

| Action | Parameters | Description |
|---|---|---|
| `lookupPincode(pincode)` | 6-digit Indian pincode | Resolves state from api.postalpincode.in |

### 8.2 API Routes

#### Payment

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/api/razorpay/create-order` | None | 5 req/60s/IP | Creates Razorpay order, links to DB order |
| POST | `/api/razorpay/verify-payment` | None | None | Verifies payment signature, triggers invoice pipeline |
| POST | `/api/razorpay/webhook` | Razorpay signature | None | Handles payment.captured and payment.failed events |

#### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | User registration with merge logic |
| POST | `/api/auth/lookup` | None | User lookup by phone or email |

#### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders/[id]/invoice` | None | Download invoice PDF (redirect to Cloudinary or generate) |
| POST | `/api/orders/[id]/invoice/generate` | Admin | Force-regenerate invoice PDF |
| POST | `/api/orders/[id]/invoice/resend` | Admin | Resend invoice email |
| POST/GET | `/api/orders/retry-invoices` | Admin | Retry all failed invoice emails |

#### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/upload` | Admin | Upload images to Cloudinary (max 4, 5MB each) |
| POST | `/api/admin/delete-image` | Admin | Delete image from Cloudinary |

#### Settings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/header-settings` | None | Get header/announcement settings |
| PUT | `/api/header-settings` | Admin | Update header settings |

---

## 9. Workflows

### 9.1 Customer Purchase Flow

```
1. Browse Shop (/shop)
   └── Filter by category, view product detail
   
2. Add to Cart
   ├── Select size variant
   ├── Click "Add to Cart"
   └── CartDrawer opens automatically
   
3. Proceed to Checkout (/checkout)
   ├── Enter shipping address
   ├── Pincode auto-fills state via lookupPincode()
   └── Review order summary
   
4. Login (if not already)
   ├── Enter name + mobile
   ├── Receive OTP via WhatsApp
   └── Enter OTP to verify
   
5. Payment
   ├── Click "Pay" → createOrder() (validates stock, creates DB order)
   ├── Razorpay checkout opens
   ├── Enter payment details
   └── Complete payment
   
6. Post-Payment
   ├── verify-payment confirms signature → marks order PAID
   ├── processInvoice() runs async:
   │   ├── Generates invoice number
   │   ├── Sends invoice email (HTML inline)
   │   └── Updates order with email status
   ├── Redirect to /payment/success
   └── Order appears in /account → Orders tab
```

### 9.2 Payment & Invoice Pipeline

```
Payment Success
    │
    ▼
verify-payment endpoint
    │
    ├── Verify HMAC-SHA256(payment_id, order_id, RAZORPAY_KEY_SECRET)
    │
    ├── Update Order:
    │   ├── status → "PAID"
    │   ├── razorpayPaymentId → payment_id
    │   └── paymentStatus → "PAID"
    │
    └── Fire-and-forget: processInvoice(orderId)
            │
            ├── Guard: Skip if invoiceSent=true or status=PROCESSING
            │
            ├── Set invoiceEmailStatus → "PROCESSING"
            │
            ├── Generate invoiceNumber (if missing)
            │
            └── sendInvoiceEmail(order, items)
                    │
                    ├── Build invoice data:
                    │   ├── Map items with HSN codes
                    │   ├── Calculate GST (5%: CGST 2.5% + SGST 2.5%)
                    │   └── Convert total to words
                    │
                    ├── Generate HTML email
                    │
                    └── Send via Webaroo gateway
                            │
                            ├── Success → Status: SENT, invoiceSent: true
                            └── Failure → Status: FAILED
```

### 9.3 Admin Order Processing

```
Admin views /admin/orders
    │
    ├── See all orders with status badges
    ├── Filter by status
    └── Click order to view details
            │
            ├── Update Status:
            │   ├── Select new status from dropdown
            │   ├── updateOrderStatus(id, newStatus)
            │   └── If status → SHIPPED: auto-send shipment email
            │
            ├── Add Tracking:
            │   ├── Enter AWB number
            │   ├── updateOrderAwb(id, awb)
            │   └── If already shipped: auto-send shipment email
            │
            ├── Regenerate Invoice:
            │   └── regenerateInvoice(id) → Force-regenerate PDF
            │
            ├── Resend Invoice:
            │   └── resendInvoiceEmailAction(id) → Re-send email
            │
            └── Delete Order:
                └── deleteOrder(id) → Cascade delete items
```

### 9.4 User Registration (OTP)

```
New User:
    │
    ├── Enter name + phone in LoginModal
    ├── sendOtpAction() → HMAC-signed OTP → AiSensy WhatsApp
    ├── Enter OTP
    ├── verifyOtpAction() → needsRegistration: true
    ├── POST /api/auth/register → Create user in DB
    └── Login (store in localStorage)

Existing User:
    │
    ├── Enter phone (no name required for returning users)
    ├── sendOtpAction() → Send OTP
    ├── Enter OTP
    ├── verifyOtpAction() → Return user data
    └── Login (store in localStorage)
```

### 9.5 Image Upload Flow

```
Admin uploads product images:
    │
    ├── Select up to 4 images in AddProductModal
    ├── POST /api/admin/upload (multipart form data)
    │   ├── Validate: MIME type (JPEG/PNG/WebP), size (<=5MB each)
    │   ├── Upload each to Cloudinary "products" folder
    │   └── Return URLs[] + publicIds[]
    │
    ├── Save URLs[] and publicIds[] to Product record
    │
    └── On product delete:
        └── deleteImages(publicIds[]) → Remove from Cloudinary
```

---

## 10. Utility Modules

All utility modules live in `src/lib/`:

### `prisma.ts` — Database Client
Singleton Prisma client using `@prisma/adapter-neon` for serverless PostgreSQL. Stores client on `globalThis` in development to prevent hot-reload connection leaks.

### `razorpay.ts` — Payment SDK
Lazy-initialized Razorpay client singleton. Reads `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from environment. Throws on missing config.

### `cloudinary.ts` — Media Management
Cloudinary v2 SDK configuration and helpers:
- `validateImageFile(file)` — MIME type + size validation (5MB max)
- `uploadImage(buffer, folder)` — Stream buffer to Cloudinary
- `uploadInvoicePdf(buffer, invoiceNumber)` — Upload raw PDF
- `deleteImage(publicId)` / `deleteImages(publicIds[])` — Batch delete
- Constants: `MAX_FILE_SIZE` (5MB), `MAX_IMAGES` (4), `ALLOWED_MIME_TYPES`

### `email.ts` — Email Gateway
Webaroo/EMS email gateway integration:
- `sendEmail(recipient, subject, content)` — Core send function (URL-encoded POST)
- `sendOtpEmail(recipient, otp, name)` — Branded OTP email with security warning
- `sendInvoiceEmail(order, orderItems)` — Full HTML tax invoice email
- `sendShipmentEmail(order)` — Shipping notification with tracking info

### `invoiceService.tsx` — Invoice Orchestration
The core invoice pipeline (detailed in Section 7.5):
- `generateInvoicePDF(orderId, forceRegenerate?)` — Renders PDF via React-PDF, uploads to Cloudinary
- `processInvoice(orderId)` — Full email flow with deduplication guards
- `retryFailedInvoiceEmail(orderId)` — Only retries FAILED invoices
- `getHsnCode(productName)` — Maps product names to HSN codes

### `invoicePDF.tsx` — PDF Document
React-PDF `InvoiceDocument` component rendering an A4 tax invoice. Uses `@react-pdf/renderer`'s `renderToBuffer()` for server-side rendering.

### `invoiceEmailTemplate.ts` — Email Template
`generateInvoiceEmailHTML(data)` produces a complete responsive HTML document with inline styles and table-based layout for email client compatibility.

### `numberToWords.ts` — Indian Number System
Converts amounts to Indian English text: "One Thousand Two Hundred Thirty Four Rupees and Fifty Six Paise Only". Supports Indian numbering: ones, thousands, lakhs, crores.

### `auth-utils.ts` — Auth Helpers
- `hasValidProfileName(name)` — Rejects placeholder names
- `normalizePhone(mobile)` — Strips non-digits, takes last 10
- `normalizeEmail(email)` — Trim + lowercase
- `isAdminCredentialsMatch(email, phone, ...)` — Credential comparison
- `isCompleteReturningUser(user, email, mobile)` — Checks if user has real name + both email and phone

### `product-utils.ts` — Product Helpers
- `slugify(name)` — URL-safe slug generation
- `productDisplayName(name)` — Prepends "Minaliya Wooden Cold Pressed" brand prefix

### `order-status.ts` — Status Configuration
Defines all 8 order statuses with visual config (label, colors, icon, terminal flag). Exports `getStatusConfig()`, `isTerminalStatus()`, `DELIVERY_STATUSES`, `TERMINAL_STATUSES`.

### `blog.ts` — Blog Data Access
- `getAllBlogs()` — All blogs ordered by publishedAt desc
- `getBlogBySlug(slug)` — Single blog by slug

### `header-data.ts` / `header-defaults.ts` — Header CMS
Reads from `HeaderSettings` table, falls back to hardcoded defaults: "Free Shipping on Orders Above Rs.499", WhatsApp order number, etc.

### `footer-data.ts` / `footer-defaults.ts` — Footer CMS
Reads from `FooterSettings` table, falls back to comprehensive defaults: company info, links, social media, payment methods.

---

## 11. Component Reference

### Layout Components (`src/components/layout/`)

| Component | File | Description |
|---|---|---|
| `AnnouncementBar` | `AnnouncementBar.tsx` | CMS-controlled scrolling announcement bar at the top |
| `Navbar` | `Navbar.tsx` | Main navigation with cart count, login button, responsive menu |
| `Footer` | `Footer.tsx` | CMS-controlled footer with multiple sections |
| `FooterNewsletter` | `FooterNewsletter.tsx` | Newsletter subscription form in footer |

### Homepage Components (`src/components/home/`)

| Component | File | Description |
|---|---|---|
| `HeroSection` | `HeroSection.tsx` | Auto-rotating hero carousel with structured headlines |
| `FeaturedProducts` | `FeaturedProducts.tsx` | Grid of featured products |
| `TrustSection` | `TrustSection.tsx` | Trust badges and company values |
| `WhyColdPressed` | `WhyColdPressed.tsx` | Educational content about cold-pressed oils |
| `ProcessSection` | `ProcessSection.tsx` | Mara Chekku extraction process visualization |
| `BenefitsSection` | `BenefitsSection.tsx` | Health benefits overview |
| `TestimonialsSection` | `TestimonialsSection.tsx` | Customer reviews carousel |
| `FAQSection` | `FAQSection.tsx` | Expandable FAQ accordion |
| `BlogPreview` | `BlogPreview.tsx` | Latest 3 blog posts |
| `WhatsAppCTA` | `WhatsAppCTA.tsx` | Floating WhatsApp order button |

### Shop Components (`src/components/shop/`)

| Component | File | Description |
|---|---|---|
| `ShopContent` | `ShopContent.tsx` | Product grid with category filtering, sorting, mobile cards |
| `ProductDetail` | `ProductDetail.tsx` | Individual product view with gallery, specs, add-to-cart |

### Cart & Checkout (`src/components/cart/`, `src/components/checkout/`)

| Component | File | Description |
|---|---|---|
| `CartDrawer` | `CartDrawer.tsx` | Slide-out cart panel with item list, quantity controls, total |
| `CheckoutClient` | `CheckoutClient.tsx` | Address form, order summary, payment button |

### Auth (`src/components/auth/`)

| Component | File | Description |
|---|---|---|
| `LoginModal` | `LoginModal.tsx` | Modal with name/phone input, OTP verification, registration |

### Account (`src/components/account/`)

| Component | File | Description |
|---|---|---|
| `AccountDashboard` | `AccountDashboard.tsx` | User profile, order history, addresses, invoice downloads |

### Shared (`src/components/shared/`)

| Component | File | Description |
|---|---|---|
| `ProductName` | `ProductName.tsx` | Brand-prefixed product name with `splitOnMobile` prop for 3-line display |
| `OrderStatusBadge` | `OrderStatusBadge.tsx` | Colored badge showing order status |
| `OrderStatusTimeline` | `OrderStatusTimeline.tsx` | Visual timeline of order progression |

### Common (`src/components/common/`)

| Component | File | Description |
|---|---|---|
| `ChatBot` | `ChatBot.tsx` | WhatsApp floating button with quick actions |
| `SkipToContent` | `SkipToContent.tsx` | Accessibility: skip navigation link |

### SEO (`src/components/seo/`)

| Component | File | Description |
|---|---|---|
| `JsonLd` | `JsonLd.tsx` | Structured data (JSON-LD) for Organization and Product schema |

### Contact (`src/components/contact/`)

| Component | File | Description |
|---|---|---|
| `ContactForm` | `ContactForm.tsx` | Contact form with validation |

### Subscription (`src/components/subscription/`)

| Component | File | Description |
|---|---|---|
| `SubscriptionClient` | `SubscriptionClient.tsx` | Subscription plan selection and checkout form |

### Admin (`src/components/admin/` — 20 components)

See Section 7.9 for the complete admin component list.

---

## 12. Scripts & Maintenance

### `scripts/find-pdf-order.ts`
Debug script that connects to the database, queries all orders with `invoiceGenerated=true`, and checks if the corresponding PDF file exists on the local filesystem. Used for auditing invoice generation.

### `scripts/send-test-email.ts`
Test script that finds a specific order, overrides the recipient email, and sends a test invoice email. Used during development to verify email delivery.

### Database Migrations

The project has 8 migrations in `prisma/migrations/`:

| Migration | Purpose |
|---|---|
| `20260618142105_init` | Initial schema (User, Category, Product, Order, OrderItem) |
| `20260625195600_add_awb_hero` | Add AWB number field, HeroSlide model |
| `20260626103846_add_cloudinary_public_ids` | Add imagePublicIds fields for Cloudinary cleanup |
| `20260627021656_add_blog_model` | Add Blog model |
| `20260628141934_add_sort_order_to_product` | Add sortOrder to Product |
| `20260628144136_add_footer_settings` | Add FooterSettings singleton |
| `20260630000000_add_order_statuses` | Expand OrderStatus enum with all 8 states |
| `20260703000000_add_header_settings` | Add HeaderSettings singleton |

### Key Configuration Files

| File | Purpose |
|---|---|
| `next.config.ts` | Cloudinary remote patterns, image optimization (AVIF/WebP), quality levels |
| `tsconfig.json` | TypeScript config with `@/*` path alias → `./src/*` |
| `postcss.config.mjs` | Tailwind CSS v4 PostCSS plugin |
| `eslint.config.mjs` | ESLint v9 flat config (core-web-vitals + TypeScript) |
| `prisma.config.ts` | Prisma datasource configuration with Neon adapter |

### Production Considerations

- **Rate limiting** is in-memory and resets on server restart — acceptable for Vercel's serverless model but consider Redis for multi-instance deployments
- **Cart data** is localStorage-based — clearing browser data loses cart state (DB sync for logged-in users provides backup)
- **Invoice retry** endpoint supports both GET and POST for cron job compatibility
- **Image optimization** — Next.js serves AVIF/WebP formats with configurable quality levels
- **Security** — Admin auth uses httpOnly cookies, OTP tokens use HMAC-SHA256 with timing-safe comparison, payment verification uses Razorpay signature validation

---

*Documentation generated for the Minaliya website project. Last updated: July 2026.*
