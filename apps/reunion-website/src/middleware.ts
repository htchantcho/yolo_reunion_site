import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

function secret() {
  return new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'dev-secret-min-32-chars-long!!')
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.next()

  const token = req.cookies.get('shedesa-admin-token')?.value
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))

  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = { matcher: ['/admin/:path*'] }
