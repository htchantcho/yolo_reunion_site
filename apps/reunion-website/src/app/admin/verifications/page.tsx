import { db } from '@/lib/db'
import VerificationActions from './[id]/VerificationActions'
import SendRemindersButton from './SendRemindersButton'

export const dynamic = 'force-dynamic'

export default async function VerificationsPage() {
  const pending = await db.verificationRequest.findMany({
    where: { status: 'MANUAL_REVIEW' },
    orderBy: { createdAt: 'asc' },
  })

  const resolved = await db.verificationRequest.findMany({
    where: { status: { not: 'MANUAL_REVIEW' } },
    orderBy: { resolvedAt: 'desc' },
    take: 20,
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}><h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Verification Requests</h1><SendRemindersButton /></div>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        {pending.length} pending · {resolved.length} recently resolved
      </p>

      {pending.length === 0 && (
        <div style={{ background: '#f0f8f4', border: '1px solid #a7f3d0', borderRadius: 10, padding: '24px', textAlign: 'center', marginBottom: 28 }}>
          <p style={{ color: '#065f46', fontSize: 15, margin: 0 }}>✓ No pending verification requests</p>
        </div>
      )}

      {pending.map(v => (
        <div key={v.id} style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 16, borderLeft: '4px solid #B7960C' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>{v.fullName}</h2>
              <dl style={{ margin: 0, fontSize: 13 }}>
                {([['Email', v.email], ['Phone', v.phone], ['Class Year', v.classYear], ['Submitted', new Date(v.createdAt).toLocaleDateString('en-GB')]] as [string, string][]).map(([l, val]) => (
                  <div key={l} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <dt style={{ color: '#6b7280', width: 90, flexShrink: 0 }}>{l}</dt>
                    <dd style={{ color: '#111827', margin: 0 }}>{val}</dd>
                  </div>
                ))}
              </dl>
              {v.details && (
                <div style={{ marginTop: 12, background: '#fafafa', borderRadius: 6, padding: '10px 12px', fontSize: 13, color: '#374151' }}>
                  <strong>Details:</strong> {v.details}
                </div>
              )}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Action</p>
              <VerificationActions verificationId={v.id} />
            </div>
          </div>
        </div>
      ))}

      {resolved.length > 0 && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginTop: 28 }}>
            Recently Resolved
          </h2>
          <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Name', 'Email', 'Class Year', 'Status', 'Resolved'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resolved.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 14px', color: '#111827' }}>{v.fullName}</td>
                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{v.email}</td>
                    <td style={{ padding: '10px 14px', color: '#374151' }}>{v.classYear}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ color: v.status === 'VERIFIED' ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: 12 }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#9ca3af' }}>
                      {v.resolvedAt ? new Date(v.resolvedAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
