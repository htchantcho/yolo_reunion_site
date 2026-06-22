import { db } from '@/lib/db'
import StatCard from '@/components/admin/StatCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function fmt(amount: number, currency: string) {
  const divisor = currency === 'XAF' ? 1 : 100
  return new Intl.NumberFormat('en').format(amount / divisor) + ' ' + currency
}

const STATUS_COLOR: Record<string, string> = {
  PENDING_VERIFICATION: '#B7960C',
  VERIFIED: '#2563eb',
  PENDING_PAYMENT: '#7c3aed',
  PAID: '#16a34a',
  CANCELLED: '#dc2626',
}

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalRegistrations,
    pendingVerification,
    verified,
    paid,
    cancelled,
    pendingManualVerifications,
    totalAlumni,
    verifiedAlumni,
    paidPayments,
    recentRegistrations,
    paidRegistrationsWithGuests,
  ] = await Promise.all([
    db.registration.count(),
    db.registration.count({ where: { status: 'PENDING_VERIFICATION' } }),
    db.registration.count({ where: { status: 'VERIFIED' } }),
    db.registration.count({ where: { status: 'PAID' } }),
    db.registration.count({ where: { status: 'CANCELLED' } }),
    db.verificationRequest.count({ where: { status: 'MANUAL_REVIEW' } }),
    db.alumniRecord.count(),
    db.alumniRecord.count({ where: { verificationStatus: 'VERIFIED' } }),
    db.payment.findMany({
      where: { status: 'PAID' },
      select: { amount: true, currency: true },
    }),
    db.registration.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { registrationId: true, fullName: true, country: true, status: true, paymentStatus: true, createdAt: true, id: true },
    }),
    db.registration.findMany({
      where: { paymentStatus: 'PAID' },
      select: { guestCount: true },
    }),
  ])

  // Revenue by currency
  const revByCurrency: Record<string, number> = {}
  for (const p of paidPayments) {
    revByCurrency[p.currency] = (revByCurrency[p.currency] ?? 0) + p.amount
  }

  const totalAttendees = paidRegistrationsWithGuests.reduce((sum, r) => sum + 1 + r.guestCount, 0)

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>SHEDESA Reunion 2026 — December 19, 2026</p>

      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Registrations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total" value={totalRegistrations} color="#2D6A4F" />
        <StatCard label="Pending Verification" value={pendingVerification} color="#B7960C" sub="Awaiting alumni check" />
        <StatCard label="Verified" value={verified} color="#2563eb" sub="Awaiting payment" />
        <StatCard label="Paid" value={paid} color="#16a34a" sub="Fully registered" />
        <StatCard label="Cancelled" value={cancelled} color="#dc2626" />
        {totalAttendees > 0 && (
          <StatCard label="Total Attendees" value={totalAttendees} color="#7c3aed" sub="Incl. guests" />
        )}
      </div>

      {pendingManualVerifications > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: '#92400e', fontWeight: 500 }}>
            {pendingManualVerifications} manual verification request{pendingManualVerifications > 1 ? 's' : ''} awaiting review
          </span>
          <Link href="/admin/verifications" style={{ fontSize: 13, color: '#B7960C', fontWeight: 600, textDecoration: 'none' }}>Review →</Link>
        </div>
      )}

      {paidPayments.length > 0 && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Revenue Collected</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {Object.entries(revByCurrency).map(([currency, total]) => (
              <div key={currency} style={{ background: 'white', borderRadius: 10, padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: '4px solid #16a34a' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>{currency}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#16a34a' }}>{fmt(total, currency)}</div>
              </div>
            ))}
            <Link href="/admin/payments" style={{ background: '#f0f8f4', borderRadius: 10, padding: '18px 22px', border: '1px dashed #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#2D6A4F', fontSize: 14, fontWeight: 600 }}>
              View all payments →
            </Link>
          </div>
        </>
      )}

      {recentRegistrations.length > 0 && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Recent Registrations (7 days)</h2>
          <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                {recentRegistrations.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#2D6A4F', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {r.registrationId}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#111827' }}>{r.fullName}</td>
                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{r.country}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: (STATUS_COLOR[r.status] ?? '#6b7280') + '20', color: STATUS_COLOR[r.status] ?? '#6b7280', padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <Link href={`/admin/registrations/${r.id}`} style={{ color: '#2D6A4F', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Alumni Database</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="Total Records" value={totalAlumni} color="#2D6A4F" />
        <StatCard label="Verified" value={verifiedAlumni} color="#16a34a" />
      </div>
    </div>
  )
}
