import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Blank optional inputs arrive as '' from the form — treat them as absent.
const optionalText = z.preprocess(
  v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().trim().max(500).optional(),
)

const schema = z
  .object({
    donorName: optionalText,
    donorEmail: z.preprocess(
      v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().trim().email().optional(),
    ),
    amount: z.coerce.number().int().positive(),
    currency: z.enum(['XAF', 'EUR', 'USD', 'NGN']),
    type: z.enum(['SPONSORSHIP', 'CHARITY', 'SCHOOL_SUPPORT', 'ALUMNI_PROJECT', 'CUSTOM']),
    method: z.enum(['MTN_MOMO', 'ORANGE_MONEY', 'CARD', 'PAYPAL', 'BANK_TRANSFER']),
    status: z.enum(['PAID', 'PENDING']).default('PAID'),
    providerRef: optionalText,
    message: z.preprocess(
      v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().trim().max(2000).optional(),
    ),
    anonymous: z.boolean().default(false),
  })
  .refine(d => d.anonymous || !!d.donorName, {
    message: 'Donor name is required unless the contribution is anonymous',
    path: ['donorName'],
  })

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? 'Invalid input' }, { status: 400 })
  }
  const body = parsed.data

  const donation = await db.donation.create({
    data: {
      donorName: body.donorName ?? null,
      donorEmail: body.donorEmail ?? null,
      amount: body.amount,
      currency: body.currency,
      type: body.type,
      method: body.method,
      status: body.status,
      providerRef: body.providerRef ?? null,
      message: body.message ?? null,
      anonymous: body.anonymous,
    },
  })

  console.log(
    `[Admin] Contribution logged: ${body.type} ${body.amount} ${body.currency} by ${session.name}`,
  )
  return NextResponse.json({ ok: true, id: donation.id })
}
