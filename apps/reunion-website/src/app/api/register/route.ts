import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendRegistrationConfirmation, notifyAdminNewRegistration } from '@/lib/email'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  country: z.string().min(2),
  classYear: z.string().min(2),
  guestCount: z.coerce.number().int().min(0).max(5).default(0),
  guestNames: z.array(z.string().min(1)).max(5).optional(),
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

function generateGuestId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'SHEDESA-G-'
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

    // Generate one guest pass ID per guest name
    const guestIds = (body.guestNames ?? []).map(() => generateGuestId())
    const guestDetails =
      body.guestNames && body.guestNames.length > 0
        ? {
            names: body.guestNames,
            ids: guestIds,
          }
        : undefined

    const status = body.alumniRecordId ? 'VERIFIED' : 'PENDING_VERIFICATION'

    const registration = await db.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          registrationId,
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          country: body.country,
          classYear: body.classYear,
          guestCount: body.guestCount,
          guestDetails: guestDetails ?? undefined,
          dietaryPrefs: body.dietaryPrefs,
          accessibilityNeeds: body.accessibilityNeeds,
          consentUpdates: body.consentUpdates,
          agreedToTerms: body.agreedToTerms,
          alumniRecordId: body.alumniRecordId,
          status,
          paymentStatus: 'PENDING',
        },
      })

      if (body.alumniRecordId) {
        await tx.alumniRecord.update({
          where: { id: body.alumniRecordId },
          data: {
            email: body.email,
            phone: body.phone,
            country: body.country,
            verificationStatus: 'VERIFIED',
          },
        })
      }

      return reg
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shedesareunion.com'

    const guests = (body.guestNames ?? []).map((name, i) => ({ name, id: guestIds[i] }))

    sendRegistrationConfirmation({
      to: registration.email,
      fullName: registration.fullName,
      registrationId: registration.registrationId,
      classYear: registration.classYear,
      guests,
    }).catch((err) => console.error('[Email] Failed to send confirmation:', err))

    notifyAdminNewRegistration({
      fullName: registration.fullName,
      email: registration.email,
      phone: registration.phone,
      country: registration.country,
      classYear: registration.classYear,
      guestCount: registration.guestCount,
      registrationId: registration.registrationId,
      adminUrl: `${appUrl}/admin/registrations/${registration.id}`,
    }).catch((err) => console.error('[Email] Failed to send admin notification:', err))

    return NextResponse.json({
      registrationId: registration.registrationId,
      status: registration.status,
      guests,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
