'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'

const CURRENCIES = [
  { key: 'eur', label: 'EUR', perPerson: 54,    display: '54 EUR',      flag: '🇪🇺', note: 'fixed rate' },
  { key: 'usd', label: 'USD', perPerson: 60,    display: '60 USD',      flag: '🇺🇸', note: 'approx.'    },
  { key: 'ngn', label: 'NGN', perPerson: 95000, display: '95,000 NGN',  flag: '🇳🇬', note: 'approx.'    },
] as const

type Currency = (typeof CURRENCIES)[number]['key']
type PaymentMethod = 'card' | 'mtn' | 'orange'

// Update these with real numbers before go-live
const MTN_NUMBER = '+237 6XX XXX XXX'
const ORANGE_NUMBER = '+237 6XX XXX XXX'
const WHATSAPP_NUMBER = '+12402716512'
const XAF_PER_PERSON = 35000

function fmt(n: number) {
  return new Intl.NumberFormat('en').format(n)
}

export default function SuccessContent() {
  const params = useSearchParams()
  const paid = params.get('paid') === '1'
  const cancelled = params.get('cancelled') === '1'
  const regId = params.get('regId')

  const [currency, setCurrency] = useState<Currency>('eur')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!regId) return
    fetch(`/api/registration-info?regId=${regId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.guestCount !== undefined) setGuestCount(d.guestCount) })
      .catch(() => null)
  }, [regId])

  const people = 1 + (guestCount ?? 0)
  const selectedCurrency = CURRENCIES.find(c => c.key === currency) ?? CURRENCIES[0]
  const cardTotal = selectedCurrency.perPerson * people
  const xafTotal = XAF_PER_PERSON * people

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
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">💳</div>
            <h1 className="font-playfair text-2xl font-bold text-neutral-900 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-neutral-600 text-sm">
              Choose how you would like to pay your registration fee.
            </p>
          </div>

          {cancelled && (
            <div className="rounded-xl p-4 mb-4 text-sm" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
              Payment was cancelled. You can try again below.
            </div>
          )}

          {regId ? (
            <>
              {/* Amount summary */}
              <div className="rounded-xl p-4 mb-5" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Your ticket</span>
                  <span>{fmt(XAF_PER_PERSON)} XAF</span>
                </div>
                {(guestCount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-neutral-600 mt-1">
                    <span>{guestCount} guest{guestCount === 1 ? '' : 's'} × {fmt(XAF_PER_PERSON)} XAF</span>
                    <span>{fmt(XAF_PER_PERSON * (guestCount ?? 0))} XAF</span>
                  </div>
                )}
                <div className="border-t mt-2 pt-2 flex justify-between font-bold text-sm" style={{ borderColor: '#A8D5C2', color: '#2D6A4F' }}>
                  <span>Total ({people} person{people > 1 ? 's' : ''})</span>
                  <span>{fmt(xafTotal)} XAF</span>
                </div>
              </div>

              {/* Payment method tabs */}
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Choose payment method
              </p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {([
                  { key: 'card' as PaymentMethod, icon: '💳', label: 'Card', sub: 'Visa / Mastercard' },
                  { key: 'mtn' as PaymentMethod, icon: '📱', label: 'MTN MoMo', sub: 'Mobile Money' },
                  { key: 'orange' as PaymentMethod, icon: '🟠', label: 'Orange Money', sub: 'Mobile Money' },
                ]).map(m => (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key)}
                    className="rounded-xl border p-3 text-center transition-all"
                    style={{
                      background: paymentMethod === m.key ? '#2D6A4F' : '#fff',
                      color: paymentMethod === m.key ? '#fff' : '#374151',
                      borderColor: paymentMethod === m.key ? '#2D6A4F' : '#D1D5DB',
                    }}
                  >
                    <div className="text-xl mb-1">{m.icon}</div>
                    <div className="text-xs font-bold leading-tight">{m.label}</div>
                    <div className="text-xs opacity-70 leading-tight mt-0.5">{m.sub}</div>
                  </button>
                ))}
              </div>

              {/* Card payment */}
              {paymentMethod === 'card' && (
                <div className="rounded-xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <p className="text-xs text-neutral-500 mb-2">Choose your billing currency:</p>
                  <div className="flex gap-2 mb-3">
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
                  <div className="rounded-lg p-3 mb-3 text-xs bg-white border border-neutral-200">
                    <div className="flex justify-between text-neutral-600">
                      <span>{people} person{people > 1 ? 's' : ''} × {fmt(selectedCurrency.perPerson)} {selectedCurrency.label}</span>
                      <span className="font-bold" style={{ color: '#2D6A4F' }}>
                        {fmt(cardTotal)} {selectedCurrency.label}
                      </span>
                    </div>
                    <div className="text-neutral-400 mt-1">
                      = {fmt(xafTotal)} XAF (Francs CFA)
                    </div>
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
                      : `Pay ${fmt(cardTotal)} ${selectedCurrency.label} →`}
                  </button>
                </div>
              )}

              {/* MTN MoMo */}
              {paymentMethod === 'mtn' && (
                <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#92400E' }}>MTN Mobile Money</p>
                      <p className="text-xs text-amber-700">Send to the number below — use your reg ID as reference</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg divide-y divide-neutral-100 border border-amber-200 mb-4">
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Send to</p>
                      <p className="text-lg font-bold font-mono" style={{ color: '#92400E' }}>{MTN_NUMBER}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Amount</p>
                      <p className="text-base font-bold" style={{ color: '#2D6A4F' }}>{fmt(xafTotal)} XAF</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Reference (required)</p>
                      <p className="text-sm font-mono font-bold text-neutral-800">{regId}</p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-800">
                    After sending, email your screenshot to{' '}
                    <a href="mailto:yoloreunion@gmail.com" style={{ color: '#92400E', fontWeight: 600 }}>
                      yoloreunion@gmail.com
                    </a>{' '}
                    or WhatsApp <strong>{WHATSAPP_NUMBER}</strong> with your registration ID.
                  </p>
                </div>
              )}

              {/* Orange Money */}
              {paymentMethod === 'orange' && (
                <div className="rounded-xl p-4" style={{ background: '#FFF7ED', border: '1px solid #FB923C' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🟠</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#9a3412' }}>Orange Money</p>
                      <p className="text-xs" style={{ color: '#c2410c' }}>Send to the number below — use your reg ID as reference</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg divide-y divide-neutral-100 border mb-4" style={{ borderColor: '#fed7aa' }}>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Send to</p>
                      <p className="text-lg font-bold font-mono" style={{ color: '#9a3412' }}>{ORANGE_NUMBER}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Amount</p>
                      <p className="text-base font-bold" style={{ color: '#2D6A4F' }}>{fmt(xafTotal)} XAF</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Reference (required)</p>
                      <p className="text-sm font-mono font-bold text-neutral-800">{regId}</p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: '#9a3412' }}>
                    After sending, email your screenshot to{' '}
                    <a href="mailto:yoloreunion@gmail.com" style={{ color: '#9a3412', fontWeight: 600 }}>
                      yoloreunion@gmail.com
                    </a>{' '}
                    or WhatsApp <strong>{WHATSAPP_NUMBER}</strong> with your registration ID.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl p-5" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: '#2D6A4F' }}>What happens next?</p>
              <ul className="text-sm text-neutral-700 space-y-2">
                <li className="flex gap-2"><span style={{ color: '#B7960C' }}>1.</span><span>Check your email for your confirmation and registration ID.</span></li>
                <li className="flex gap-2"><span style={{ color: '#B7960C' }}>2.</span><span>Use the link in your email to complete payment (35,000 XAF/person).</span></li>
                <li className="flex gap-2"><span style={{ color: '#B7960C' }}>3.</span><span>Your spot is confirmed once payment is received.</span></li>
              </ul>
            </div>
          )}

          <p className="text-sm text-neutral-500 mt-5 text-center">
            Questions? Email{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#2D6A4F' }} className="underline">
              yoloreunion@gmail.com
            </a>
          </p>

          <div className="mt-4 text-center">
            <Link href="/" className={buttonVariants({ variant: 'outline' })}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
