'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerificationActions({ verificationId }: { verificationId: string }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ action: string; registrationId?: string } | null>(null)
  const router = useRouter()

  async function act(action: 'approve' | 'reject') {
    setLoading(true)
    const res = await fetch(`/api/admin/verifications/${verificationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNotes: notes }),
    })
    const data = await res.json()
    if (res.ok) {
      setResult({ action, registrationId: data.registrationId })
      router.refresh()
    } else {
      setResult({ action: 'error' })
    }
    setLoading(false)
  }

  if (result) {
    if (result.action === 'approve') {
      return (
        <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
          <p style={{ color: '#166534', fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>✓ Approved & Registered</p>
          {result.registrationId && (
            <p style={{ color: '#166534', fontSize: 13, margin: 0 }}>
              Registration ID: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{result.registrationId}</span>
            </p>
          )}
          <p style={{ color: '#4ade80', fontSize: 12, margin: '6px 0 0' }}>
            Alumni record created · Registration created · Confirmation + payment instructions sent
          </p>
        </div>
      )
    }
    if (result.action === 'reject') {
      return (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: 14, color: '#991b1b', fontWeight: 600 }}>
          ✗ Rejected
        </div>
      )
    }
    return (
      <div style={{ padding: '12px 16px', background: '#fef2f2', borderRadius: 8, fontSize: 14, color: '#991b1b' }}>
        Action failed — check logs
      </div>
    )
  }

  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
        Admin Notes (optional)
      </label>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', marginBottom: 12 }}
        placeholder="Reason for approval or rejection…"
      />
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => act('approve')}
          disabled={loading}
          style={{ flex: 1, padding: '9px 0', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          ✓ Approve & Register
        </button>
        <button
          onClick={() => act('reject')}
          disabled={loading}
          style={{ flex: 1, padding: '9px 0', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          ✗ Reject
        </button>
      </div>
    </div>
  )
}
