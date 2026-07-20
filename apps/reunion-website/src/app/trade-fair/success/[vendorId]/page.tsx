import Link from 'next/link'
import { TRADE_FAIR, PAYMENT_NUMBERS } from '@/lib/constants'

export default async function VendorSuccessPage({
  params,
}: {
  params: Promise<{ vendorId: string }>
}) {
  const { vendorId } = await params

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <span style={{ fontSize: 26 }}>&#10003;</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', textAlign: 'center', margin: '0 0 8px' }}>
            Spot Reserved!
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', margin: '0 0 28px' }}>
            Your vendor spot for the SHEDESA Trade Fair is reserved. Check your email for payment instructions.
          </p>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 20, marginBottom: 24, textAlign: 'center' }}>
            <p style={{ color: '#14532d', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>Your Vendor ID</p>
            <p style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, color: '#2D6A4F', margin: 0 }}>{vendorId}</p>
            <p style={{ color: '#166534', fontSize: 12, margin: '8px 0 0' }}>Save this ID — use it as your payment reference.</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Complete Your Payment — {TRADE_FAIR.vendorFeeDisplay}</p>

            <Link
              href={`/register/success?vendorId=${vendorId}`}
              style={{ display: 'block', textAlign: 'center', padding: '13px 20px', background: '#2D6A4F', color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', marginBottom: 14 }}
            >
              Pay Now — {TRADE_FAIR.vendorFeeDisplay} →
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#fff8e1', borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ color: '#92400e', fontWeight: 700, fontSize: 13, margin: '0 0 4px' }}>MTN Mobile Money</p>
                <p style={{ color: '#78350f', fontSize: 13, margin: 0 }}>
                  Send {TRADE_FAIR.vendorFeeDisplay} to: <strong>{PAYMENT_NUMBERS.mtn}</strong><br />
                  Reference: <strong>{vendorId}</strong>
                </p>
              </div>
              <div style={{ background: '#fff3e0', borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ color: '#92400e', fontWeight: 700, fontSize: 13, margin: '0 0 4px' }}>Orange Money</p>
                <p style={{ color: '#78350f', fontSize: 13, margin: 0 }}>
                  Send {TRADE_FAIR.vendorFeeDisplay} to: <strong>{PAYMENT_NUMBERS.orange}</strong><br />
                  Reference: <strong>{vendorId}</strong>
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px', marginBottom: 24 }}>
            <p style={{ color: '#374151', fontSize: 13, margin: '0 0 4px', fontWeight: 600 }}>After payment:</p>
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              Send your payment screenshot and vendor ID to WhatsApp{' '}
              <strong>+12402716512</strong> or email{' '}
              <a href="mailto:yoloreunion@gmail.com" style={{ color: '#2D6A4F' }}>yoloreunion@gmail.com</a>.
              Your spot is confirmed once payment is verified.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/" style={{ display: 'block', textAlign: 'center', padding: '11px 20px', background: '#2D6A4F', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Back to Home
            </Link>
            <Link href="/trade-fair" style={{ display: 'block', textAlign: 'center', padding: '11px 20px', color: '#6b7280', borderRadius: 8, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              Register another vendor
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
