'use client'
import { useState } from 'react'

export default function SendRemindersButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ sent: number; alreadyRegistered: number; failed: string[] } | null>(null)

  async function send() {
    if (!confirm('Send registration reminder emails to all verified-but-unregistered alumni?')) return
    setState('loading')
    try {
      const res = await fetch('/api/admin/verifications/send-reminders', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done' && result) {
    return (
      <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#166534' }}>
        ✓ Sent <strong>{result.sent}</strong> reminder email{result.sent !== 1 ? 's' : ''}.
        {result.alreadyRegistered > 0 && <span> {result.alreadyRegistered} already registered (skipped).</span>}
        {result.failed.length > 0 && <span style={{ color: '#dc2626' }}> {result.failed.length} failed.</span>}
      </div>
    )
  }

  if (state === 'error') {
    return <div style={{ color: '#dc2626', fontSize: 13 }}>Failed to send — check logs.</div>
  }

  return (
    <button
      onClick={send}
      disabled={state === 'loading'}
      style={{
        padding: '9px 20px', background: '#2D6A4F', color: 'white', border: 'none',
        borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: state === 'loading' ? 'not-allowed' : 'pointer',
        opacity: state === 'loading' ? 0.7 : 1,
      }}
    >
      {state === 'loading' ? 'Sending…' : '📧 Send Registration Reminders'}
    </button>
  )
}
