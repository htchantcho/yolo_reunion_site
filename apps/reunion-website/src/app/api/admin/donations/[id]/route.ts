import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Blank optional text inputs arrive as '' from the form — store them as null.
const nullableText = (max: number) => z.preprocess(
  v => (typeof v === 'string' && v.trim() === '' ? null : v),
  z.string().trim().max(max).nullable().optional(),
)

// Every field is optional so the same endpoint serves "Mark received" (status
// only) and the full edit form.
const patchSchema = z.object({
  donorName: nullableText(500),
  donorEmail: z.preprocess(
    v => (typeof v === 'string' && v.trim() === '' ? null : v),
    z.string().trim().email().nullable().optional(),
  ),
  amount: z.coerce.number().int().positive().optional(),
  currency: z.enum(['XAF', 'EUR', 'USD', 'NGN']).optional(),
  type: z.enum(['SPONSORSHIP', 'CHARITY', 'SCHOOL_SUPPORT', 'ALUMNI_PROJECT', 'CUSTOM']).optional(),
  method: z.enum(['MTN_MOMO', 'ORANGE_MONEY', 'CARD', 'PAYPAL', 'BANK_TRANSFER']).optional(),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL']).optional(),
  providerRef: nullableText(500),
  message: nullableText(2000),
  anonymous: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const data = parsed.data

  const donation = await db.donation.findUnique({ where: { id } })
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const anonymous = data.anonymous ?? donation.anonymous
  const donorName = data.donorName !== undefined ? data.donorName : donation.donorName
  if (!anonymous && !donorName) {
    return NextResponse.json({ error: 'Donor name is required unless the contribution is anonymous' }, { status: 400 })
  }

  await db.donation.update({ where: { id }, data })

  console.log(`[Admin] Contribution ${id} updated (${Object.keys(data).join(', ')}) by ${session.name}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const donation = await db.donation.findUnique({ where: { id } })
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.donation.delete({ where: { id } })

  console.log(`[Admin] Contribution ${id} deleted by ${session.name}`)
  return NextResponse.json({ ok: true })
}
