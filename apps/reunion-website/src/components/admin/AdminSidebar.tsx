'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: '📊 Dashboard', exact: true },
  { href: '/admin/registrations', label: '📋 Registrations', exact: false },
  { href: '/admin/verifications', label: '✅ Verifications', exact: false },
  { href: '/admin/alumni', label: '🎓 Alumni', exact: false },
]

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside style={{ width: 220, background: '#2D6A4F', color: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#F4D03F', letterSpacing: 0.5 }}>SHEDESA Admin</div>
        <div style={{ fontSize: 12, color: '#a8d8c0', marginTop: 4 }}>{adminName}</div>
      </div>
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'block', padding: '10px 20px', color: active ? '#F4D03F' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none', background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontWeight: active ? 600 : 400, fontSize: 14,
            }}>
              {label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, padding: 0 }}>
          Sign Out →
        </button>
      </div>
    </aside>
  )
}
