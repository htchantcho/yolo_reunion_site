'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/admin/registrations', icon: '📋', label: 'Registrations', exact: false },
  { href: '/admin/verifications', icon: '✅', label: 'Verifications', exact: false },
  { href: '/admin/alumni', icon: '🎓', label: 'Alumni', exact: false },
  { href: '/admin/payments', icon: '💰', label: 'Payments', exact: false },
  { href: '/admin/programme', icon: '📅', label: 'Programme', exact: false },
  { href: '/admin/vendors', icon: '🏪', label: 'Vendors', exact: false },
]

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside
      className="flex w-14 flex-shrink-0 flex-col md:w-[220px]"
      style={{ background: '#2D6A4F', color: 'white', minHeight: '100vh' }}
    >
      <div className="border-b px-2 py-4 md:px-5 md:py-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <div className="hidden text-[15px] font-bold tracking-wide md:block" style={{ color: '#B7960C' }}>SHEDESA Admin</div>
        <div className="hidden text-xs md:mt-1 md:block" style={{ color: '#a8d8c0' }}>{adminName}</div>
        <div className="text-center text-lg font-bold md:hidden" style={{ color: '#B7960C' }} title={adminName}>S</div>
      </div>
      <nav className="flex-1 py-3">
        {NAV.map(({ href, icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              className="flex items-center justify-center gap-2.5 px-2 py-2.5 text-sm no-underline md:justify-start md:px-5"
              style={{
                color: active ? '#B7960C' : 'rgba(255,255,255,0.85)',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span aria-hidden className="text-lg leading-none md:text-base">{icon}</span>
              <span className="hidden md:inline">{label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t px-2 py-4 md:px-5" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <button
          onClick={handleLogout}
          title="Sign Out"
          aria-label="Sign Out"
          className="block w-full cursor-pointer border-none bg-transparent p-0 text-center text-lg md:text-left md:text-[13px]"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <span className="md:hidden">↩</span>
          <span className="hidden md:inline">Sign Out →</span>
        </button>
      </div>
    </aside>
  )
}
