import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  fullName:      z.string().min(1).optional(),
  formerName:    z.string().optional().nullable(),
  yearAdmission: z.coerce.number().int().optional(),
  yearGraduation:z.coerce.number().int().optional().nullable(),
  className:     z.string().optional().nullable(),
  batch:         z.string().optional().nullable(),
  house:         z.string().optional().nullable(),
  phone:         z.string().optional().nullable(),
  email:         z.string().email().optional().nullable(),
  country:       z.string().optional().nullable(),
  city:          z.string().optional().nullable(),
  occupation:    z.string().optional().nullable(),
  adminNotes:    z.string().optional().nullable(),
})

async function verifyAdmin(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('shedesa-admin-token')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'fallback-secret')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = schema.parse(await req.json())

  const record = await db.alumniRecord.findUnique({ where: { id } })
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await db.alumniRecord.update({
    where: { id },
    data: body,
  })

  return NextResponse.json({ success: true, record: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const record = await db.alumniRecord.findUnique({ where: { id } })
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.alumniRecord.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
