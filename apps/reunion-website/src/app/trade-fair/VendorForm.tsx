'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COUNTRIES = [
  'Cameroon', 'United States', 'United Kingdom', 'Canada', 'France', 'Germany',
  'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Nigeria', 'Ghana',
  'South Africa', 'Kenya', 'Côte d\'Ivoire', 'Senegal', 'Other',
]

const BUSINESS_TYPES = [
  'Food & Beverages', 'Fashion & Clothing', 'Electronics & Tech',
  'Health & Beauty', 'Agriculture & Produce', 'Crafts & Art', 'Services', 'Other',
]

export default function VendorForm({ spotsLeft }: { spotsLeft: number }) {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    businessName: '', businessType: '', description: '', country: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.fullName || !form.email || !form.phone || !form.businessName || !form.country) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.')
        return
      }
      router.push('/trade-fair/success/' + data.vendorId)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
    borderRadius: 6, fontSize: 14, boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4,
  }

  if (spotsLeft <= 0) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#991b1b', fontWeight: 700, fontSize: 16, margin: '0 0 8px' }}>All Spots Taken</p>
        <p style={{ color: '#7f1d1d', fontSize: 14, margin: 0 }}>
          Contact us at <a href="mailto:yoloreunion@gmail.com" style={{ color: '#2D6A4F' }}>yoloreunion@gmail.com</a> to join the waitlist.
        </p>
      </div>
    )
  }

  const urgentWarning = spotsLeft <= 3 && (
    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#c2410c', fontSize: 13, fontWeight: 600, margin: 0 }}>
        Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining — register now!
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {urgentWarning}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Full Name *</label>
          <input style={inp} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Your full name" required />
        </div>
        <div>
          <label style={lbl}>Email Address *</label>
          <input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Phone Number *</label>
          <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+237 6XX XXX XXX" required />
        </div>
        <div>
          <label style={lbl}>Country *</label>
          <select style={inp} value={form.country} onChange={e => set('country', e.target.value)} required>
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={lbl}>Business / Brand Name *</label>
        <input style={inp} value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Name of your business or brand" required />
      </div>

      <div>
        <label style={lbl}>Business Type</label>
        <select style={inp} value={form.businessType} onChange={e => set('businessType', e.target.value)}>
          <option value="">Select type (optional)</option>
          {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label style={lbl}>Tell us about your business</label>
        <textarea
          style={{ ...inp, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Describe what you will offer at the trade fair (optional)"
          maxLength={500}
        />
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ color: '#b91c1c', fontSize: 13, margin: 0 }}>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? '#9ca3af' : '#2D6A4F', color: 'white',
          border: 'none', borderRadius: 8, padding: '13px 24px',
          fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? 'Reserving your spot…' : 'Reserve My Vendor Spot'}
      </button>

      <p style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', margin: 0 }}>
        MTN MoMo / Orange Money payment instructions will be emailed after registration.
      </p>
    </form>
  )
}
