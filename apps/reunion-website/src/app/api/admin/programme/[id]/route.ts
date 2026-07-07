import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  day:         z.coerce.number().int().min(1).max(2).optional(),
  time:        z.string().min(1).optional(),
  title:       z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  speaker:     z.string().optional().nullable(),
  location:    z.string().optional().nullable(),
  order:       z.coerce.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = schema.parse(await req.json())
  const item = await db.programmeItem.update({ where: { id }, data: body })
  return NextResponse.json(item)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await db.programmeItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
