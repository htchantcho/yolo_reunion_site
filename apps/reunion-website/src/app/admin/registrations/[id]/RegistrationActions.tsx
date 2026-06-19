'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['PENDING_VERIFICATION', 'VERIFIED', 'PENDING_PAYMENT', 'PAID', 'CANCELLED'] as const
type Status = typeof STATUSES[number]

export default function RegistrationActions({
  regId,
  currentStatus,
}: {
  regId: string
  currentStatus: Status
}) {
  const [status, setStatus] = useState<Status>(currentStatus)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function updateStatus(newStatus: Status) {
    setLoading(true)
    const res = await fetch(`/api/admin/registrations/${regId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setStatus(newStatus)
      setMsg(`Status updated to ${newStatus.replace(/_/g, ' ')}`)
      router.refresh()
    } else {
      setMsg('Update failed')
    }
    setLoading(false)
  }

  async function sendPaymentEmail() {
    setLoading(true)
    const res = await fetch(`/api/admin/registrations/${regId}/send-payment`, { method: 'POST' })
    if (res.ok) {
      setEmailSent(true)
      setMsg('Payment instructions email sent')
    } else {
      setMsg('Email failed — check SMTP logs')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Actions</h2>

      {msg && (
        <div style={{ background: '#f0f8f4', border: '1px solid #a7f3d0', borderRadius: 6, padding: '8px 12px', marginBottom: 14, fontSize: 13, color: '#065f46' }}>
          {msg}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Update Status</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STATUSES.map(s => (
            <button key={s} disabled={loading || s === status} onClick={() => updateStatus(s)}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: s === status ? 'default' : 'pointer',
                border: '1px solid', borderColor: s === status ? '#2D6A4F' : '#d1d5db',
                background: s === status ? '#2D6A4F' : 'white', color: s === status ? 'white' : '#374151',
                opacity: loading ? 0.6 : 1,
              }}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Payment Email</label>
        <button onClick={sendPaymentEmail} disabled={loading || emailSent}
          style={{
            padding: '8px 18px', background: emailSent ? '#16a34a' : '#B7960C', color: 'white',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: loading || emailSent ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
          {emailSent ? 'Sent' : 'Send Payment Instructions'}
        </button>
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
          Sends MTN/Orange Money payment instructions to the registrant.
        </p>
      </div>
    </div>
  )
}
