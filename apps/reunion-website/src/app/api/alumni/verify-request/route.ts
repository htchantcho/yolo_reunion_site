import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  classYear: z.string().min(2),
  details: z.string().min(20, 'Please provide more details about your time at Sacred Heart College Douala (SHEDESA) — at least 20 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    const existing = await db.verificationRequest.findFirst({
      where: { email: body.email, status: { in: ['MANUAL_REVIEW', 'PENDING'] } },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A verification request for this email is already under review. We will contact you within 48 hours.' },
        { status: 409 }
      )
    }

    const request = await db.verificationRequest.create({
      data: { ...body },
    })

    console.log('[Verification Request]', request.id, body.email)

    return NextResponse.json({
      id: request.id,
      message: 'Verification request submitted. Our team will review and contact you within 48 hours.',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
