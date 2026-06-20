'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'

const CURRENCIES = [
  { key: 'eur', label: 'EUR', display: '54 EUR',      flag: '🇪🇺', note: 'fixed rate' },
  { key: 'usd', label: 'USD', display: '60 USD',      flag: '🇺🇸', note: 'approx.'    },
  { key: 'ngn', label: 'NGN', display: '95,000 NGN',  flag: '🇳🇬', note: 'approx.'    },
] as const

export default function SuccessContent() {
  const params = useSearchParams()
  const paid = params.get('paid') === '1'
  const cancelled = params.get('cancelled') === '1'
  const regId = params.get('regId')

  const [currency, setCurrency] = useState<'eur' | 'usd' | 'ngn'>('eur')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    if (!regId) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: regId, currency }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to start payment')
      window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <div className="py-16 min-h-screen" style={{ background: '#fafafa' }}>
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="font-playfair text-3xl font-bold text-neutral-900 mb-3">
              Payment Confirmed!
            </h1>
            <p className="text-neutral-600 mb-6">
              Your registration is complete. We look forward to seeing you at the SHEDESA Reunion
              on <strong>December 19, 2026</strong> in Douala!
            </p>
            <div className="rounded-xl p-4 mb-6" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
              <p className="text-sm font-semibold" style={{ color: '#2D6A4F' }}>
                A receipt has been sent to your email.
              </p>
            </div>
            <Link href="/" className={buttonVariants({ variant: 'default' })} style={{ background: '#2D6A4F' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 min-h-screen" style={{ background: '#fafafa' }}>
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📬</div>
          <h1 className="font-playfair text-3xl font-bold text-neutral-900 mb-3">
            Registration Received
          </h1>
          <p className="text-neutral-600 mb-6">
            Thank you for registering for the SHEDESA Reunion 2026. Complete your payment below to
            secure your spot.
          </p>

          {cancelled && (
            <div className="rounded-xl p-4 mb-4 text-sm" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
              Payment was cancelled. You can try again below.
            </div>
          )}

          {regId ? (
            <div className="rounded-xl p-5 mb-6 text-left" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
              <p className="font-semibold text-sm mb-1" style={{ color: '#2D6A4F' }}>
                Complete Payment — 35,000 XAF
              </p>
              <p className="text-xs text-neutral-500 mb-3">
                Pay securely via card. Choose your currency:
              </p>

              <div className="flex gap-2 mb-4">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCurrency(c.key)}
                    className="flex-1 rounded-lg border py-2 px-1 text-center transition-all"
                    style={{
                      background: currency === c.key ? '#2D6A4F' : '#fff',
                      color: currency === c.key ? '#fff' : '#374151',
                      borderColor: currency === c.key ? '#2D6A4F' : '#D1D5DB',
                    }}
                  >
                    <div className="text-base">{c.flag}</div>
                    <div className="text-xs font-bold">{c.display}</div>
                    <div className="text-xs opacity-70">{c.note}</div>
                  </button>
                ))}
              </div>

              {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full rounded-lg py-3 text-white font-semibold text-sm transition-opacity"
                style={{ background: '#B7960C', opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? 'Redirecting to Stripe…'
                  : `Pay ${CURRENCIES.find(c => c.key === currency)?.display} →`}
              </button>
            </div>
          ) : (
            <div className="rounded-xl p-5 mb-6 text-left" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: '#2D6A4F' }}>
                What happens next?
              </p>
              <ul className="text-sm text-neutral-700 space-y-2">
                <li className="flex gap-2">
                  <span style={{ color: '#B7960C' }}>1.</span>
                  <span>Check your email for your confirmation and registration ID.</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: '#B7960C' }}>2.</span>
                  <span>Use the link in your email to complete payment (35,000 XAF).</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: '#B7960C' }}>3.</span>
                  <span>Your spot is confirmed once payment is received.</span>
                </li>
              </ul>
            </div>
          )}

          <p className="text-sm text-neutral-500 mb-6">
            Questions? Email{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#2D6A4F' }} className="underline">
              yoloreunion@gmail.com
            </a>
          </p>

          <Link href="/" className={buttonVariants({ variant: 'outline' })}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
