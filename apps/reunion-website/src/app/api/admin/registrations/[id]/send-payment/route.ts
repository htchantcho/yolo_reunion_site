import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { sendPaymentInstructions } from '@/lib/email-payment'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const reg = await db.registration.findUnique({ where: { id } })
    if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await sendPaymentInstructions({
      to: reg.email,
      fullName: reg.fullName,
      registrationId: reg.registrationId,
    })
    return NextResponse.json({ sent: true })
  } catch {
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }
}
