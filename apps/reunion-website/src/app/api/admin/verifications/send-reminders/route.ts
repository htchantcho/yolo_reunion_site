import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { sendVerificationApprovedReminder } from '@/lib/email'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shedesareunion.com'

  // All verified verification requests
  const verified = await db.verificationRequest.findMany({
    where: { status: 'VERIFIED' },
    select: { id: true, fullName: true, email: true, phone: true },
  })

  // All registrations — get emails and phones for cross-reference
  const registrations = await db.registration.findMany({
    select: { email: true, phone: true },
  })
  const regEmails = new Set(registrations.map(r => r.email.toLowerCase()))
  const regPhones = new Set(registrations.map(r => r.phone.replace(/\s/g, '')))

  // Only those not yet registered
  const unregistered = verified.filter(v => {
    const emailMatch = regEmails.has(v.email.toLowerCase())
    const phoneMatch = regPhones.has(v.phone.replace(/\s/g, ''))
    return !emailMatch && !phoneMatch
  })

  // Deduplicate by email (some people submitted twice)
  const seen = new Set<string>()
  const toEmail = unregistered.filter(v => {
    const key = v.email.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  let sent = 0
  const failed: string[] = []

  for (const v of toEmail) {
    try {
      await sendVerificationApprovedReminder({
        to: v.email,
        fullName: v.fullName.trim(),
        appUrl,
      })
      sent++
    } catch (err) {
      console.error(`[Reminder] Failed for ${v.email}:`, err)
      failed.push(v.email)
    }
  }

  console.log(`[Reminders] Sent ${sent} registration reminder emails, ${failed.length} failed`)

  return NextResponse.json({
    total: toEmail.length,
    sent,
    failed,
    alreadyRegistered: verified.length - unregistered.length,
  })
}
