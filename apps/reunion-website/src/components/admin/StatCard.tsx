export default function StatCard({
  label, value, sub, color = '#2D6A4F',
}: {
  label: string
  value: number | string
  sub?: string
  color?: string
}) {
  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
