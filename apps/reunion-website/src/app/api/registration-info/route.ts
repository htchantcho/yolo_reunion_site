import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const regId = req.nextUrl.searchParams.get('regId')
  const vendorId = req.nextUrl.searchParams.get('vendorId')
  if (!regId && !vendorId) {
    return NextResponse.json({ error: 'regId or vendorId required' }, { status: 400 })
  }

  if (vendorId) {
    const vendor = await db.vendor.findUnique({
      where: { vendorId },
      select: { paymentStatus: true },
    })
    if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ guestCount: 0, paymentStatus: vendor.paymentStatus })
  }

  const registration = await db.registration.findUnique({
    where: { registrationId: regId! },
    select: { guestCount: true, paymentStatus: true },
  })

  if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    guestCount: registration.guestCount,
    paymentStatus: registration.paymentStatus,
  })
}
