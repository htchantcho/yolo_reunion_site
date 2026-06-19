import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export type AdminPayload = {
  adminId: string
  email: string
  name: string
  role: string
}

const COOKIE = 'shedesa-admin-token'

function secret() {
  return new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'dev-secret-min-32-chars-long!!')
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret())
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as unknown as AdminPayload
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export const SESSION_COOKIE = COOKIE
