import { db } from '@/lib/db'
import Link from 'next/link'
import { TRADE_FAIR } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#B7960C',
  CONFIRMED: '#16a34a',
  CANCELLED: '#dc2626',
}

const PAY_COLORS: Record<string, string> = {
  PENDING: '#9ca3af',
  PAID: '#16a34a',
}

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const params = await searchParams
  const q = params.q?.trim()
  const status = params.status

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(q ? {
      OR: [
        { fullName: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
        { businessName: { contains: q, mode: 'insensitive' as const } },
        { vendorId: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const [vendors, total, taken] = await Promise.all([
    db.vendor.findMany({ where, orderBy: { createdAt: 'desc' } }),
    db.vendor.count({ where }),
    db.vendor.count({ where: { status: { not: 'CANCELLED' } } }),
  ])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Vendors</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{taken}/{TRADE_FAIR.spotLimit} spots taken</span>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{total} total</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#e5e7eb', borderRadius: 8, height: 8, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: taken >= TRADE_FAIR.spotLimit ? '#dc2626' : '#2D6A4F', width: (taken / TRADE_FAIR.spotLimit * 100) + '%', height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input name="q" defaultValue={q} placeholder="Search name, email, business, ID…"
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: 260 }} />
        <select name="status" defaultValue={status ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin/vendors" style={{ padding: '8px 12px', color: '#6b7280', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            Clear
          </Link>
        )}
      </form>

      <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Vendor ID', 'Name', 'Business', 'Country', 'Status', 'Payment', 'Registered', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>No vendors found.</td></tr>
            )}
            {vendors.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#2D6A4F', fontWeight: 600 }}>{v.vendorId}</td>
                <td style={{ padding: '10px 14px', color: '#111827' }}>{v.fullName}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{v.businessName}</td>
                <td style={{ padding: '10px 14px', color: '#6b7280' }}>{v.country}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: STATUS_COLORS[v.status] + '20', color: STATUS_COLORS[v.status], padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11 }}>
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: PAY_COLORS[v.paymentStatus] + '20', color: PAY_COLORS[v.paymentStatus], padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11 }}>
                    {v.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                  {new Date(v.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <Link href={'/admin/vendors/' + v.id} style={{ color: '#2D6A4F', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
