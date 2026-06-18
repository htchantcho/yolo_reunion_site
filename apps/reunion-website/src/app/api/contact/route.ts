import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
const schema = z.object({ name: z.string().min(2), email: z.string().email(), category: z.enum(['registration','payment','verification','sponsorship','media','general']), message: z.string().min(10) })
export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())
    console.log('[Contact Form]', data)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.flatten() }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
