import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const regId = req.nextUrl.searchParams.get('regId')
  if (!regId) return NextResponse.json({ error: 'regId required' }, { status: 400 })

  const registration = await db.registration.findUnique({
    where: { registrationId: regId },
    select: { guestCount: true, paymentStatus: true },
  })

  if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    guestCount: registration.guestCount,
    paymentStatus: registration.paymentStatus,
  })
}
