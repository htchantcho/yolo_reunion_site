'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const METHODS = [
  { value: 'MTN_MOMO', label: 'MTN MoMo' },
  { value: 'ORANGE_MONEY', label: 'Orange Money' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CARD', label: 'Card (manual)' },
  { value: 'PAYPAL', label: 'PayPal' },
]

const CURRENCY_DEFAULTS: Record<string, number> = {
  XAF: 35000, EUR: 54, USD: 60, NGN: 95000,
}

// EUR/USD/NGN are stored in smallest unit (cents) to match Stripe; XAF has no subunit
const CURRENCY_MULTIPLIER: Record<string, number> = {
  XAF: 1, EUR: 100, USD: 100, NGN: 100,
}

export default function ManualPaymentForm({ regId }: { regId: string }) {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState('MTN_MOMO')
  const [currency, setCurrency] = useState('XAF')
  const [amount, setAmount] = useState(35000)
  const [ref, setRef] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  function handleCurrencyChange(c: string) {
    setCurrency(c)
    setAmount(CURRENCY_DEFAULTS[c] ?? 35000)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(`/api/admin/registrations/${regId}/record-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, currency, amount: amount * (CURRENCY_MULTIPLIER[currency] ?? 1), providerRef: ref || undefined, notes: notes || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setMsg('Payment recorded successfully')
      router.refresh()
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Error')
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ padding: '8px 18px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        Record Manual Payment
      </button>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {msg && (
        <div style={{ background: '#f0f8f4', border: '1px solid #a7f3d0', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#065f46' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)}
            style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
            {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Currency</label>
          <select value={currency} onChange={e => handleCurrencyChange(e.target.value)}
            style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
            {['XAF', 'EUR', 'USD', 'NGN'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required min={1}
          style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>In {currency} — standard rate is {CURRENCY_DEFAULTS[currency]?.toLocaleString()}</p>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Transaction Reference (optional)</label>
        <input value={ref} onChange={e => setRef(e.target.value)} placeholder="MoMo transaction ID, bank ref, etc."
          style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Notes (optional)</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any relevant notes"
          style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading}
          style={{ flex: 1, padding: '9px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Recording…' : 'Confirm Payment'}
        </button>
        <button type="button" onClick={() => setOpen(false)}
          style={{ padding: '9px 16px', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
