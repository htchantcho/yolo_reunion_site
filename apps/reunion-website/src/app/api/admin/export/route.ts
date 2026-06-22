import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status') ?? undefined

  const registrations = await db.registration.findMany({
    where: status ? { status: status as never } : undefined,
    include: { payments: { where: { status: 'PAID' }, take: 1, orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'asc' },
  })

  const headers = [
    'Registration ID', 'Full Name', 'Email', 'Phone', 'Country',
    'Class Year', 'Guests', 'Status', 'Payment Status',
    'Payment Method', 'Amount Paid', 'Currency', 'Registered At',
  ]

  function esc(v: string | null | undefined) {
    if (v == null) return ''
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  const rows = registrations.map(r => {
    const payment = r.payments[0]
    const divisor = payment?.currency === 'XAF' ? 1 : 100
    return [
      r.registrationId, r.fullName, r.email, r.phone, r.country,
      r.classYear, String(r.guestCount), r.status, r.paymentStatus,
      payment?.method ?? '', payment ? String(payment.amount / divisor) : '', payment?.currency ?? '',
      new Date(r.createdAt).toISOString().split('T')[0],
    ].map(esc).join(',')
  })

  const csv = [headers.map(esc).join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="shedesa-registrations-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  })
}
