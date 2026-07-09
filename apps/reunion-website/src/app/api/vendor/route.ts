import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { sendVendorConfirmation } from '@/lib/email-vendor'

const SPOT_LIMIT = 10

const schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  businessName: z.string().min(2).max(150),
  businessType: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  country: z.string().min(2).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data

    const taken = await db.vendor.count({ where: { status: { not: 'CANCELLED' } } })
    if (taken >= SPOT_LIMIT) {
      return NextResponse.json({ error: 'Sorry, all vendor spots are taken. Please contact us to join the waitlist.' }, { status: 409 })
    }

    const existing = await db.vendor.findFirst({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'This email address has already been registered as a vendor.' }, { status: 409 })
    }

    const vendorId = `VENDOR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const vendor = await db.vendor.create({
      data: {
        vendorId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        businessType: data.businessType ?? null,
        description: data.description ?? null,
        country: data.country,
      },
    })

    sendVendorConfirmation({
      to: data.email,
      fullName: data.fullName,
      vendorId: vendor.vendorId,
      businessName: data.businessName,
    }).catch(console.error)

    return NextResponse.json({ vendorId: vendor.vendorId }, { status: 201 })
  } catch (err) {
    console.error('[vendor POST]', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  const taken = await db.vendor.count({ where: { status: { not: 'CANCELLED' } } })
  return NextResponse.json({ taken, limit: SPOT_LIMIT, available: Math.max(0, SPOT_LIMIT - taken) })
}
