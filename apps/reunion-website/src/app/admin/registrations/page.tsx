import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: '#B7960C',
  VERIFIED: '#2563eb',
  PENDING_PAYMENT: '#7c3aed',
  PAID: '#16a34a',
  CANCELLED: '#dc2626',
  REFUNDED: '#6b7280',
}

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = 25
  const status = params.status as string | undefined
  const q = params.q?.trim()

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(q ? {
      OR: [
        { fullName: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
        { registrationId: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const [registrations, total] = await Promise.all([
    db.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.registration.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)
  const statuses = ['PENDING_VERIFICATION', 'VERIFIED', 'PENDING_PAYMENT', 'PAID', 'CANCELLED']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Registrations</h1>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{total} total</span>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input name="q" defaultValue={q} placeholder="Search name, email, ID…"
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: 240 }} />
        <select name="status" defaultValue={status ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin/registrations" style={{ padding: '8px 12px', color: '#6b7280', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['ID', 'Name', 'Email', 'Class Year', 'Status', 'Registered', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No registrations found.</td></tr>
            )}
            {registrations.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#2D6A4F', fontWeight: 600 }}>{r.registrationId}</td>
                <td style={{ padding: '10px 14px', color: '#111827' }}>{r.fullName}</td>
                <td style={{ padding: '10px 14px', color: '#6b7280' }}>{r.email}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{r.classYear}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: STATUS_COLORS[r.status] + '20', color: STATUS_COLORS[r.status], padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
                    {r.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <Link href={`/admin/registrations/${r.id}`} style={{ color: '#2D6A4F', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/admin/registrations?page=${p}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
              style={{ padding: '6px 12px', borderRadius: 6, fontSize: 13, textDecoration: 'none',
                background: p === page ? '#2D6A4F' : 'white', color: p === page ? 'white' : '#374151',
                border: '1px solid #e5e7eb' }}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
