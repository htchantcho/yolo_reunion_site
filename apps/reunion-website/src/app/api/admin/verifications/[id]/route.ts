import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { sendRegistrationConfirmation } from '@/lib/email'
import { sendPaymentInstructions } from '@/lib/email-payment'

const schema = z.object({
  action: z.enum(['approve', 'reject']),
  adminNotes: z.string().optional(),
})

function generateRegistrationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'SHEDESA-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { action, adminNotes } = schema.parse(await req.json())

    if (action === 'reject') {
      const updated = await db.verificationRequest.update({
        where: { id },
        data: { status: 'REJECTED', adminNotes: adminNotes ?? null, resolvedAt: new Date() },
      })
      return NextResponse.json({ id: updated.id, status: updated.status })
    }

    // Approve: mark verified + create alumni record + create registration
    const vr = await db.verificationRequest.findUnique({ where: { id } })
    if (!vr) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Derive a numeric year from classYear if possible
    const parsedYear = parseInt(vr.classYear)
    const yearAdmission = !isNaN(parsedYear) ? parsedYear - 7 : new Date().getFullYear() - 7

    let registrationId = generateRegistrationId()
    let attempts = 0
    while (attempts < 5) {
      const exists = await db.registration.findUnique({ where: { registrationId } })
      if (!exists) break
      registrationId = generateRegistrationId()
      attempts++
    }

    const { alumniRecord, registration } = await db.$transaction(async (tx) => {
      await tx.verificationRequest.update({
        where: { id },
        data: { status: 'VERIFIED', adminNotes: adminNotes ?? null, resolvedAt: new Date() },
      })

      const alumniRecord = await tx.alumniRecord.create({
        data: {
          fullName: vr.fullName,
          email: vr.email,
          phone: vr.phone,
          batch: vr.classYear,
          yearAdmission,
          verificationStatus: 'VERIFIED',
          adminNotes: adminNotes ?? null,
        },
      })

      const registration = await tx.registration.create({
        data: {
          registrationId,
          fullName: vr.fullName,
          email: vr.email,
          phone: vr.phone,
          country: 'Unknown',
          classYear: vr.classYear,
          alumniRecordId: alumniRecord.id,
          status: 'VERIFIED',
          paymentStatus: 'PENDING',
          consentUpdates: false,
          agreedToTerms: true,
        },
      })

      return { alumniRecord, registration }
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shedesareunion.com'

    sendRegistrationConfirmation({
      to: registration.email,
      fullName: registration.fullName,
      registrationId: registration.registrationId,
      classYear: registration.classYear,
      guests: [],
    }).catch(err => console.error('[Email] Confirmation failed:', err))

    sendPaymentInstructions({
      to: registration.email,
      fullName: registration.fullName,
      registrationId: registration.registrationId,
    }).catch(err => console.error('[Email] Payment instructions failed:', err))

    console.log(`[Verification Approved] ${vr.fullName} → alumni ${alumniRecord.id}, reg ${registrationId}`)

    return NextResponse.json({ id, status: 'VERIFIED', registrationId })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.flatten() }, { status: 400 })
    console.error('[Verification] Approve error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
