'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DonationForm, { type EditableDonation } from './DonationForm'

export default function DonationRowActions({ donation }: { donation: EditableDonation }) {
  const { id, status } = donation
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  async function call(init: RequestInit) {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/donations/${id}`, init)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error ?? 'Action failed')
      } else {
        router.refresh()
      }
    } finally {
      setBusy(false)
    }
  }

  const linkStyle = { background: 'none', border: 'none', padding: 0, fontWeight: 600, fontSize: 12, cursor: busy ? 'wait' : 'pointer' } as const

  return (
    <div style={{ display: 'flex', gap: 10, whiteSpace: 'nowrap' }}>
      {status === 'PENDING' && (
        <button
          disabled={busy}
          onClick={() => call({
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'PAID' }),
          })}
          style={{ ...linkStyle, color: '#16a34a' }}>
          Mark received
        </button>
      )}
      <button disabled={busy} onClick={() => setEditing(true)} style={{ ...linkStyle, color: '#2D6A4F' }}>
        Edit
      </button>
      <button
        disabled={busy}
        onClick={() => {
          if (confirm('Delete this contribution record? This cannot be undone.')) call({ method: 'DELETE' })
        }}
        style={{ ...linkStyle, color: '#dc2626' }}>
        Delete
      </button>

      {editing && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setEditing(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px', whiteSpace: 'normal' }}>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <DonationForm initial={donation} onDone={() => setEditing(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
