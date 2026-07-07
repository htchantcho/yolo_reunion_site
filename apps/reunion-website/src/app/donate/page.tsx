import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Support the Reunion — SHEDESA 2026',
  description: 'Help make the SHEDESA Reunion 2026 a success. Your contribution supports venue, catering, and activities for alumni of Sacred Heart College Douala.',
}

export default function DonatePage() {
  return (
    <div className="py-20 min-h-screen" style={{ background: '#FAF7F2' }}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div style={{ fontSize: 56, marginBottom: 12 }}>🙏</div>
          <h1 className="font-playfair text-4xl font-bold text-neutral-900 mb-4">Support the Reunion</h1>
          <p className="text-neutral-600 text-lg leading-relaxed">
            Your generosity helps make the <strong>SHEDESA Reunion 2026</strong> a memorable celebration for all alumni of Sacred Heart College Douala.
          </p>
        </div>

        {/* What donations support */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 mb-6">
          <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-6">Where Your Support Goes</h2>
          <div className="space-y-4">
            {[
              { icon: '🏛️', title: 'Venue & Logistics', desc: 'A dignified setting in Douala befitting our reunion' },
              { icon: '🍽️', title: 'Catering', desc: 'A celebratory dinner and refreshments for attendees' },
              { icon: '🎶', title: 'Entertainment', desc: 'Live music and cultural programme for the evening' },
              { icon: '📸', title: 'Photography & Memories', desc: 'Professional documentation of this milestone event' },
              { icon: '🎓', title: 'Alumni Bursary Fund', desc: 'Supporting current Sacred Heart students with financial need' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 items-start">
                <span style={{ fontSize: 24, lineHeight: 1, marginTop: 2 }}>{item.icon}</span>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{item.title}</p>
                  <p className="text-neutral-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to donate */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 mb-6">
          <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-2">How to Contribute</h2>
          <p className="text-neutral-500 text-sm mb-6">
            We accept contributions via bank transfer or mobile money. Please email us to coordinate.
          </p>
          <div className="rounded-xl p-5" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#8B1A1A' }}>Contact us to arrange a contribution</p>
            <a
              href="mailto:yoloreunion@gmail.com?subject=SHEDESA%202026%20Donation"
              className="inline-block mt-3 px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
              style={{ background: '#8B1A1A' }}
            >
              Email yoloreunion@gmail.com →
            </a>
          </div>
        </div>

        {/* Register CTA */}
        <div className="text-center mt-8">
          <p className="text-neutral-500 text-sm mb-3">Planning to attend? Register for the event.</p>
          <Link href="/register" className={buttonVariants({ variant: 'default' })} style={{ background: '#8B1A1A' }}>
            Register for the Reunion
          </Link>
        </div>
      </div>
    </div>
  )
}
