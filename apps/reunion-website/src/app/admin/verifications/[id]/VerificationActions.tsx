'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerificationActions({ verificationId }: { verificationId: string }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const router = useRouter()

  async function act(action: 'approve' | 'reject') {
    setLoading(true)
    const res = await fetch(`/api/admin/verifications/${verificationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNotes: notes }),
    })
    if (res.ok) {
      setDone(action === 'approve' ? 'Approved ✓' : 'Rejected')
      router.refresh()
    } else {
      setDone('Action failed')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{ padding: '12px 16px', background: '#f0f8f4', borderRadius: 8, fontSize: 14, color: '#065f46', fontWeight: 600 }}>
        {done}
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
          ✓ Approve
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
