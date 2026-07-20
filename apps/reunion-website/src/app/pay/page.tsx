'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TRADE_FAIR } from '@/lib/constants'

export default function PayPage() {
  const [regId, setRegId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const id = regId.trim().toUpperCase()
    if (!id) return
    const isVendor = id.startsWith('VENDOR-')
    setLoading(true)
    setError('')
    try {
      const query = isVendor ? `vendorId=${encodeURIComponent(id)}` : `regId=${encodeURIComponent(id)}`
      const res = await fetch(`/api/registration-info?${query}`)
      if (!res.ok) {
        setError(`${isVendor ? 'Vendor' : 'Registration'} not found. Check your ID and try again.`)
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data.paymentStatus === 'PAID') {
        setError(`This ${isVendor ? 'vendor spot' : 'registration'} is already fully paid.`)
        setLoading(false)
        return
      }
      router.push(isVendor ? `/register/success?vendorId=${id}` : `/register/success?regId=${id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="py-20 min-h-screen" style={{ background: '#FAF7F2' }}>
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <h1 className="font-playfair text-3xl font-bold text-neutral-900 mb-2">Pay for Your Spot</h1>
            <p className="text-neutral-600 text-sm">
              Already registered or signed up as a vendor? Enter your ID to complete payment.
            </p>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Registration or Vendor ID
              </label>
              <input
                type="text"
                value={regId}
                onChange={e => setRegId(e.target.value)}
                placeholder="SHEDESA-XXXXXX or VENDOR-XXXXXX"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-neutral-900 text-sm focus:outline-none focus:ring-2"
                style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
              />
              <p className="text-xs text-neutral-400 mt-1">
                Found in your confirmation email
              </p>
            </div>

            {error && (
              <div className="rounded-lg p-3 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !regId.trim()}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity"
              style={{ background: '#8B1A1A', opacity: loading || !regId.trim() ? 0.6 : 1 }}
            >
              {loading ? 'Looking up…' : 'Continue to Payment →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-500 mb-2">Don&apos;t have a registration yet?</p>
            <Link href="/register" className="text-sm font-semibold" style={{ color: '#8B1A1A' }}>
              Register for the Reunion →
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-400">
              Questions?{' '}
              <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>
                yoloreunion@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl p-4 text-center" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#8B1A1A' }}>Registration fee: 25,000 XAF / person</p>
          <p className="text-sm font-semibold mb-1" style={{ color: '#8B1A1A' }}>Vendor fee: {TRADE_FAIR.vendorFeeDisplay}</p>
          <p className="text-xs" style={{ color: '#047857' }}>We accept MTN MoMo &amp; Orange Money</p>
        </div>
      </div>
    </div>
  )
}
