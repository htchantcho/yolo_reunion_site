import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 12, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ color: '#2D6A4F', fontWeight: 800, fontSize: 20, letterSpacing: 0.5 }}>SHEDESA</div>
          <div style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Admin Dashboard</div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
