import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

const schema = z.object({
  fullName:      z.string().trim().min(1).optional(),
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
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const body = parsed.data

  const record = await db.alumniRecord.findUnique({ where: { id } })
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const { updated, synced } = await db.$transaction(async (tx) => {
      const updated = await tx.alumniRecord.update({ where: { id }, data: body })

      // Registrations keep their own copy of the registrant's details (used on the
      // admin pages and in every email). Push the values this edit changed to the
      // linked registrations, so a correction here is reflected everywhere. Only
      // changed fields are copied, so fixing a name doesn't overwrite contact
      // details the registrant entered. Registration email/phone/country/classYear
      // are required, so empty values are never copied.
      const oldClass = record.yearGraduation ? String(record.yearGraduation) : record.batch?.trim()
      const newClass = updated.yearGraduation ? String(updated.yearGraduation) : updated.batch?.trim()
      const changed = <T,>(before: T, after: T) => after && after !== before ? after : undefined
      const regData = Object.fromEntries(Object.entries({
        fullName: changed(record.fullName, updated.fullName),
        email:    changed(record.email, updated.email),
        phone:    changed(record.phone, updated.phone),
        country:  changed(record.country, updated.country),
        classYear: changed(oldClass, newClass),
      }).filter(([, v]) => v)) as Record<string, string>

      if (Object.keys(regData).length === 0) return { updated, synced: 0 }
      const { count } = await tx.registration.updateMany({ where: { alumniRecordId: id }, data: regData })
      return { updated, synced: count }
    })

    return NextResponse.json({ success: true, record: updated, registrationsUpdated: synced })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const field = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'email or phone'
      return NextResponse.json({ error: `Another alumni record already uses this ${field}` }, { status: 409 })
    }
    throw err
  }
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
