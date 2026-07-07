import { db } from '@/lib/db'
import Link from 'next/link'
import ImportForm from './ImportForm'

export const dynamic = 'force-dynamic'

const VER_COLORS: Record<string, string> = {
  VERIFIED: '#16a34a',
  PENDING: '#B7960C',
  REJECTED: '#dc2626',
  MANUAL_REVIEW: '#7c3aed',
}

export default async function AlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = 30
  const q = params.q?.trim()

  const where = q ? {
    OR: [
      { fullName: { contains: q, mode: 'insensitive' as const } },
      { batch: { contains: q, mode: 'insensitive' as const } },
      { email: { contains: q, mode: 'insensitive' as const } },
    ],
  } : {}

  const [alumni, total] = await Promise.all([
    db.alumniRecord.findMany({
      where,
      orderBy: [{ batch: 'asc' }, { fullName: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.alumniRecord.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Alumni Database</h1>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{total} records</span>
      </div>

      <ImportForm />

      {/* Search */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input name="q" defaultValue={q} placeholder="Search name, batch, email…"
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: 280 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          Search
        </button>
        {q && <Link href="/admin/alumni" style={{ padding: '8px 12px', color: '#6b7280', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Clear</Link>}
      </form>

      <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Name', 'Batch', 'Grad Year', 'Email', 'Phone', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alumni.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No alumni records found.</td></tr>
            )}
            {alumni.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                  <a href={`/admin/alumni/${a.id}`} style={{ color: '#111827', textDecoration: 'none' }}>
                    {a.fullName}
                  </a>
                  {a.formerName && <span style={{ color: '#9ca3af', fontSize: 11, marginLeft: 6 }}>({a.formerName})</span>}
                </td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{a.batch ?? '—'}</td>
                <td style={{ padding: '10px 14px', color: '#374151' }}>{a.yearGraduation ?? '—'}</td>
                <td style={{ padding: '10px 14px', color: '#6b7280' }}>{a.email ?? '—'}</td>
                <td style={{ padding: '10px 14px', color: '#6b7280' }}>{a.phone ?? '—'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ color: VER_COLORS[a.verificationStatus], fontWeight: 600, fontSize: 11 }}>
                    {a.verificationStatus}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <a href={`/admin/alumni/${a.id}`} style={{ fontSize: 12, color: '#2D6A4F', textDecoration: 'underline' }}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/admin/alumni?page=${p}${q ? `&q=${q}` : ''}`}
              style={{ padding: '6px 12px', borderRadius: 6, fontSize: 13, textDecoration: 'none',
                background: p === page ? '#2D6A4F' : 'white', color: p === page ? 'white' : '#374151',
                border: '1px solid #e5e7eb' }}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
