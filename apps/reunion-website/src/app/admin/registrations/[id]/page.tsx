import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function RegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reg = await db.registration.findUnique({
    where: { id },
    include: { alumniRecord: true },
  })
  if (!reg) notFound()

  const fields: [string, string | number | boolean | null][] = [
    ['Registration ID', reg.registrationId],
    ['Full Name', reg.fullName],
    ['Email', reg.email],
    ['Phone', reg.phone],
    ['Country', reg.country],
    ['Class Year', reg.classYear],
    ['Guest Count', reg.guestCount],
    ['Dietary Preferences', reg.dietaryPrefs ?? '—'],
    ['Accessibility Needs', reg.accessibilityNeeds ?? '—'],
    ['Consent to Updates', reg.consentUpdates ? 'Yes' : 'No'],
    ['Status', reg.status],
    ['Payment Status', reg.paymentStatus],
    ['Registered', new Date(reg.createdAt).toLocaleString('en-GB')],
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link href="/admin/registrations" style={{ color: '#2D6A4F', textDecoration: 'none', fontSize: 13 }}>← Back</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{reg.fullName}</h1>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{reg.registrationId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Details */}
        <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Registration Details</h2>
          <dl style={{ margin: 0 }}>
            {fields.map(([label, value]) => (
              <div key={label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <dt style={{ width: 180, fontSize: 13, color: '#6b7280', flexShrink: 0 }}>{label}</dt>
                <dd style={{ fontSize: 13, color: '#111827', margin: 0, fontWeight: label === 'Registration ID' ? 600 : 400, fontFamily: label === 'Registration ID' ? 'monospace' : 'inherit' }}>
                  {String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Actions + Alumni link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reg.alumniRecord && (
            <div style={{ background: '#f0f8f4', borderRadius: 10, padding: '20px 24px', border: '1px solid #a7f3d0' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#065f46', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Linked Alumni Record</h2>
              <p style={{ fontSize: 14, color: '#065f46', margin: '0 0 4px', fontWeight: 600 }}>{reg.alumniRecord.fullName}</p>
              <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Batch {reg.alumniRecord.batch} · Class of {reg.alumniRecord.yearGraduation}</p>
            </div>
          )}
          {/* Actions rendered in Task 4 */}
          <div id="registration-actions" data-reg-id={reg.id} data-reg-status={reg.status} data-reg-email={reg.email} data-reg-name={reg.fullName} />
        </div>
      </div>
    </div>
  )
}
