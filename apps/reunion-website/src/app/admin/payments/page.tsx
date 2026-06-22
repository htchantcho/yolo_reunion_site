import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const METHOD_LABEL: Record<string, string> = {
  MTN_MOMO: 'MTN MoMo',
  ORANGE_MONEY: 'Orange Money',
  CARD: 'Card',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Bank Transfer',
}

const CURRENCY_DIVISOR: Record<string, number> = {
  EUR: 100, USD: 100, NGN: 100, XAF: 1,
}

function fmt(amount: number, currency: string) {
  const divisor = CURRENCY_DIVISOR[currency] ?? 1
  const value = divisor > 1 ? (amount / divisor) : amount
  return new Intl.NumberFormat('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value) + ' ' + currency
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; method?: string; currency?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = 30
  const method = params.method
  const currency = params.currency

  const where = {
    status: 'PAID' as const,
    ...(method ? { method: method as never } : {}),
    ...(currency ? { currency } : {}),
  }

  const [payments, total, allPaid] = await Promise.all([
    db.payment.findMany({
      where,
      include: { registration: { select: { registrationId: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.payment.count({ where }),
    db.payment.findMany({
      where: { status: 'PAID' },
      select: { amount: true, currency: true, method: true },
    }),
  ])

  // Revenue by currency
  const byCurrency: Record<string, number> = {}
  const byMethod: Record<string, number> = {}
  for (const p of allPaid) {
    byCurrency[p.currency] = (byCurrency[p.currency] ?? 0) + 1
    byMethod[p.method] = (byMethod[p.method] ?? 0) + 1
  }

  // Revenue amounts by currency (in major units)
  const revByCurrency: Record<string, number> = {}
  for (const p of allPaid) {
    const divisor = CURRENCY_DIVISOR[p.currency] ?? 1
    revByCurrency[p.currency] = (revByCurrency[p.currency] ?? 0) + p.amount / divisor
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Payments</h1>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{allPaid.length} paid total</span>
      </div>

      {/* Revenue summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
        {Object.entries(revByCurrency).map(([cur, total]) => (
          <div key={cur} style={{ background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>Revenue ({cur})</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2D6A4F' }}>
              {new Intl.NumberFormat('en').format(total)} {cur}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{byCurrency[cur]} payment{byCurrency[cur] > 1 ? 's' : ''}</div>
          </div>
        ))}
        {Object.entries(byMethod).map(([m, count]) => (
          <div key={m} style={{ background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>{METHOD_LABEL[m] ?? m}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#374151' }}>{count}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>payment{count > 1 ? 's' : ''}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select name="method" defaultValue={method ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All methods</option>
          {Object.entries(METHOD_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select name="currency" defaultValue={currency ?? ''}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
          <option value="">All currencies</option>
          {['XAF', 'EUR', 'USD', 'NGN'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Filter
        </button>
        {(method || currency) && (
          <Link href="/admin/payments" style={{ padding: '8px 12px', color: '#6b7280', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Clear</Link>
        )}
      </form>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Reg ID', 'Name', 'Amount', 'Method', 'Reference', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No payments found.</td></tr>
            )}
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#2D6A4F', fontWeight: 600 }}>
                  {p.registration.registrationId}
                </td>
                <td style={{ padding: '10px 14px', color: '#111827' }}>{p.registration.fullName}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#065f46' }}>{fmt(p.amount, p.currency)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: '#f0f8f4', color: '#2D6A4F', padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11 }}>
                    {METHOD_LABEL[p.method] ?? p.method}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', fontFamily: 'monospace', fontSize: 11 }}>
                  {p.providerRef ? p.providerRef.slice(0, 24) + (p.providerRef.length > 24 ? '…' : '') : '—'}
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                  {new Date(p.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <Link href={`/admin/registrations/${p.registrationId}`} style={{ color: '#2D6A4F', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/admin/payments?page=${p}${method ? `&method=${method}` : ''}${currency ? `&currency=${currency}` : ''}`}
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
