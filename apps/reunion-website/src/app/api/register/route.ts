import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendRegistrationConfirmation } from '@/lib/email'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  country: z.string().min(2),
  classYear: z.string().min(2),
  guestCount: z.coerce.number().int().min(0).max(5).default(0),
  dietaryPrefs: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  consentUpdates: z.boolean(),
  agreedToTerms: z.literal(true, { message: 'You must agree to the terms' }),
  alumniRecordId: z.string().optional(),
})

function generateRegistrationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'SHEDESA-'
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    const duplicate = await db.registration.findFirst({
      where: { OR: [{ email: body.email }, { phone: body.phone }] },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: 'A registration already exists for this email or phone number. Contact yoloreunion@gmail.com if you need to make changes.' },
        { status: 409 }
      )
    }

    let registrationId = generateRegistrationId()
    let attempts = 0
    while (attempts < 5) {
      const exists = await db.registration.findUnique({ where: { registrationId } })
      if (!exists) break
      registrationId = generateRegistrationId()
      attempts++
    }

    const status = body.alumniRecordId ? 'VERIFIED' : 'PENDING_VERIFICATION'

    const registration = await db.registration.create({
      data: {
        registrationId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        country: body.country,
        classYear: body.classYear,
        guestCount: body.guestCount,
        dietaryPrefs: body.dietaryPrefs,
        accessibilityNeeds: body.accessibilityNeeds,
        consentUpdates: body.consentUpdates,
        agreedToTerms: body.agreedToTerms,
        alumniRecordId: body.alumniRecordId,
        status,
        paymentStatus: 'PENDING',
      },
    })

    sendRegistrationConfirmation({
      to: registration.email,
      fullName: registration.fullName,
      registrationId: registration.registrationId,
      classYear: registration.classYear,
    }).catch((err) => console.error('[Email] Failed to send confirmation:', err))

    return NextResponse.json({
      registrationId: registration.registrationId,
      status: registration.status,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
