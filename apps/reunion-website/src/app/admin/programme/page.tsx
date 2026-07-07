import { db } from '@/lib/db'
import AdminProgrammeClient from './AdminProgrammeClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Programme — Admin' }

export default async function AdminProgrammePage() {
  const items = await db.programmeItem.findMany({
    orderBy: [{ day: 'asc' }, { order: 'asc' }, { time: 'asc' }],
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Programme</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
          Manage the two-day event schedule. Day 1 = Friday Dec 18 (Football). Day 2 = Saturday Dec 19 (Gala Ball).
        </p>
      </div>
      <AdminProgrammeClient items={items} />
    </div>
  )
}
