import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'

const schema = z.object({
  status: z.enum(['PENDING_VERIFICATION', 'VERIFIED', 'PENDING_PAYMENT', 'PAID', 'CANCELLED']),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { status } = schema.parse(await req.json())
    const reg = await db.registration.update({ where: { id }, data: { status } })
    return NextResponse.json({ registrationId: reg.registrationId, status: reg.status })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.flatten() }, { status: 400 })
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
