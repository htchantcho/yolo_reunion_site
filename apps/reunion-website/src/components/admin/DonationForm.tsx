'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TYPES = [
  { value: 'SPONSORSHIP', label: 'Sponsorship' },
  { value: 'CHARITY', label: 'Charity' },
  { value: 'SCHOOL_SUPPORT', label: 'School Support' },
  { value: 'ALUMNI_PROJECT', label: 'Alumni Project' },
  { value: 'CUSTOM', label: 'Other' },
]

const METHODS = [
  { value: 'MTN_MOMO', label: 'MTN MoMo' },
  { value: 'ORANGE_MONEY', label: 'Orange Money' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'CARD', label: 'Card' },
]

// EUR/USD/NGN are stored in smallest unit (cents); XAF has no subunit
const CURRENCY_MULTIPLIER: Record<string, number> = {
  XAF: 1, EUR: 100, USD: 100, NGN: 100,
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 } as const
const fieldStyle = { width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' } as const

export interface EditableDonation {
  id: string
  type: string
  donorName: string | null
  donorEmail: string | null
  amount: number
  currency: string
  method: string
  status: string
  providerRef: string | null
  message: string | null
  anonymous: boolean
}

// With `initial`, the form edits that contribution (PATCH) and calls `onDone`
// when saved or closed. Without it, it logs a new one (POST).
export default function DonationForm({ initial, onDone }: { initial?: EditableDonation; onDone?: () => void } = {}) {
  const editing = !!initial
  const [open, setOpen] = useState(editing)
  const [type, setType] = useState(initial?.type ?? 'SPONSORSHIP')
  const [donorName, setDonorName] = useState(initial?.donorName ?? '')
  const [donorEmail, setDonorEmail] = useState(initial?.donorEmail ?? '')
  const [amount, setAmount] = useState(
    initial ? initial.amount / (CURRENCY_MULTIPLIER[initial.currency] ?? 1) : 0,
  )
  const [currency, setCurrency] = useState(initial?.currency ?? 'XAF')
  const [method, setMethod] = useState(initial?.method ?? 'MTN_MOMO')
  const [status, setStatus] = useState(initial?.status ?? 'PAID')
  const [ref, setRef] = useState(initial?.providerRef ?? '')
  const [message, setMessage] = useState(initial?.message ?? '')
  const [anonymous, setAnonymous] = useState(initial?.anonymous ?? false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  function reset() {
    setType('SPONSORSHIP')
    setDonorName('')
    setDonorEmail('')
    setAmount(0)
    setCurrency('XAF')
    setMethod('MTN_MOMO')
    setStatus('PAID')
    setRef('')
    setMessage('')
    setAnonymous(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setError(false)
    try {
      const res = await fetch(editing ? `/api/admin/donations/${initial.id}` : '/api/admin/donations', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          donorName,
          donorEmail,
          amount: Math.round(amount * (CURRENCY_MULTIPLIER[currency] ?? 1)),
          currency,
          method,
          status,
          providerRef: ref,
          message,
          anonymous,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      router.refresh()
      if (editing) {
        onDone?.()
      } else {
        setMsg('Contribution logged')
        reset()
      }
    } catch (e: unknown) {
      setError(true)
      setMsg(e instanceof Error ? e.message : 'Error')
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ padding: '8px 18px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        + Log a Contribution
      </button>
    )
  }

  return (
    <form onSubmit={submit}
      style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{editing ? 'Edit Contribution' : 'Log a Contribution'}</div>
      {!editing && (
        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
          For sponsor and donor money received outside the registration flow — mobile money, bank transfer, cash handed in, etc.
        </p>
      )}

      {msg && (
        <div style={{
          background: error ? '#fef2f2' : '#f0f8f4',
          border: `1px solid ${error ? '#fecaca' : '#a7f3d0'}`,
          borderRadius: 6, padding: '8px 12px', fontSize: 13, color: error ? '#991b1b' : '#065f46',
        }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} style={fieldStyle}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)} style={fieldStyle}>
            {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Sponsor / Donor Name{anonymous ? ' (optional)' : ''}</label>
          <input value={donorName} onChange={e => setDonorName(e.target.value)} required={!anonymous}
            placeholder="Person or organisation" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email (optional)</label>
          <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
            placeholder="For the thank-you / receipt" style={fieldStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Amount</label>
          <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} required min={1}
            style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Currency</label>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={fieldStyle}>
            {['XAF', 'EUR', 'USD', 'NGN'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={fieldStyle}>
            <option value="PAID">Received</option>
            <option value="PENDING">Pledged</option>
            {/* Keep a status set elsewhere (e.g. refunded) selectable so saving doesn't silently change it */}
            {status !== 'PAID' && status !== 'PENDING' && <option value={status}>{status}</option>}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Transaction Reference (optional)</label>
        <input value={ref} onChange={e => setRef(e.target.value)}
          placeholder="MoMo transaction ID, bank ref, cheque number…" style={fieldStyle} />
      </div>

      <div>
        <label style={labelStyle}>Notes (optional)</label>
        <input value={message} onChange={e => setMessage(e.target.value)}
          placeholder="What the contribution is for, who handed it in, etc." style={fieldStyle} />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
        <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
        Publish as anonymous (hides the name on any public listing)
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading}
          style={{ flex: 1, padding: '9px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : editing ? 'Save Changes' : 'Save Contribution'}
        </button>
        <button type="button" onClick={() => { setOpen(false); setMsg(''); onDone?.() }}
          style={{ padding: '9px 16px', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </form>
  )
}
