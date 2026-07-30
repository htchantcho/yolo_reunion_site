import { getAdminSession } from '@/lib/admin-auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin — SHEDESA Reunion 2026' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  if (!session) {
    // Middleware redirects unauthenticated requests — if we reach here it's the login page
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f5' }}>
      <AdminSidebar adminName={session.name} />
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-auto px-4 py-5 md:px-8 md:py-7" style={{ maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  )
}
