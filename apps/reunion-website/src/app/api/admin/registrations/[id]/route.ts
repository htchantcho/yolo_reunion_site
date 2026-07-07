import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const reg = await db.registration.findUnique({ where: { id } })
  if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.$transaction([
    db.payment.deleteMany({ where: { registrationId: id } }),
    db.registration.delete({ where: { id } }),
  ])

  return NextResponse.json({ success: true })
}
