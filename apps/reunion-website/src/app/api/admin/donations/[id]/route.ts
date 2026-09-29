import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL']),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const donation = await db.donation.findUnique({ where: { id } })
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.donation.update({ where: { id }, data: { status: parsed.data.status } })

  console.log(`[Admin] Contribution ${id} set to ${parsed.data.status} by ${session.name}`)
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
