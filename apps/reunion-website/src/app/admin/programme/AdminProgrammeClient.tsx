'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProgrammeItem {
  id: string
  day: number
  time: string
  title: string
  description: string | null
  speaker: string | null
  location: string | null
  order: number
}

const DAY_LABELS: Record<number, string> = {
  1: 'Day 1 — Friday, December 18, 2026 (Football Classic)',
  2: 'Day 2 — Saturday, December 19, 2026 (Gala Ball)',
}
const DAY_COLORS: Record<number, string> = { 1: '#2D6A4F', 2: '#B7960C' }

const empty = { day: 1, time: '', title: '', description: '', speaker: '', location: '', order: 0 }

export default function AdminProgrammeClient({ items: initial }: { items: ProgrammeItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState({ ...empty, day: 1 })
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<ProgrammeItem | null>(null)
  const [msg, setMsg] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: k === 'day' || k === 'order' ? Number(e.target.value) : e.target.value }))

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/programme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      const item = await res.json()
      setItems(prev => [...prev, item].sort((a, b) => a.day - b.day || a.order - b.order || a.time.localeCompare(b.time)))
      setForm({ ...empty, day: form.day })
      setMsg('Item added.')
      router.refresh()
    } catch { setMsg('Error adding item.') }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this programme item?')) return
    await fetch(`/api/admin/programme/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
    router.refresh()
  }

  async function handleSaveEdit() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/programme/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i).sort((a, b) => a.day - b.day || a.order - b.order || a.time.localeCompare(b.time)))
      setEditing(null)
      router.refresh()
    } catch { alert('Error saving.') }
    setSaving(false)
  }

  const byDay = [1, 2].map(d => ({ day: d, items: items.filter(i => i.day === d) }))

  const inp = (style?: React.CSSProperties): React.CSSProperties => ({
    width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6,
    fontSize: 13, color: '#111827', background: '#fff', boxSizing: 'border-box', ...style,
  })

  return (
    <div>
      {/* Add form */}
      <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Add Programme Item
        </h2>
        {msg && <div style={{ background: '#f0f8f4', border: '1px solid #a7f3d0', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#065f46', marginBottom: 14 }}>{msg}</div>}
        <form onSubmit={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Day *</label>
              <select value={form.day} onChange={set('day')} style={inp()}>
                <option value={1}>Day 1 — Friday Dec 18 (Football)</option>
                <option value={2}>Day 2 — Saturday Dec 19 (Gala Ball)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Time *</label>
              <input value={form.time} onChange={set('time')} placeholder="e.g. 10:00 AM" required style={inp()} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Order #</label>
              <input type="number" value={form.order} onChange={set('order')} min={0} style={inp()} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Title *</label>
              <input value={form.title} onChange={set('title')} placeholder="e.g. Opening Ceremony" required style={inp()} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Venue / Location</label>
              <input value={form.location} onChange={set('location')} placeholder="e.g. Main Field, Douala" style={inp()} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Optional details" style={{ ...inp(), resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Speaker / Host</label>
              <input value={form.speaker} onChange={set('speaker')} placeholder="Optional" style={inp()} />
            </div>
          </div>
          <button type="submit" disabled={saving}
            style={{ background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Adding…' : '+ Add Item'}
          </button>
        </form>
      </div>

      {/* Items by day */}
      {byDay.map(({ day, items: dayItems }) => (
        <div key={day} style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ background: DAY_COLORS[day], padding: '14px 20px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>{DAY_LABELS[day]}</h3>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{dayItems.length} item{dayItems.length !== 1 ? 's' : ''}</span>
          </div>
          {dayItems.length === 0 && (
            <p style={{ padding: '20px', fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>No items yet — add one above.</p>
          )}
          {dayItems.map(item => (
            <div key={item.id}>
              {editing?.id === item.id ? (
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <input value={editing.time} onChange={e => setEditing({ ...editing, time: e.target.value })} placeholder="Time" style={inp()} />
                    <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Title" style={inp()} />
                    <input value={editing.location ?? ''} onChange={e => setEditing({ ...editing, location: e.target.value })} placeholder="Location" style={inp()} />
                    <input value={editing.speaker ?? ''} onChange={e => setEditing({ ...editing, speaker: e.target.value })} placeholder="Speaker" style={inp()} />
                  </div>
                  <textarea value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} placeholder="Description" style={{ ...inp(), marginBottom: 10, resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSaveEdit} disabled={saving} style={{ background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditing(null)} style={{ background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, padding: '7px 16px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: DAY_COLORS[day], fontWeight: 700, minWidth: 70 }}>{item.time}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.title}</span>
                      {item.location && <span style={{ fontSize: 11, color: '#9ca3af' }}>📍 {item.location}</span>}
                    </div>
                    {item.description && <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0 80px' }}>{item.description}</p>}
                    {item.speaker && <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 80px' }}>🎤 {item.speaker}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setEditing(item)} style={{ fontSize: 11, color: '#2D6A4F', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ fontSize: 11, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
