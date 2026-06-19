import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { createAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json())
    const admin = await db.adminUser.findUnique({ where: { email } })
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    await db.adminUser.update({ where: { id: admin.id }, data: { lastLogin: new Date() } })
    const token = await createAdminToken({ adminId: admin.id, email: admin.email, name: admin.name, role: admin.role })
    const res = NextResponse.json({ success: true })
    res.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    return res
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.flatten() }, { status: 400 })
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
