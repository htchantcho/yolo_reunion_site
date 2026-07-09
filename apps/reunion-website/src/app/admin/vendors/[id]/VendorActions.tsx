'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VendorActions({
  vendorDbId,
  vendorId,
  currentStatus,
  currentPaymentStatus,
  adminNotes: initialNotes,
}: {
  vendorDbId: string
  vendorId: string
  currentStatus: string
  currentPaymentStatus: string
  adminNotes: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [msg, setMsg] = useState('')

  async function save() {
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/admin/vendors/' + vendorDbId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus, adminNotes: notes }),
    })
    setSaving(false)
    if (res.ok) {
      setMsg('Saved')
      router.refresh()
    } else {
      setMsg('Error saving changes')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete vendor ' + vendorId + ': This cannot be undone.')) return
    setDeleting(true)
    const res = await fetch('/api/admin/vendors/' + vendorDbId, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/vendors')
    } else {
      setDeleting(false)
      setMsg('Delete failed')
    }
  }

  const sel: React.CSSProperties = { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Vendor Status</label>
        <select style={sel} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Payment Status</label>
        <select style={sel} value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Admin Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
          placeholder="Internal notes about this vendor"
        />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: '9px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {msg && <span style={{ fontSize: 13, color: msg === 'Saved' ? '#16a34a' : '#dc2626' }}>{msg}</span>}
      </div>

      <div style={{ borderTop: '1px solid #fee2e2', paddingTop: 16, marginTop: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', margin: '0 0 8px' }}>DANGER ZONE</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ padding: '8px 16px', background: 'white', color: '#dc2626', border: '1px solid #dc2626', borderRadius: 6, fontSize: 13, cursor: deleting ? 'not-allowed' : 'pointer' }}
        >
          {deleting ? 'Deleting…' : 'Delete Vendor'}
        </button>
      </div>
    </div>
  )
}
