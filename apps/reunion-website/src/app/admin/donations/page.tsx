import { db } from '@/lib/db'
import Link from 'next/link'
import DonationForm from '@/components/admin/DonationForm'
import DonationRowActions from '@/components/admin/DonationRowActions'

export const dynamic = 'force-dynamic'

const TYPE_LABEL: Record<string, string> = {
  SPONSORSHIP: 'Sponsorship',
  CHARITY: 'Charity',
  SCHOOL_SUPPORT: 'School Support',
  ALUMNI_PROJECT: 'Alumni Project',
  CUSTOM: 'Other',
}

const METHOD_LABEL: Record<string, string> = {
  MTN_MOMO: 'MTN MoMo',
  ORANGE_MONEY: 'Orange Money',
  CARD: 'Card',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Bank Transfer',
}

const STATUS_COLOR: Record<string, string> = {
  PAID: '#16a34a',
  PENDING: '#B7960C',
  FAILED: '#dc2626',
  REFUNDED: '#6b7280',
  PARTIAL: '#7c3aed',
}

const STATUS_LABEL: Record<string, string> = {
  PAID: 'Received',
  PENDING: 'Pledged',
}

const CURRENCY_DIVISOR: Record<string, number> = {
  EUR: 100, USD: 100, NGN: 100, XAF: 1,
}

function fmt(amount: number, currency: string) {
  const divisor = CURRENCY_DIVISOR[currency] ?? 1
  return new Intl.NumberFormat('en').format(amount / divisor) + ' ' + currency
}

export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; currency?: string; status?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = 30
  const { type, currency, status } = params

  const where = {
    ...(type ? { type: type as never } : {}),
    ...(currency ? { currency } : {}),
    ...(status ? { status: status as never } : {}),
  }

  const [donations, total, received, pledged] = await Promise.all([
    db.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.donation.count({ where }),
    db.donation.findMany({
      where: { status: 'PAID' },
      select: { amount: true, currency: true, type: true },
    }),
    db.donation.findMany({
      where: { status: 'PENDING' },
      select: { amount: true, currency: true },
    }),
  ])

  // Received totals per currency, and a per-type breakdown
  const receivedByCurrency: Record<string, number> = {}
  const countByType: Record<string, number> = {}
  for (const d of received) {
    receivedByCurrency[d.currency] = (receivedByCurrency[d.currency] ?? 0) + d.amount
    countByType[d.type] = (countByType[d.type] ?? 0) + 1
  }

  const pledgedByCurrency: Record<string, number> = {}
  for (const d of pledged) {
    pledgedByCurrency[d.currency] = (pledgedByCurrency[d.currency] ?? 0) + d.amount
  }

  const totalPages = Math.ceil(total / pageSize)
  const exportQuery = new URLSearchParams({
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
  }).toString()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Sponsors &amp; Donations</h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{received.length} received</span>
          <a href={`/api/admin/export/donations${exportQuery ? '?' + exportQuery : ''}`}
            style={{ padding: '7px 14px', background: '#2D6A4F', color: 'white', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            Export CSV
          </a>
        </div>
      </div>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
        Money that does not come from a registration — sponsorships, donations and pledges, logged by hand.
      </p>

      <div style={{ marginBottom: 24 }}>
        <DonationForm />
      </div>

      {/* Totals */}
      {(received.length > 0 || pledged.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
          {Object.entries(receivedByCurrency).map(([cur, amount]) => (
            <div key={cur} style={{ background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: '4px solid #16a34a' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>Received ({cur})</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{fmt(amount, cur)}</div>
            </div>
          ))}
          {Object.entries(pledgedByCurrency).map(([cur, amount]) => (
            <div key={cur} style={{ background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: '4px solid #B7960C' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>Pledged ({cur})</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#B7960C' }}>{fmt(amount, cur)}</div>
            </div>
          ))}
          {Object.entries(countByType).map(([t, count]) => (
            <div key={t} style={{ background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>{TYPE_LABEL[t] ?? t}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#374151' }}>{count}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>contribution{count > 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select name="type" defaultValue={type ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select name="status" defaultValue={status ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All statuses</option>
          <option value="PAID">Received</option>
          <option value="PENDING">Pledged</option>
        </select>
        <select name="currency" defaultValue={currency ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All currencies</option>
          {['XAF', 'EUR', 'USD', 'NGN'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Filter
        </button>
        {(type || currency || status) && (
          <Link href="/admin/donations" style={{ padding: '8px 12px', color: '#6b7280', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Clear</Link>
        )}
      </form>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Sponsor / Donor', 'Amount', 'Type', 'Method', 'Status', 'Reference', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                No contributions logged yet.
              </td></tr>
            )}
            {donations.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px', color: '#111827' }}>
                  <div style={{ fontWeight: 600 }}>{d.anonymous ? 'Anonymous' : (d.donorName ?? '—')}</div>
                  {!d.anonymous && d.donorEmail && (
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{d.donorEmail}</div>
                  )}
                  {d.message && (
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{d.message}</div>
                  )}
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#065f46', whiteSpace: 'nowrap' }}>{fmt(d.amount, d.currency)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: '#f0f8f4', color: '#2D6A4F', padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
                    {TYPE_LABEL[d.type] ?? d.type}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#6b7280', whiteSpace: 'nowrap' }}>{METHOD_LABEL[d.method] ?? d.method}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: (STATUS_COLOR[d.status] ?? '#6b7280') + '20', color: STATUS_COLOR[d.status] ?? '#6b7280', padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
                    {STATUS_LABEL[d.status] ?? d.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', fontFamily: 'monospace', fontSize: 11 }}>
                  {d.providerRef ? d.providerRef.slice(0, 24) + (d.providerRef.length > 24 ? '…' : '') : '—'}
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                  {new Date(d.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <DonationRowActions id={d.id} status={d.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          {page > 1 && (
            <Link href={`/admin/donations?${new URLSearchParams({ ...(type ? { type } : {}), ...(status ? { status } : {}), ...(currency ? { currency } : {}), page: String(page - 1) })}`}
              style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, color: '#374151', textDecoration: 'none' }}>← Prev</Link>
          )}
          <span style={{ fontSize: 13, color: '#6b7280' }}>Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/donations?${new URLSearchParams({ ...(type ? { type } : {}), ...(status ? { status } : {}), ...(currency ? { currency } : {}), page: String(page + 1) })}`}
              style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, color: '#374151', textDecoration: 'none' }}>Next →</Link>
          )}
        </div>
      )}
    </div>
  )
}
