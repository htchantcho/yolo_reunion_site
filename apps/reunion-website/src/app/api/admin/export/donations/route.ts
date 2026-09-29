import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const type = req.nextUrl.searchParams.get('type') ?? undefined
  const status = req.nextUrl.searchParams.get('status') ?? undefined

  const donations = await db.donation.findMany({
    where: {
      ...(type ? { type: type as never } : {}),
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { createdAt: 'asc' },
  })

  const headers = [
    'Donor', 'Email', 'Amount', 'Currency', 'Type',
    'Method', 'Status', 'Reference', 'Anonymous', 'Message', 'Date',
  ]

  function esc(v: string | null | undefined) {
    if (v == null) return ''
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  const rows = donations.map(d => {
    const divisor = d.currency === 'XAF' ? 1 : 100
    return [
      d.anonymous ? 'Anonymous' : (d.donorName ?? ''),
      d.anonymous ? '' : (d.donorEmail ?? ''),
      String(d.amount / divisor),
      d.currency,
      d.type,
      d.method,
      d.status,
      d.providerRef ?? '',
      d.anonymous ? 'Yes' : 'No',
      d.message ?? '',
      new Date(d.createdAt).toISOString().split('T')[0],
    ].map(esc).join(',')
  })

  const csv = [headers.map(esc).join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="shedesa-contributions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
