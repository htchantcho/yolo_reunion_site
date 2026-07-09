import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import VendorActions from './VendorActions'

export const dynamic = 'force-dynamic'

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#B7960C',
  CONFIRMED: '#16a34a',
  CANCELLED: '#dc2626',
}

const PAY_COLOR: Record<string, string> = {
  PENDING: '#9ca3af',
  PAID: '#16a34a',
  REFUNDED: '#6b7280',
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vendor = await db.vendor.findUnique({ where: { id } })
  if (!vendor) notFound()

  const fields = [
    { label: 'Full Name', value: vendor.fullName },
    { label: 'Email', value: vendor.email },
    { label: 'Phone', value: vendor.phone },
    { label: 'Country', value: vendor.country },
    { label: 'Business Name', value: vendor.businessName },
    { label: 'Business Type', value: vendor.businessType ?? '—' },
    { label: 'Registered', value: new Date(vendor.createdAt).toLocaleString('en-GB') },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link href="/admin/vendors" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>← Vendors</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ fontFamily: 'monospace', color: '#2D6A4F', fontWeight: 700 }}>{vendor.vendorId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Vendor info */}
        <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{vendor.fullName}</h1>
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{vendor.businessName}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <span style={{ background: STATUS_COLOR[vendor.status] + '20', color: STATUS_COLOR[vendor.status], padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                {vendor.status}
              </span>
              <span style={{ background: PAY_COLOR[vendor.paymentStatus] + '20', color: PAY_COLOR[vendor.paymentStatus], padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                {vendor.paymentStatus}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 0, borderTop: '1px solid #f3f4f6' }}>
            {fields.map(f => (
              <div key={f.label} style={{ display: 'flex', padding: '11px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ width: 160, color: '#6b7280', fontSize: 13, flexShrink: 0 }}>{f.label}</span>
                <span style={{ color: '#111827', fontSize: 13, fontWeight: 500 }}>{f.value}</span>
              </div>
            ))}
          </div>

          {vendor.description && (
            <div style={{ marginTop: 16 }}>
              <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>Business Description</p>
              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{vendor.description}</p>
            </div>
          )}
        </div>

        {/* Admin actions */}
        <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Admin Actions</h2>
          <VendorActions
            vendorDbId={vendor.id}
            vendorId={vendor.vendorId}
            currentStatus={vendor.status}
            currentPaymentStatus={vendor.paymentStatus}
            adminNotes={vendor.adminNotes}
          />
        </div>
      </div>
    </div>
  )
}
