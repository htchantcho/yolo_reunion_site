import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  day:         z.coerce.number().int().min(1).max(2),
  time:        z.string().min(1),
  title:       z.string().min(1),
  description: z.string().optional().nullable(),
  speaker:     z.string().optional().nullable(),
  location:    z.string().optional().nullable(),
  order:       z.coerce.number().int().default(0),
})

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await db.programmeItem.findMany({ orderBy: [{ day: 'asc' }, { order: 'asc' }, { time: 'asc' }] })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = schema.parse(await req.json())
  const item = await db.programmeItem.create({ data: body })
  return NextResponse.json(item)
}
