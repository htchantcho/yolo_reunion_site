import { db } from '@/lib/db'
import StatCard from '@/components/admin/StatCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [
    totalRegistrations,
    pendingVerification,
    verified,
    paid,
    cancelled,
    pendingManualVerifications,
    totalAlumni,
    verifiedAlumni,
  ] = await Promise.all([
    db.registration.count(),
    db.registration.count({ where: { status: 'PENDING_VERIFICATION' } }),
    db.registration.count({ where: { status: 'VERIFIED' } }),
    db.registration.count({ where: { status: 'PAID' } }),
    db.registration.count({ where: { status: 'CANCELLED' } }),
    db.verificationRequest.count({ where: { status: 'MANUAL_REVIEW' } }),
    db.alumniRecord.count(),
    db.alumniRecord.count({ where: { verificationStatus: 'VERIFIED' } }),
  ])

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
      </div>

      {pendingManualVerifications > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: '#92400e', fontWeight: 500 }}>
            ⚠️ {pendingManualVerifications} manual verification request{pendingManualVerifications > 1 ? 's' : ''} awaiting review
          </span>
          <Link href="/admin/verifications" style={{ fontSize: 13, color: '#B7960C', fontWeight: 600, textDecoration: 'none' }}>Review →</Link>
        </div>
      )}

      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Alumni Database</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="Total Records" value={totalAlumni} color="#2D6A4F" />
        <StatCard label="Verified" value={verifiedAlumni} color="#16a34a" />
      </div>
    </div>
  )
}
