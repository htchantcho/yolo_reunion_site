'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DonationRowActions({ id, status }: { id: string; status: string }) {
  const [busy, setBusy] = useState(false)
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
          style={{ background: 'none', border: 'none', padding: 0, color: '#16a34a', fontWeight: 600, fontSize: 12, cursor: busy ? 'wait' : 'pointer' }}>
          Mark received
        </button>
      )}
      <button
        disabled={busy}
        onClick={() => {
          if (confirm('Delete this contribution record? This cannot be undone.')) call({ method: 'DELETE' })
        }}
        style={{ background: 'none', border: 'none', padding: 0, color: '#dc2626', fontWeight: 600, fontSize: 12, cursor: busy ? 'wait' : 'pointer' }}>
        Delete
      </button>
    </div>
  )
}
