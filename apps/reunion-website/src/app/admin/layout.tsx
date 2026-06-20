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
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  )
}
