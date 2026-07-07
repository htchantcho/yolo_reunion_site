'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AlumniRecord {
  id: string
  fullName: string
  formerName: string | null
  yearAdmission: number
  yearGraduation: number | null
  className: string | null
  batch: string | null
  house: string | null
  phone: string | null
  email: string | null
  country: string | null
  city: string | null
  occupation: string | null
  adminNotes: string | null
}

export default function EditAlumniForm({ record }: { record: AlumniRecord }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    fullName:      record.fullName,
    formerName:    record.formerName ?? '',
    yearAdmission: String(record.yearAdmission),
    yearGraduation:record.yearGraduation ? String(record.yearGraduation) : '',
    className:     record.className ?? '',
    batch:         record.batch ?? '',
    house:         record.house ?? '',
    phone:         record.phone ?? '',
    email:         record.email ?? '',
    country:       record.country ?? '',
    city:          record.city ?? '',
    occupation:    record.occupation ?? '',
    adminNotes:    record.adminNotes ?? '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch(`/api/admin/alumni/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:       form.fullName || undefined,
          formerName:     form.formerName || null,
          yearAdmission:  form.yearAdmission ? Number(form.yearAdmission) : undefined,
          yearGraduation: form.yearGraduation ? Number(form.yearGraduation) : null,
          className:      form.className || null,
          batch:          form.batch || null,
          house:          form.house || null,
          phone:          form.phone || null,
          email:          form.email || null,
          country:        form.country || null,
          city:           form.city || null,
          occupation:     form.occupation || null,
          adminNotes:     form.adminNotes || null,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Save failed')
      }
      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${record.fullName}" from the alumni database? This cannot be undone.`)) return
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/alumni/${record.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Delete failed')
      }
      router.push('/admin/alumni')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setDeleting(false)
    }
  }

  const field = (label: string, key: keyof typeof form, opts?: { type?: string; required?: boolean }) => (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        {label}{opts?.required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={form[key]}
        onChange={set(key)}
        required={opts?.required}
        style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, color: '#111827', background: '#fff', boxSizing: 'border-box' }}
      />
    </div>
  )

  return (
    <form onSubmit={handleSave}>
      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#166534', marginBottom: 16 }}>
          Record updated successfully.
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        {field('Full Name', 'fullName', { required: true })}
        {field('Former / Maiden Name', 'formerName')}
        {field('Year Admission', 'yearAdmission', { type: 'number', required: true })}
        {field('Year Graduation', 'yearGraduation', { type: 'number' })}
        {field('Batch', 'batch')}
        {field('Class Name', 'className')}
        {field('House', 'house')}
        {field('Phone', 'phone')}
        {field('Email', 'email', { type: 'email' })}
        {field('Country', 'country')}
        {field('City', 'city')}
        {field('Occupation', 'occupation')}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Admin Notes</label>
        <textarea
          value={form.adminNotes}
          onChange={set('adminNotes')}
          rows={3}
          style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, color: '#111827', resize: 'vertical', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={saving}
          style={{ background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          style={{ background: 'white', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
        >
          {deleting ? 'Deleting…' : 'Delete Record'}
        </button>
      </div>
    </form>
  )
}
