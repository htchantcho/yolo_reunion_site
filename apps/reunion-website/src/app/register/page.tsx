import RegisterFlow from './RegisterFlow'
import { FeeDisplay } from '@/components/FeeDisplay'

export default function RegisterPage() {
  return (
    <div className="py-12 min-h-screen" style={{ background: '#FAF7F2' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Register for SHEDESA Reunion 2026
          </h1>
          <p className="text-neutral-600 text-sm">
            Sacred Heart College Douala — December 19, 2026 · Douala, Cameroon
          </p>
        </div>

        {/* How to register video */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-white">
          <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2">
            <span style={{ color: '#8B1A1A', fontSize: 18 }}>▶</span>
            <span className="text-sm font-semibold text-neutral-700">How to Register — Watch this first</span>
          </div>
          <video
            controls
            playsInline
            preload="metadata"
            style={{ width: '100%', display: 'block', maxHeight: 360, background: '#000' }}
          >
            <source src="/how-to-register.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Fee with live exchange rate */}
        <div className="mb-6 rounded-xl px-4 py-3 text-sm text-center" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2', color: '#065f46' }}>
          <span className="font-semibold">Registration fee: </span>
          <FeeDisplay />
        </div>

        <RegisterFlow />

        <p className="text-center text-xs text-neutral-500 mt-6">
          Need help? Email{' '}
          <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>
            yoloreunion@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
