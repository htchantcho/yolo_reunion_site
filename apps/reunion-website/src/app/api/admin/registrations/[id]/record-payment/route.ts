import { NextRequest, NextResponse } from 'next/server'
import { sendPaymentConfirmed } from '@/lib/email'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  method: z.enum(['MTN_MOMO', 'ORANGE_MONEY', 'CARD', 'PAYPAL', 'BANK_TRANSFER']),
  amount: z.coerce.number().int().positive(),
  currency: z.enum(['XAF', 'EUR', 'USD', 'NGN']),
  providerRef: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = schema.parse(await req.json())

  const registration = await db.registration.findUnique({ where: { id } })
  if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (registration.paymentStatus === 'PAID') {
    return NextResponse.json({ error: 'Already marked as paid' }, { status: 409 })
  }

  await db.$transaction([
    db.payment.create({
      data: {
        registrationId: id,
        amount: body.amount,
        currency: body.currency,
        method: body.method,
        status: 'PAID',
        providerRef: body.providerRef ?? null,
        providerData: body.notes ? { notes: body.notes } : undefined,
      },
    }),
    db.registration.update({
      where: { id },
      data: { paymentStatus: 'PAID', status: 'PAID' },
    }),
  ])

  // Format amount for display (EUR/USD/NGN stored in cents, XAF is whole units)
  const divisor = body.currency === 'XAF' ? 1 : 100
  const displayAmount = new Intl.NumberFormat('en').format(body.amount / divisor)

  sendPaymentConfirmed({
    to: registration.email,
    fullName: registration.fullName,
    registrationId: registration.registrationId,
    amount: displayAmount,
    currency: body.currency,
  }).catch(err => console.error('[Email] Failed to send payment confirmation:', err))

  console.log(`[Admin] Manual payment recorded for ${registration.registrationId} by ${session.name}`)
  return NextResponse.json({ ok: true })
}
