import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'

const schema = z.object({
  action: z.enum(['approve', 'reject']),
  adminNotes: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { action, adminNotes } = schema.parse(await req.json())
    const updated = await db.verificationRequest.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'VERIFIED' : 'REJECTED',
        adminNotes: adminNotes ?? null,
        resolvedAt: new Date(),
      },
    })
    return NextResponse.json({ id: updated.id, status: updated.status })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.flatten() }, { status: 400 })
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
