import { getAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#6b7280', fontSize: 15 }}>Welcome back, {session.name}. Use the sidebar to manage registrations, verifications, and alumni.</p>
    </div>
  )
}
