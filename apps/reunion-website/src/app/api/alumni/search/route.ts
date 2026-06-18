import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  name: z.string().min(2, 'Enter at least 2 characters'),
  year: z.coerce.number().int().min(1950).max(2025).optional(),
  batch: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    const results = await db.alumniRecord.findMany({
      where: {
        AND: [
          {
            OR: [
              { fullName: { contains: body.name, mode: 'insensitive' } },
              { formerName: { contains: body.name, mode: 'insensitive' } },
            ],
          },
          body.year ? { yearGraduation: body.year } : {},
          body.batch ? { batch: { contains: body.batch, mode: 'insensitive' } } : {},
        ],
      },
      select: {
        id: true,
        fullName: true,
        formerName: true,
        yearAdmission: true,
        yearGraduation: true,
        className: true,
        batch: true,
        house: true,
        country: true,
        verificationStatus: true,
      },
      take: 10,
      orderBy: { fullName: 'asc' },
    })

    return NextResponse.json({ results })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
