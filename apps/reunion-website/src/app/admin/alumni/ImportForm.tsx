'use client'
import { useState, useRef } from 'react'

type ImportResult = { imported: number; skipped: number; errors: string[] }

export default function ImportForm() {
  const [result, setResult] = useState<ImportResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/alumni/import', { method: 'POST', body: fd })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Import failed')
    } else {
      setResult(data)
      if (fileRef.current) fileRef.current.value = ''
    }
    setLoading(false)
  }

  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Import Alumni from CSV</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Required columns: <code>fullName, yearAdmission</code>. Optional: <code>formerName, yearGraduation, className, batch, house, phone, email, country, city, occupation</code>. Existing records (matched by email/phone) are skipped.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input ref={fileRef} type="file" accept=".csv,text/csv" required
          style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 10px', fontSize: 13 }} />
        <button type="submit" disabled={loading}
          style={{ padding: '8px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Importing…' : 'Import CSV'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 12, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 6, fontSize: 13 }}>{error}</div>
      )}

      {result && (
        <div style={{ marginTop: 12, background: '#f0f8f4', border: '1px solid #a7f3d0', borderRadius: 6, padding: '12px 16px', fontSize: 13 }}>
          <strong style={{ color: '#065f46' }}>Import complete:</strong>
          <span style={{ color: '#065f46' }}> {result.imported} imported</span>
          {result.skipped > 0 && <span style={{ color: '#92400e' }}>, {result.skipped} skipped (duplicates or invalid)</span>}
          {result.errors.length > 0 && (
            <ul style={{ marginTop: 8, color: '#b91c1c', paddingLeft: 16 }}>
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
