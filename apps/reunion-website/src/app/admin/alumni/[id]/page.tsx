import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import EditAlumniForm from './EditAlumniForm'

export const dynamic = 'force-dynamic'

export default async function AlumniDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await db.alumniRecord.findUnique({
    where: { id },
    include: {
      registrations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          registrationId: true,
          fullName: true,
          nameCorrection: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      },
    },
  })
  if (!record) notFound()

  const corrections = record.registrations.filter(r => r.nameCorrection)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link href="/admin/alumni" style={{ color: '#2D6A4F', textDecoration: 'none', fontSize: 13 }}>← Alumni</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{record.fullName}</h1>
        {record.batch && <span style={{ fontSize: 13, color: '#6b7280' }}>Batch {record.batch}</span>}
      </div>

      {corrections.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '2px solid #FCD34D', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            ⚠ Name Correction Requested by Alumni
          </p>
          {corrections.map(r => (
            <div key={r.id} style={{ fontSize: 14, color: '#78350F', marginBottom: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#92400E' }}>{r.registrationId}</span>
              {' → '}
              <em>&ldquo;{r.nameCorrection}&rdquo;</em>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#92400E', marginTop: 8 }}>Update the Full Name field below to correct the spelling.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ background: 'white', borderRadius: 10, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 20 }}>Edit Record</h2>
          <EditAlumniForm record={record} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {record.registrations.length > 0 && (
            <div style={{ background: 'white', borderRadius: 10, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Registrations</h2>
              {record.registrations.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid #f3f4f6', padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Link href={`/admin/registrations/${r.id}`}
                      style={{ fontSize: 12, fontFamily: 'monospace', color: '#2D6A4F', textDecoration: 'none', fontWeight: 600 }}>
                      {r.registrationId}
                    </Link>
                    {r.nameCorrection && (
                      <span style={{ marginLeft: 6, fontSize: 11, background: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: 4 }}>
                        correction
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: r.paymentStatus === 'PAID' ? '#16a34a' : '#9ca3af', fontWeight: 600 }}>
                    {r.paymentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '16px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
              Verification: <strong style={{ color: '#111827' }}>{record.verificationStatus}</strong>
            </p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '6px 0 0' }}>
              Added: {new Date(record.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
