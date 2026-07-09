import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/admin-auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, paymentStatus, adminNotes } = body

  const vendor = await db.vendor.findUnique({ where: { id } })
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await db.vendor.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  })

  return NextResponse.json({ success: true, vendor: updated })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const vendor = await db.vendor.findUnique({ where: { id } })
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.vendor.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
