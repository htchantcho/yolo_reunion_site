import VendorForm from './VendorForm'
import { db } from '@/lib/db'
import { TRADE_FAIR } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function TradeFairPage() {
  const taken = await db.vendor.count({ where: { status: { not: 'CANCELLED' } } })
  const spotsLeft = Math.max(0, TRADE_FAIR.spotLimit - taken)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="px-5 py-10 md:py-[60px] md:pb-12" style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)', color: 'white' }}>
        <div className="mx-auto max-w-[800px] text-center">
          <div className="mb-4 inline-block rounded-[20px] px-3.5 py-1" style={{ background: 'rgba(244,208,63,0.15)', border: '1px solid rgba(244,208,63,0.4)' }}>
            <span style={{ color: '#F4D03F', fontSize: 13, fontWeight: 600 }}>December 18, 2026</span>
          </div>
          <h1 className="mb-3 text-[28px] leading-tight font-extrabold md:text-[40px]">
            SHEDESA Trade Fair 2026
          </h1>
          <p className="mb-6 text-base leading-relaxed md:text-[17px]" style={{ color: '#a8d8c0' }}>
            Alongside the Alumni Football Game — showcase your business, connect with fellow SHEDESAns, and sell your products to the community.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            <div className="rounded-[10px] px-5 py-3.5 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="m-0 text-[22px] font-bold" style={{ color: '#F4D03F' }}>{TRADE_FAIR.vendorFee.toLocaleString()}</p>
              <p className="m-0 mt-0.5 text-xs" style={{ color: '#a8d8c0' }}>XAF to reserve spot</p>
            </div>
            <div className="rounded-[10px] px-5 py-3.5 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="m-0 text-[22px] font-bold" style={{ color: '#F4D03F' }}>{spotsLeft}</p>
              <p className="m-0 mt-0.5 text-xs" style={{ color: '#a8d8c0' }}>spots remaining ({TRADE_FAIR.spotLimit} max)</p>
            </div>
            <div className="rounded-[10px] px-5 py-3.5 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="m-0 text-[22px] font-bold" style={{ color: '#F4D03F' }}>Dec 18</p>
              <p className="m-0 mt-0.5 text-xs" style={{ color: '#a8d8c0' }}>event date</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-5 py-10">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_380px] md:gap-10">

          {/* Left column — info */}
          <div>
            <h2 className="m-0 mb-4 text-[22px] font-bold text-gray-900">
              About the Trade Fair
            </h2>
            <p className="m-0 mb-6 text-sm leading-[1.7] text-gray-500">
              The SHEDESA Trade Fair is a dedicated marketplace running alongside the reunion football game on December 18, 2026. SHEDESAns and business owners are invited to showcase and sell products, services, and crafts to attendees from across the globe.
            </p>

            <div className="mb-8 grid gap-3">
              {[
                { icon: '🛒', title: 'Sell Your Products', desc: 'Set up your stall and sell directly to hundreds of reunion attendees and guests.' },
                { icon: '🤝', title: 'Network & Connect', desc: 'Meet fellow alumni entrepreneurs and build business relationships with the SHEDESA community.' },
                { icon: '📣', title: 'Promote Your Brand', desc: 'Get visibility for your business among a global community of professionals and graduates.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3.5 rounded-[10px] bg-white px-4.5 py-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <span className="text-[22px] leading-none">{item.icon}</span>
                  <div>
                    <p className="m-0 mb-1 text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="m-0 text-[13px] leading-normal text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[10px] border border-green-200 px-5 py-4" style={{ background: '#f0fdf4' }}>
              <p className="m-0 mb-2 text-sm font-bold" style={{ color: '#14532d' }}>Payment</p>
              <p className="m-0 text-[13px] leading-relaxed" style={{ color: '#166534' }}>
                Vendor spots are reserved for <strong>{TRADE_FAIR.vendorFeeDisplay}</strong> via MTN Mobile Money or Orange Money only.
                Payment instructions are sent by email immediately after registration.
                Spots are confirmed once payment is received — first paid, first confirmed.
              </p>
            </div>
          </div>

          {/* Right column — registration form */}
          <div className="md:sticky md:top-6">
            <div className="rounded-xl bg-white p-6 md:p-7" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <h2 className="m-0 mb-1.5 text-lg font-bold text-gray-900">Register as a Vendor</h2>
              <p className="m-0 mb-5 text-[13px] text-gray-500">
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
