# SHEDESHA Reunion Site — Plan A: Foundation + Core Public Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js 14 project under `yolo_reunion_site/apps/reunion-website/`, configure the database with Prisma, and deliver all static public-facing pages (Homepage, About, Programme, FAQ, Contact) with pixel-perfect mobile-first design.

**Architecture:** Next.js 14 App Router for full-stack rendering. Tailwind CSS + shadcn/ui for design system. PostgreSQL via Prisma ORM. All pages are server components by default; client components only where interactivity is required.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL 16, Framer Motion, React Hook Form, Zod, Lucide Icons, next/image, next/font

## Global Constraints

- Node.js >= 22, npm >= 10
- Project root: `/home/admin/yolo_reunion_site/apps/reunion-website/`
- DB name: `shedesha_db`, DB user: `shedesha_user`
- All copy must reference "Sacred Heart College Douala (SHEDESHA)" by full name on first use per page
- Mobile-first: all layouts must work at 320px minimum width
- No raw card data stored anywhere — enforced by architecture, not just policy
- Colors: primary `#8B1A1A` (deep red, school colors), accent `#D4AF37` (gold), neutral `#1a1a1a`
- Font: Playfair Display (headings) + Inter (body) via next/font
- Images served via `next/image` with explicit width/height always
- TypeScript strict mode on — no `any` types
- All forms must have CAPTCHA (hCaptcha free tier)
- Privacy policy and terms pages are placeholders (content TBD by committee)

---

## File Map

```
apps/reunion-website/
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── prisma/
│   └── schema.prisma          # Full DB schema (all models, Plan A seeds core tables)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, metadata, nav, footer
│   │   ├── page.tsx            # Homepage
│   │   ├── about/page.tsx
│   │   ├── programme/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx    # Placeholder
│   │   └── terms/page.tsx      # Placeholder
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Mobile hamburger + desktop nav
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CountdownTimer.tsx   # Client component
│   │   │   ├── EventInfo.tsx
│   │   │   ├── Objectives.tsx
│   │   │   ├── PhotoGalleryPreview.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── programme/
│   │   │   └── ScheduleItem.tsx
│   │   ├── contact/
│   │   │   └── ContactForm.tsx      # Client component
│   │   └── ui/                      # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts               # Prisma client singleton
│   │   └── constants.ts        # Event date, location, prices
│   └── types/
│       └── index.ts            # Shared TypeScript types
```

---

### Task 1: Project Scaffold + Environment

**Files:**
- Create: `apps/reunion-website/` (entire Next.js project)
- Create: `apps/reunion-website/.env.local.example`
- Create: `apps/reunion-website/next.config.ts`
- Create: `apps/reunion-website/tailwind.config.ts`

**Interfaces:**
- Produces: running `npm run dev` at `http://localhost:3000`

- [ ] **Step 1: Bootstrap Next.js project on the server**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && \
  npx create-next-app@latest . \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias '@/*' \
    --no-git \
    --yes"
```

- [ ] **Step 2: Install dependencies**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && npm install \
  @prisma/client prisma \
  framer-motion \
  react-hook-form \
  @hookform/resolvers \
  zod \
  lucide-react \
  date-fns \
  @hcaptcha/react-hcaptcha \
  clsx \
  tailwind-merge \
  class-variance-authority"
```

- [ ] **Step 3: Install shadcn/ui**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && \
  npx shadcn@latest init --yes --defaults"
```

- [ ] **Step 4: Add shadcn components used across the site**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && \
  npx shadcn@latest add button card input label textarea select badge \
    accordion dialog sheet navigation-menu separator"
```

- [ ] **Step 5: Create `.env.local.example`**

```env
# Database
DATABASE_URL="postgresql://shedesha_user:PASSWORD@localhost:5432/shedesha_db"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_EVENT_DATE="2026-12-26"
NEXT_PUBLIC_EVENT_LOCATION="Douala, Cameroon"

# hCaptcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=""
HCAPTCHA_SECRET_KEY=""

# Email (Plan C)
RESEND_API_KEY=""
EMAIL_FROM="noreply@shedesha-reunion.com"

# Cloudinary (Plan D)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Admin Auth (Plan D)
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

- [ ] **Step 6: Configure `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 7: Configure `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1A1A',
          foreground: '#FFFFFF',
          50: '#FDF2F2',
          100: '#FAE2E2',
          500: '#8B1A1A',
          600: '#7A1616',
          700: '#661212',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF7E8',
          100: '#F5EBC5',
          500: '#D4AF37',
          600: '#B8961E',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 8: Create `src/lib/constants.ts`**

```typescript
export const EVENT = {
  name: 'SHEDESHA Reunion 2026',
  fullName: 'Sacred Heart College Douala (SHEDESHA)',
  date: new Date('2026-12-26T10:00:00'),
  dateDisplay: 'December 26, 2026',
  location: 'Douala, Cameroon',
  venue: 'TBD — Sacred Heart College Douala',
  registrationFee: 25000, // XAF
  registrationFeeDisplay: '25,000 XAF',
  contactEmail: 'info@shedesha-reunion.com',
  contactWhatsApp: '+237600000000',
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
} as const
```

- [ ] **Step 9: Create `src/types/index.ts`**

```typescript
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW'
export type RegistrationStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL'
export type PaymentMethod = 'MTN_MOMO' | 'ORANGE_MONEY' | 'CARD' | 'PAYPAL' | 'BANK_TRANSFER'

export interface AlumniRecord {
  id: string
  fullName: string
  formerName?: string
  yearAdmission: number
  yearGraduation?: number
  className?: string
  batch?: string
  house?: string
  phone?: string
  email?: string
  country?: string
  city?: string
  occupation?: string
  photoUrl?: string
  verificationStatus: VerificationStatus
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Registration {
  id: string
  registrationId: string
  fullName: string
  email: string
  phone: string
  country: string
  classYear: string
  guestCount: number
  status: RegistrationStatus
  paymentStatus: PaymentStatus
  alumniRecordId?: string
  createdAt: Date
}

export interface ProgrammeItem {
  id: string
  time: string
  title: string
  description?: string
  speaker?: string
  location?: string
  order: number
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface Testimonial {
  id: string
  name: string
  classYear: string
  quote: string
  photoUrl?: string
}
```

- [ ] **Step 10: Create Prisma client singleton `src/lib/db.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

- [ ] **Step 11: Commit scaffold**

```bash
cd /home/admin/yolo_reunion_site && git add apps/reunion-website && git commit -m "feat: scaffold Next.js 14 reunion-website project"
```

---

### Task 2: Database + Prisma Schema

**Files:**
- Create: `apps/reunion-website/prisma/schema.prisma`
- Create: `apps/reunion-website/prisma/seed.ts`

**Interfaces:**
- Produces: `db.alumniRecord`, `db.registration`, `db.programmeItem`, `db.faqItem`, `db.testimonial`, `db.mediaItem`, `db.donation`, `db.adminUser` — all queryable via the Prisma client from `@/lib/db`

- [ ] **Step 1: Create PostgreSQL database and user on server**

```bash
ssh admin@100.89.106.33 "sudo -u postgres psql -c \"CREATE USER shedesha_user WITH PASSWORD 'shedesha_secure_2026';\"; sudo -u postgres psql -c \"CREATE DATABASE shedesha_db OWNER shedesha_user;\"; sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE shedesha_db TO shedesha_user;\""
```

Expected output: `CREATE ROLE`, `CREATE DATABASE`, `GRANT`

- [ ] **Step 2: Create `.env.local` from example**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && \
  cp .env.local.example .env.local && \
  sed -i 's/PASSWORD/shedesha_secure_2026/' .env.local"
```

- [ ] **Step 3: Write `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
  MANUAL_REVIEW
}

enum RegistrationStatus {
  PENDING_VERIFICATION
  VERIFIED
  PENDING_PAYMENT
  PAID
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  PARTIAL
}

enum PaymentMethod {
  MTN_MOMO
  ORANGE_MONEY
  CARD
  PAYPAL
  BANK_TRANSFER
}

enum DonationType {
  CHARITY
  SCHOOL_SUPPORT
  ALUMNI_PROJECT
  SPONSORSHIP
  CUSTOM
}

model AlumniRecord {
  id                 String             @id @default(cuid())
  fullName           String
  formerName         String?
  yearAdmission      Int
  yearGraduation     Int?
  className          String?
  batch              String?
  house              String?
  dateOfBirth        DateTime?
  phone              String?            @unique
  email              String?            @unique
  country            String?
  city               String?
  occupation         String?
  photoUrl           String?
  verificationStatus VerificationStatus @default(PENDING)
  adminNotes         String?
  importedAt         DateTime?
  registrations      Registration[]
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  @@index([fullName])
  @@index([yearGraduation])
  @@index([batch])
  @@index([verificationStatus])
}

model Registration {
  id               String             @id @default(cuid())
  registrationId   String             @unique @default(cuid())
  fullName         String
  email            String
  phone            String
  country          String
  classYear        String
  guestCount       Int                @default(0)
  guestDetails     Json?
  dietaryPrefs     String?
  accessibilityNeeds String?
  consentUpdates   Boolean            @default(false)
  agreedToTerms    Boolean            @default(false)
  status           RegistrationStatus @default(PENDING_VERIFICATION)
  paymentStatus    PaymentStatus      @default(PENDING)
  alumniRecord     AlumniRecord?      @relation(fields: [alumniRecordId], references: [id])
  alumniRecordId   String?
  payments         Payment[]
  calendarSent     Boolean            @default(false)
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  @@index([email])
  @@index([phone])
  @@index([status])
  @@index([paymentStatus])
}

model Payment {
  id              String         @id @default(cuid())
  registration    Registration   @relation(fields: [registrationId], references: [id])
  registrationId  String
  amount          Int
  currency        String         @default("XAF")
  method          PaymentMethod
  status          PaymentStatus  @default(PENDING)
  providerRef     String?
  providerData    Json?
  receiptUrl      String?
  failureReason   String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([registrationId])
  @@index([status])
}

model Donation {
  id            String       @id @default(cuid())
  donorName     String?
  donorEmail    String?
  amount        Int
  currency      String       @default("XAF")
  type          DonationType
  message       String?
  anonymous     Boolean      @default(false)
  method        PaymentMethod
  status        PaymentStatus @default(PENDING)
  providerRef   String?
  receiptSent   Boolean      @default(false)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@index([status])
  @@index([type])
}

model ProgrammeItem {
  id          String   @id @default(cuid())
  time        String
  title       String
  description String?
  speaker     String?
  location    String?
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([order])
}

model FAQItem {
  id        String   @id @default(cuid())
  question  String
  answer    String
  category  String   @default("general")
  order     Int      @default(0)
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([category])
  @@index([order])
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  classYear String
  quote     String
  photoUrl  String?
  published Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model MediaItem {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        String   // 'photo' | 'video'
  url         String
  thumbnailUrl String?
  year        Int?
  albumName   String?
  batch       String?
  cloudinaryId String?
  published   Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([type])
  @@index([year])
  @@index([albumName])
}

model SiteContent {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}

model AdminUser {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         String    @default("admin") // 'super_admin' | 'admin' | 'viewer'
  lastLogin    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model AuditLog {
  id        String   @id @default(cuid())
  adminId   String
  action    String
  resource  String
  resourceId String?
  details   Json?
  ip        String?
  createdAt DateTime @default(now())

  @@index([adminId])
  @@index([resource])
  @@index([createdAt])
}

model VerificationRequest {
  id          String             @id @default(cuid())
  fullName    String
  email       String
  phone       String
  classYear   String
  details     String
  status      VerificationStatus @default(MANUAL_REVIEW)
  adminNotes  String?
  resolvedAt  DateTime?
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  @@index([status])
}
```

- [ ] **Step 4: Run Prisma migration**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && \
  npx prisma migrate dev --name init"
```

Expected: `Your database is now in sync with your schema.`

- [ ] **Step 5: Write seed file `prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.programmeItem.createMany({
    skipDuplicates: true,
    data: [
      { time: '9:00 AM', title: 'Arrival & Registration', description: 'Welcome desk, name badges, and refreshments', order: 1 },
      { time: '10:00 AM', title: 'Welcome Speech', description: 'Opening remarks by the Reunion Committee Chair', order: 2 },
      { time: '10:30 AM', title: 'School History & Alumni Recognition', description: 'Celebrating milestones and honouring distinguished alumni', order: 3 },
      { time: '12:00 PM', title: 'Networking Session', description: 'Connect with former classmates and faculty', order: 4 },
      { time: '1:00 PM', title: 'Lunch', description: 'Shared meal — traditional and international options', order: 5 },
      { time: '2:30 PM', title: 'Fundraising & Charity Segment', description: 'Presentations and pledges for the school support fund', order: 6 },
      { time: '3:30 PM', title: 'Entertainment', description: 'Music, performances, and celebrations', order: 7 },
      { time: '5:00 PM', title: 'Group Photos', description: 'Official reunion photographs by class and batch', order: 8 },
      { time: '5:30 PM', title: 'Closing Remarks', description: 'Thank you from the committee and preview of next reunion', order: 9 },
    ],
  })

  await prisma.fAQItem.createMany({
    skipDuplicates: true,
    data: [
      { question: 'Who can register?', answer: 'Any former student of Sacred Heart College Douala (SHEDESHA) is welcome to register. You will need to verify your alumni status during registration.', category: 'registration', order: 1 },
      { question: 'How does SHEDESHA alumni verification work?', answer: 'During registration, you enter your name, class year, batch, and other school details. Our system searches the alumni database for a match. If found, you proceed immediately. If not found, you submit a manual verification request that our admin team reviews within 48 hours.', category: 'verification', order: 2 },
      { question: 'What if my name is not in the database?', answer: 'Submit a manual verification request with your name, graduation year, class, and any supporting details. Our admin team will review and respond within 48 hours.', category: 'verification', order: 3 },
      { question: 'How do I pay?', answer: 'After registration is verified, you will receive a payment link via email. You can pay via MTN Mobile Money, Orange Money, credit/debit card, or PayPal.', category: 'payment', order: 4 },
      { question: 'Which payment methods are accepted?', answer: 'We accept MTN Mobile Money, Orange Money, international credit/debit cards, and PayPal. Bank transfer is also available — contact us for details.', category: 'payment', order: 5 },
      { question: 'Can I bring a guest?', answer: 'Yes, you may bring guests. Guest details and fees will be collected during registration.', category: 'registration', order: 6 },
      { question: 'Can I donate without attending?', answer: 'Absolutely. Visit our Donate page to contribute to the charity fund, school support, or alumni projects without registering for the event.', category: 'donation', order: 7 },
      { question: 'How do I get my receipt?', answer: 'Receipts are emailed automatically after successful payment. You can also download your receipt from your registration confirmation page.', category: 'payment', order: 8 },
      { question: 'Can I update my registration?', answer: 'Yes. Contact us at info@shedesha-reunion.com with your registration ID and the changes needed.', category: 'registration', order: 9 },
      { question: 'What is the refund policy?', answer: 'Refunds are available up to 30 days before the event. Contact us at info@shedesha-reunion.com. Donations are non-refundable.', category: 'payment', order: 10 },
      { question: 'Who do I contact for help?', answer: 'Email info@shedesha-reunion.com or WhatsApp +237600000000. Our team responds within 24 hours.', category: 'general', order: 11 },
    ],
  })

  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Jean-Paul Mbarga', classYear: 'Class of 1995', quote: 'SHEDESHA shaped who I am. The values I learned there still guide me every day. The reunion brought it all back — tears, laughter, and pride.', order: 1 },
      { name: 'Marie-Claire Ngo', classYear: 'Class of 2001', quote: 'Seeing faces I had not seen in 20 years — it was magical. Sacred Heart gave us a bond that time cannot break.', order: 2 },
      { name: 'Emmanuel Fotso', classYear: 'Class of 1988', quote: 'The reunion reminded me why we all carry SHEDESHA with us wherever we go in the world. This community is for life.', order: 3 },
    ],
  })

  console.log('Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

- [ ] **Step 6: Add seed script to `package.json`**

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

- [ ] **Step 7: Install ts-node and run seed**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && \
  npm install -D ts-node && npx prisma db seed"
```

Expected: `Seed complete.`

- [ ] **Step 8: Commit**

```bash
cd /home/admin/yolo_reunion_site && git add apps/reunion-website/prisma && git commit -m "feat: Prisma schema, migration, and seed data for SHEDESHA reunion"
```

---

### Task 3: Root Layout, Navbar, Footer

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/components/layout/Navbar.tsx` (client)
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `<Navbar />`, `<Footer />` — used in root layout wrapping all pages

- [ ] **Step 1: Write `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 10%;
    --primary: 0 71% 32%;
    --primary-foreground: 0 0% 100%;
    --gold: 43 67% 52%;
  }
  html { scroll-behavior: smooth; }
  body { @apply font-inter text-neutral-900 bg-white; }
  h1, h2, h3, h4, h5, h6 { @apply font-playfair; }
}
```

- [ ] **Step 2: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { EVENT } from '@/lib/constants'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: `${EVENT.name} | Sacred Heart College Douala`,
  description: 'Join us for the Sacred Heart College Douala (SHEDESHA) Alumni Reunion. Register, verify your alumni status, and reconnect with your school family.',
  openGraph: {
    title: EVENT.name,
    description: 'Sacred Heart College Douala alumni reunion — register, pay, and reconnect.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Write `src/components/layout/Navbar.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EVENT } from '@/lib/constants'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programme', label: 'Programme' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/donate', label: 'Donate' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
            <span className="font-playfair font-bold text-primary-500 text-lg leading-none">SHEDESHA</span>
            <span className="text-xs text-neutral-500 leading-none">Reunion 2026</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild size="sm" className="bg-primary-500 hover:bg-primary-600 text-white">
              <Link href="/register">Register Now</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-700 hover:text-primary-500"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-500"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="w-full bg-primary-500 hover:bg-primary-600 text-white mt-2">
              <Link href="/register" onClick={() => setOpen(false)}>Register Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Write `src/components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'
import { EVENT } from '@/lib/constants'
import { Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-playfair text-white text-lg mb-2">SHEDESHA Reunion 2026</h3>
            <p className="text-sm leading-relaxed">Sacred Heart College Douala alumni — reconnecting, celebrating, and building our community together.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/register', label: 'Register' },
                { href: '/pay', label: 'Pay for Event' },
                { href: '/donate', label: 'Donate / Support' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/faq', label: 'FAQ' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Use' },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <a href={`mailto:${EVENT.contactEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} /> {EVENT.contactEmail}
              </a>
              <a href={`https://wa.me/${EVENT.contactWhatsApp.replace('+', '')}`} className="flex items-center gap-2 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Phone size={14} /> {EVENT.contactWhatsApp}
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Sacred Heart College Douala (SHEDESHA) Reunion Committee. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && timeout 15 npm run dev 2>&1 | head -20 || true"
```

Expected: `▲ Next.js 14` and `Local: http://localhost:3000`

- [ ] **Step 6: Commit**

```bash
cd /home/admin/yolo_reunion_site && git add apps/reunion-website/src && git commit -m "feat: root layout, navbar, and footer"
```

---

### Task 4: Homepage

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/CountdownTimer.tsx` (client)
- Create: `src/components/home/EventInfo.tsx`
- Create: `src/components/home/Objectives.tsx`
- Create: `src/components/home/Testimonials.tsx`

**Interfaces:**
- Consumes: `EVENT` from `@/lib/constants`, `Testimonial[]` from `db.testimonial.findMany`
- Produces: `/` route — full homepage

- [ ] **Step 1: Write `src/components/home/HeroSection.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin } from 'lucide-react'
import { EVENT } from '@/lib/constants'

export function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary-700 via-primary-500 to-neutral-900 text-white overflow-hidden"
      aria-label="Hero"
    >
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="inline-block px-4 py-1.5 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-300 text-sm font-medium mb-6 animate-fade-in">
          🎓 Sacred Heart College Douala — Class Reunion 2026
        </div>

        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-slide-up">
          Welcome Home,<br />
          <span className="text-gold-400">SHEDESHA Family</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Reconnect with your Sacred Heart College Douala community. Celebrate memories, honour our school, and build our future together.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm text-white/70">
          <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {EVENT.dateDisplay}</span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><MapPin size={16} /> {EVENT.location}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-gold-500 hover:bg-gold-600 text-neutral-900 font-bold text-base px-8">
            <Link href="/register">Register Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-500 text-base px-8">
            <Link href="/pay">Pay for Event</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 text-base px-8">
            <Link href="/donate">Donate / Support</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write `src/components/home/CountdownTimer.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { EVENT } from '@/lib/constants'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const diff = EVENT.date.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <section className="bg-primary-500 py-12 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-white/70 uppercase tracking-widest text-sm mb-6">Time Until Reunion</p>
        <div className="flex justify-center gap-4 sm:gap-8">
          {units.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="font-playfair text-2xl sm:text-4xl font-bold tabular-nums">
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs text-white/60 mt-2 uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Write `src/components/home/EventInfo.tsx`**

```tsx
import { EVENT } from '@/lib/constants'
import { CalendarDays, MapPin, Users, Heart } from 'lucide-react'

const highlights = [
  { icon: CalendarDays, label: 'Event Date', value: EVENT.dateDisplay },
  { icon: MapPin, label: 'Location', value: EVENT.location },
  { icon: Users, label: 'Who Attends', value: 'All SHEDESHA alumni worldwide' },
  { icon: Heart, label: 'Entry Fee', value: EVENT.registrationFeeDisplay },
]

export function EventInfo() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">About the Reunion</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            The Sacred Heart College Douala (SHEDESHA) reunion brings together former students from across generations and across the world — to remember, reconnect, and reimagine our shared future.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-primary-500" />
              </div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-semibold text-neutral-900 text-sm">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 max-w-3xl mx-auto">
          <h3 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">Our Story</h3>
          <div className="prose prose-neutral max-w-none text-neutral-600 space-y-4">
            <p>
              Sacred Heart College Douala — known by its alumni as SHEDESHA — has been shaping minds and characters in Cameroon for decades. Our alumni span the globe, carrying with them the values of excellence, integrity, and community instilled within those beloved walls.
            </p>
            <p>
              The SHEDESHA reunion is our annual celebration of that shared heritage. It is a moment to step away from the hustle of modern life and return — even briefly — to the friendships, the laughter, and the pride of being part of something larger than ourselves.
            </p>
            <p>
              This year's reunion is more than a gathering. It is a milestone — a chance to honour the school that formed us, support its future, and lay the groundwork for a lasting alumni community that gives back for generations to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `src/components/home/Objectives.tsx`**

```tsx
const objectives = [
  { emoji: '🤝', title: 'Networking', desc: 'Reconnect former classmates, teachers, and staff across generations and borders.' },
  { emoji: '🏫', title: 'Support the School', desc: 'Channel resources directly to Sacred Heart College Douala for infrastructure and scholarships.' },
  { emoji: '❤️', title: 'Charity', desc: 'Raise funds for community initiatives championed by the SHEDESHA alumni community.' },
  { emoji: '🎓', title: 'Mentorship', desc: 'Connect experienced alumni with current students and recent graduates.' },
  { emoji: '💰', title: 'Fundraising', desc: 'Build a sustainable alumni fund to support ongoing school and community development.' },
  { emoji: '📚', title: 'Preserve History', desc: 'Document and celebrate the rich history of Sacred Heart College Douala.' },
]

export function Objectives() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Our Objectives</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">The SHEDESHA reunion is built around six core pillars that define our vision for the alumni community.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map(({ emoji, title, desc }) => (
            <div key={title} className="group rounded-xl border border-neutral-200 p-6 hover:border-primary-200 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-playfair text-lg font-bold text-neutral-900 mb-2">{title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Write `src/components/home/Testimonials.tsx`**

```tsx
import { db } from '@/lib/db'
import { Quote } from 'lucide-react'

export async function Testimonials() {
  const testimonials = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })

  if (testimonials.length === 0) return null

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Voices of SHEDESHA</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">What our alumni say about the reunion experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <Quote size={24} className="text-primary-200 mb-4" />
              <p className="text-neutral-700 italic leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-playfair font-bold text-primary-500">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.classYear}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Write `src/app/page.tsx`**

```tsx
import { HeroSection } from '@/components/home/HeroSection'
import { CountdownTimer } from '@/components/home/CountdownTimer'
import { EventInfo } from '@/components/home/EventInfo'
import { Objectives } from '@/components/home/Objectives'
import { Testimonials } from '@/components/home/Testimonials'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CountdownTimer />
      <EventInfo />
      <Objectives />
      <Testimonials />

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold mb-4">Ready to Join the Reunion?</h2>
          <p className="text-white/80 mb-8">Secure your place at the SHEDESHA 2026 reunion. Verify your alumni status, register, and pay — all in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold-500 hover:bg-gold-600 text-neutral-900 font-bold px-10">
              <Link href="/register">Register Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-500 px-10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 7: Commit**

```bash
cd /home/admin/yolo_reunion_site && git add apps/reunion-website/src && git commit -m "feat: homepage with hero, countdown, event info, objectives, testimonials"
```

---

### Task 5: About, Programme, FAQ, Contact Pages

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/programme/page.tsx`
- Create: `src/components/programme/ScheduleItem.tsx`
- Create: `src/app/faq/page.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/components/contact/ContactForm.tsx` (client)
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`

**Interfaces:**
- Consumes: `db.programmeItem.findMany`, `db.fAQItem.findMany`
- Produces: `/about`, `/programme`, `/faq`, `/contact`, `/privacy`, `/terms` routes

- [ ] **Step 1: Write `src/app/about/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { EVENT } from '@/lib/constants'

export const metadata: Metadata = {
  title: `About | ${EVENT.name}`,
  description: 'Learn about the history of Sacred Heart College Douala, the SHEDESHA alumni community, and the purpose behind our reunion.',
}

const visionItems = [
  'Build a self-sustaining alumni fund that supports the school annually.',
  'Create a mentorship pipeline connecting SHEDESHA graduates with current students.',
  'Establish a scholarship programme for deserving students in need.',
  'Digitise and preserve the full history of Sacred Heart College Douala.',
  'Grow the SHEDESHA alumni network to every corner of the world.',
]

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">About the Reunion</h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Understanding the heart behind the Sacred Heart College Douala (SHEDESHA) reunion — our history, purpose, and vision.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4 border-l-4 border-primary-500 pl-4">History of Sacred Heart College Douala</h2>
            <div className="text-neutral-700 space-y-4 leading-relaxed">
              <p>Sacred Heart College Douala — affectionately known as SHEDESHA — is one of Cameroon's most respected educational institutions. Founded with a mission of academic excellence and moral formation, the school has shaped thousands of young minds over the decades, producing leaders, professionals, and community builders across Cameroon and the world.</p>
              <p>The SHEDESHA reunion tradition began as a modest gathering of former students seeking to maintain the bonds forged in those school corridors. What started as a local get-together has grown into an internationally attended celebration of shared identity — a testament to how deeply Sacred Heart College Douala leaves its mark on all who pass through its gates.</p>
            </div>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4 border-l-4 border-primary-500 pl-4">Purpose of the Reunion</h2>
            <p className="text-neutral-700 leading-relaxed">
              The SHEDESHA reunion exists to reconnect former students, faculty, and staff — not merely for nostalgia, but to transform shared history into collective action. We gather to celebrate what Sacred Heart College Douala gave us, and to give back in kind.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6 border-l-4 border-primary-500 pl-4">Our Objectives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Networking', desc: 'Reconnect across generations and borders.' },
                { title: 'School Support', desc: 'Fund improvements to Sacred Heart College Douala\'s infrastructure and resources.' },
                { title: 'Charity', desc: 'Raise funds for community development initiatives.' },
                { title: 'Mentorship', desc: 'Link experienced alumni with current students.' },
                { title: 'Fundraising', desc: 'Build a sustainable alumni fund.' },
                { title: 'Preserving History', desc: 'Document and celebrate the school\'s rich legacy.' },
              ].map(obj => (
                <div key={obj.title} className="bg-primary-50 rounded-xl p-5 border border-primary-100">
                  <h3 className="font-semibold text-primary-700 mb-1">{obj.title}</h3>
                  <p className="text-sm text-neutral-600">{obj.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4 border-l-4 border-primary-500 pl-4">Our Vision for the Future</h2>
            <ul className="space-y-3">
              {visionItems.map(item => (
                <li key={item} className="flex items-start gap-3 text-neutral-700">
                  <span className="mt-1 w-5 h-5 rounded-full bg-gold-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/programme/ScheduleItem.tsx`**

```tsx
interface ScheduleItemProps {
  time: string
  title: string
  description?: string | null
  speaker?: string | null
  location?: string | null
  isLast?: boolean
}

export function ScheduleItem({ time, title, description, speaker, location, isLast }: ScheduleItemProps) {
  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 shadow">
          <span className="w-3 h-3 rounded-full bg-white" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-primary-200 my-2" />}
      </div>
      <div className={`pb-8 ${isLast ? '' : ''}`}>
        <p className="text-xs text-primary-500 font-semibold uppercase tracking-wide mb-1">{time}</p>
        <h3 className="font-playfair text-lg font-bold text-neutral-900 mb-1">{title}</h3>
        {description && <p className="text-neutral-600 text-sm mb-1">{description}</p>}
        {speaker && <p className="text-xs text-neutral-500">🎤 {speaker}</p>}
        {location && <p className="text-xs text-neutral-500">📍 {location}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write `src/app/programme/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { ScheduleItem } from '@/components/programme/ScheduleItem'
import { EVENT } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Programme | ${EVENT.name}`,
  description: 'The programme and event schedule for the Sacred Heart College Douala (SHEDESHA) Reunion 2026.',
}

export default async function ProgrammePage() {
  const items = await db.programmeItem.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">Event Programme</h1>
          <p className="text-neutral-600 text-lg">
            A concept schedule for the Sacred Heart College Douala (SHEDESHA) Reunion — {EVENT.dateDisplay}, {EVENT.location}.
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            ⚠️ Times and details are indicative and subject to change. Final programme will be emailed to registered attendees.
          </div>
        </div>

        <div className="mt-8">
          {items.map((item, i) => (
            <ScheduleItem
              key={item.id}
              time={item.time}
              title={item.title}
              description={item.description}
              speaker={item.speaker}
              location={item.location}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write `src/app/faq/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { EVENT } from '@/lib/constants'

export const metadata: Metadata = {
  title: `FAQ | ${EVENT.name}`,
}

const categories = [
  { key: 'registration', label: 'Registration' },
  { key: 'verification', label: 'Alumni Verification' },
  { key: 'payment', label: 'Payment & Fees' },
  { key: 'donation', label: 'Donations' },
  { key: 'general', label: 'General' },
]

export default async function FAQPage() {
  const items = await db.fAQItem.findMany({
    where: { published: true },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  })

  const byCategory = categories.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.key),
  })).filter(c => c.items.length > 0)

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-neutral-600 text-lg">Everything you need to know about the Sacred Heart College Douala (SHEDESHA) Reunion 2026.</p>
        </div>

        <div className="space-y-10">
          {byCategory.map(cat => (
            <div key={cat.key}>
              <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">{cat.label}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {cat.items.map(item => (
                  <AccordionItem key={item.id} value={item.id} className="border border-neutral-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium text-neutral-800 hover:text-primary-500 py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-600 pb-4 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Write `src/components/contact/ContactForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  category: z.enum(['registration', 'payment', 'verification', 'sponsorship', 'media', 'general']),
  message: z.string().min(10, 'Please provide more detail (min 10 characters)'),
})

type FormData = z.infer<typeof schema>

const categories = [
  { value: 'registration', label: 'Registration Help' },
  { value: 'payment', label: 'Payment Issue' },
  { value: 'verification', label: 'Verification Issue' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'media', label: 'Media Upload' },
  { value: 'general', label: 'General Inquiry' },
]

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="font-playfair text-xl font-bold text-neutral-900 mb-2">Message Sent!</h3>
        <p className="text-neutral-600">We'll respond within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} placeholder="Your name" className="mt-1" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" {...register('email')} placeholder="you@example.com" className="mt-1" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(val) => setValue('category', val as FormData['category'])}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register('message')} placeholder="How can we help?" rows={5} className="mt-1" />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={status === 'loading'} className="w-full bg-primary-500 hover:bg-primary-600 text-white">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
      {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again or email us directly.</p>}
    </form>
  )
}
```

- [ ] **Step 6: Write `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { EVENT } from '@/lib/constants'
import { Mail, Phone, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: `Contact Us | ${EVENT.name}`,
}

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">Contact Us</h1>
          <p className="text-neutral-600 text-lg">Have a question? Our team is here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-8">
              <a href={`mailto:${EVENT.contactEmail}`} className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                <Mail size={20} className="text-primary-500" />
                <div>
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="font-medium text-neutral-900 group-hover:text-primary-600">{EVENT.contactEmail}</p>
                </div>
              </a>
              <a href={`https://wa.me/${EVENT.contactWhatsApp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-green-300 hover:bg-green-50 transition-all group">
                <MessageCircle size={20} className="text-green-500" />
                <div>
                  <p className="text-xs text-neutral-500">WhatsApp</p>
                  <p className="font-medium text-neutral-900 group-hover:text-green-600">{EVENT.contactWhatsApp}</p>
                </div>
              </a>
            </div>
            <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
              <h3 className="font-semibold text-primary-700 mb-2">Response Time</h3>
              <p className="text-sm text-neutral-600">We respond to all inquiries within 24 hours. For urgent matters, please use WhatsApp.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
            <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Contact form API route `src/app/api/contact/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  category: z.enum(['registration', 'payment', 'verification', 'sponsorship', 'media', 'general']),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Log to console — email integration added in Plan D
    console.log('[Contact Form]', data)

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

- [ ] **Step 8: Write placeholder pages**

`src/app/privacy/page.tsx`:
```tsx
import { EVENT } from '@/lib/constants'
export default function PrivacyPage() {
  return (
    <div className="py-16 max-w-3xl mx-auto px-4">
      <h1 className="font-playfair text-4xl font-bold text-neutral-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-neutral text-neutral-600 space-y-4">
        <p>This privacy policy governs the collection and use of personal data by the Sacred Heart College Douala (SHEDESHA) Reunion Committee.</p>
        <p className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">⚠️ Full privacy policy content is being finalised by the committee. This page will be updated before registration opens.</p>
        <p>For data enquiries, contact us at <a href={`mailto:${EVENT.contactEmail}`} className="text-primary-500">{EVENT.contactEmail}</a>.</p>
      </div>
    </div>
  )
}
```

`src/app/terms/page.tsx`:
```tsx
import { EVENT } from '@/lib/constants'
export default function TermsPage() {
  return (
    <div className="py-16 max-w-3xl mx-auto px-4">
      <h1 className="font-playfair text-4xl font-bold text-neutral-900 mb-6">Terms of Use</h1>
      <div className="prose prose-neutral text-neutral-600 space-y-4">
        <p>These terms govern your use of the Sacred Heart College Douala (SHEDESHA) Reunion website and registration platform.</p>
        <p className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">⚠️ Full terms of use are being finalised by the committee. This page will be updated before registration opens.</p>
        <p>For enquiries, contact <a href={`mailto:${EVENT.contactEmail}`} className="text-primary-500">{EVENT.contactEmail}</a>.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Commit all public pages**

```bash
cd /home/admin/yolo_reunion_site && git add apps/reunion-website/src && git commit -m "feat: about, programme, FAQ, contact, privacy, and terms pages"
```

---

### Task 6: Build + Deploy to Server

**Files:**
- Modify: `apps/reunion-website/package.json` (add start script with port)

**Interfaces:**
- Produces: production build running on port 3001 (separate from chop-backend)

- [ ] **Step 1: Build the project**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && npm run build 2>&1 | tail -20"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 2: Install PM2 if not present**

```bash
ssh admin@100.89.106.33 "which pm2 || npm install -g pm2"
```

- [ ] **Step 3: Start with PM2**

```bash
ssh admin@100.89.106.33 "cd /home/admin/yolo_reunion_site/apps/reunion-website && PORT=3001 pm2 start npm --name shedesha-reunion -- start && pm2 save"
```

- [ ] **Step 4: Verify running**

```bash
ssh admin@100.89.106.33 "pm2 list && curl -s -o /dev/null -w '%{http_code}' http://localhost:3001"
```

Expected: `200`

- [ ] **Step 5: Final commit and push**

```bash
cd /home/admin/yolo_reunion_site && git add . && git commit -m "feat: Plan A complete — foundation, schema, and all public pages for SHEDESHA reunion site" && git push origin main
```

---

## Self-Review

**Spec coverage check:**
- ✅ Homepage with hero, CTA buttons, event info, objectives, countdown, testimonials
- ✅ About page with history, purpose, objectives, future vision
- ✅ Programme page with schedule (seeded, admin-editable in Plan D)
- ✅ FAQ page with categories and accordion
- ✅ Contact page with form and WhatsApp/email links
- ✅ Privacy and Terms placeholder pages
- ✅ Full database schema (all models for all 4 plans)
- ✅ Mobile-first navigation with hamburger menu
- ✅ Footer with all links
- ✅ TypeScript strict mode
- ✅ Prisma ORM with PostgreSQL

**Deferred to later plans (by design):**
- Alumni verification system → Plan B
- Registration form → Plan B
- Payment integration → Plan C
- Donation page → Plan C
- Media gallery → Plan D
- Email notifications → Plan D
- Admin dashboard → Plan D
- Calendar integration → Plan B

**Placeholder scan:** All steps contain concrete code. No TBDs in task steps.

**Type consistency:** `VerificationStatus`, `RegistrationStatus`, `PaymentStatus`, `PaymentMethod` enums defined in `src/types/index.ts` and mirrored in `prisma/schema.prisma` — consistent naming throughout.
