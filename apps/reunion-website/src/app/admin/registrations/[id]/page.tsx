import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import RegistrationActions from './RegistrationActions'
import ManualPaymentForm from '@/components/admin/ManualPaymentForm'

export const dynamic = 'force-dynamic'

const METHOD_LABEL: Record<string, string> = {
  MTN_MOMO: 'MTN MoMo', ORANGE_MONEY: 'Orange Money', CARD: 'Card',
  PAYPAL: 'PayPal', BANK_TRANSFER: 'Bank Transfer',
}

function fmt(amount: number, currency: string) {
  const divisor = currency === 'XAF' ? 1 : 100
  return new Intl.NumberFormat('en').format(amount / divisor) + ' ' + currency
}

export default async function RegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reg = await db.registration.findUnique({
    where: { id },
    include: { alumniRecord: true, payments: { orderBy: { createdAt: 'desc' } } },
  })
  if (!reg) notFound()

  const guestDetails = reg.guestDetails as { names?: string[]; ids?: string[] } | null
  const fields: [string, string | number | boolean | null][] = [
    ['Registration ID', reg.registrationId],
    ['Full Name', reg.fullName],
    ['Email', reg.email],
    ['Phone', reg.phone],
    ['Country', reg.country],
    ['Class Year', reg.classYear],
    ['Guest Count', reg.guestCount],
    ['Guest Names', guestDetails?.names?.join(', ') ?? '—'],
    ['Guest IDs', guestDetails?.ids?.join(', ') ?? '—'],
    ['Dietary Preferences', reg.dietaryPrefs ?? '—'],
    ['Accessibility Needs', reg.accessibilityNeeds ?? '—'],
    ['Name Correction Note', (reg as {nameCorrection?: string|null}).nameCorrection ?? '—'],
    ['Consent to Updates', reg.consentUpdates ? 'Yes' : 'No'],
    ['Status', reg.status],
    ['Payment Status', reg.paymentStatus],
    ['Registered', new Date(reg.createdAt).toLocaleString('en-GB')],
  ]

  const isPaid = reg.paymentStatus === 'PAID'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link href="/admin/registrations" style={{ color: '#2D6A4F', textDecoration: 'none', fontSize: 13 }}>← Back</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{reg.fullName}</h1>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{reg.registrationId}</span>
        {isPaid && (
          <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>PAID</span>
        )}
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

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reg.alumniRecord && (
            <div style={{ background: '#f0f8f4', borderRadius: 10, padding: '20px 24px', border: '1px solid #a7f3d0' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#065f46', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Linked Alumni Record</h2>
              <p style={{ fontSize: 14, color: '#065f46', margin: '0 0 4px', fontWeight: 600 }}>{reg.alumniRecord.fullName}</p>
              <p style={{ fontSize: 13, color: '#047857', margin: '0 0 8px' }}>Batch {reg.alumniRecord.batch}</p>
              <a href={`/admin/alumni/${reg.alumniRecord.id}`}
                style={{ fontSize: 12, color: '#2D6A4F', textDecoration: 'underline' }}>
                Edit alumni record →
              </a>
            </div>
          )}
          {(reg as {nameCorrection?: string|null}).nameCorrection && (
            <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '16px 20px', border: '2px solid #FCD34D' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                ⚠ Name Correction Requested
              </p>
              <p style={{ fontSize: 14, color: '#78350F', margin: '0 0 10px', fontStyle: 'italic' }}>
                &ldquo;{(reg as {nameCorrection?: string|null}).nameCorrection}&rdquo;
              </p>
              {reg.alumniRecord && (
                <a href={`/admin/alumni/${reg.alumniRecord.id}`}
                  style={{ fontSize: 13, fontWeight: 600, color: '#92400E', textDecoration: 'underline' }}>
                  Update alumni record →
                </a>
              )}
            </div>
          )}

          <RegistrationActions regId={reg.id} currentStatus={reg.status as never} registrantName={reg.fullName} />

          {/* Payment history */}
          {reg.payments.length > 0 && (
            <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Payments</h2>
              {reg.payments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>{fmt(p.amount, p.currency)}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>{METHOD_LABEL[p.method] ?? p.method}</span>
                    {p.providerRef && <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8, fontFamily: 'monospace' }}>{p.providerRef}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Manual payment form — only if not yet paid */}
          {!isPaid && (
            <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Record Manual Payment</h2>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>Use for MoMo, bank transfer, or cash payments received outside Stripe.</p>
              <ManualPaymentForm regId={reg.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
