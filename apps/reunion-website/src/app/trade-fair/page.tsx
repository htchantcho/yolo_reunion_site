import VendorForm from './VendorForm'
import { db } from '@/lib/db'
import { TRADE_FAIR } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function TradeFairPage() {
  const taken = await db.vendor.count({ where: { status: { not: 'CANCELLED' } } })
  const spotsLeft = Math.max(0, TRADE_FAIR.spotLimit - taken)

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)', color: 'white', padding: '60px 20px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(244,208,63,0.15)', border: '1px solid rgba(244,208,63,0.4)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
            <span style={{ color: '#F4D03F', fontSize: 13, fontWeight: 600 }}>December 18, 2026</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>
            SHEDESA Trade Fair 2026
          </h1>
          <p style={{ fontSize: 17, color: '#a8d8c0', margin: '0 0 24px', lineHeight: 1.6 }}>
            Alongside the Alumni Football Game — showcase your business, connect with fellow SHEDESAns, and sell your products to the community.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 20px', textAlign: 'center' }}>
              <p style={{ color: '#F4D03F', fontSize: 22, fontWeight: 700, margin: 0 }}>{TRADE_FAIR.vendorFee.toLocaleString()}</p>
              <p style={{ color: '#a8d8c0', fontSize: 12, margin: '2px 0 0' }}>XAF to reserve spot</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 20px', textAlign: 'center' }}>
              <p style={{ color: '#F4D03F', fontSize: 22, fontWeight: 700, margin: 0 }}>{spotsLeft}</p>
              <p style={{ color: '#a8d8c0', fontSize: 12, margin: '2px 0 0' }}>spots remaining ({TRADE_FAIR.spotLimit} max)</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 20px', textAlign: 'center' }}>
              <p style={{ color: '#F4D03F', fontSize: 22, fontWeight: 700, margin: 0 }}>Dec 18</p>
              <p style={{ color: '#a8d8c0', fontSize: 12, margin: '2px 0 0' }}>event date</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* Left column — info */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
              About the Trade Fair
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' }}>
              The SHEDESA Trade Fair is a dedicated marketplace running alongside the reunion football game on December 18, 2026. SHEDESAns and business owners are invited to showcase and sell products, services, and crafts to attendees from across the globe.
            </p>

            <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
              {[
                { icon: '🛒', title: 'Sell Your Products', desc: 'Set up your stall and sell directly to hundreds of reunion attendees and guests.' },
                { icon: '🤝', title: 'Network & Connect', desc: 'Meet fellow alumni entrepreneurs and build business relationships with the SHEDESA community.' },
                { icon: '📣', title: 'Promote Your Brand', desc: 'Get visibility for your business among a global community of professionals and graduates.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, background: 'white', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
                  <div>
                    <p style={{ color: '#111827', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '16px 20px' }}>
              <p style={{ color: '#14532d', fontWeight: 700, fontSize: 14, margin: '0 0 8px' }}>Payment</p>
              <p style={{ color: '#166534', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Vendor spots are reserved for <strong>{TRADE_FAIR.vendorFeeDisplay}</strong> via MTN Mobile Money or Orange Money only.
                Payment instructions are sent by email immediately after registration.
                Spots are confirmed once payment is received — first paid, first confirmed.
              </p>
            </div>
          </div>

          {/* Right column — registration form */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Register as a Vendor</h2>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>
                Open to SHEDESAns and all business owners.
              </p>
              <VendorForm spotsLeft={spotsLeft} />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
