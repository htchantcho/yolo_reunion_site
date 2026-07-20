'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { TRADE_FAIR, PAYMENT_NUMBERS } from '@/lib/constants'

type PaymentMethod = 'mtn' | 'orange'

const MTN_NUMBER = PAYMENT_NUMBERS.mtn
const ORANGE_NUMBER = PAYMENT_NUMBERS.orange
const WHATSAPP_NUMBER = PAYMENT_NUMBERS.whatsapp
const XAF_PER_PERSON = 25000

function fmt(n: number) {
  return new Intl.NumberFormat('en').format(n)
}

export default function SuccessContent() {
  const params = useSearchParams()
  const paid = params.get('paid') === '1'
  const cancelled = params.get('cancelled') === '1'
  const regId = params.get('regId')
  const vendorId = params.get('vendorId')
  const isVendor = !!vendorId
  const id = regId ?? vendorId

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn')
  const [guestCount, setGuestCount] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    const query = isVendor ? `vendorId=${id}` : `regId=${id}`
    fetch(`/api/registration-info?${query}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.guestCount !== undefined) setGuestCount(d.guestCount) })
      .catch(() => null)
  }, [id, isVendor])

  const people = 1 + (guestCount ?? 0)
  const xafTotal = isVendor ? TRADE_FAIR.vendorFee : XAF_PER_PERSON * people

  if (paid) {
    return (
      <div className="py-16 min-h-screen" style={{ background: '#FAF7F2' }}>
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="font-playfair text-3xl font-bold text-neutral-900 mb-3">
              Payment Confirmed!
            </h1>
            <p className="text-neutral-600 mb-6">
              {isVendor
                ? 'Your vendor spot is confirmed. We look forward to seeing you at the SHEDESA Trade Fair'
                : 'Your registration is complete. We look forward to seeing you at the SHEDESA Reunion'}
              {' '}on <strong>{isVendor ? 'December 18, 2026' : 'December 19, 2026'}</strong> in Douala!
            </p>
            <div className="rounded-xl p-4 mb-6" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
              <p className="text-sm font-semibold" style={{ color: '#8B1A1A' }}>
                A receipt has been sent to your email.
              </p>
            </div>
            <Link href="/" className={buttonVariants({ variant: 'default' })} style={{ background: '#8B1A1A' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 min-h-screen" style={{ background: '#FAF7F2' }}>
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">💰</div>
            <h1 className="font-playfair text-2xl font-bold text-neutral-900 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-neutral-600 text-sm">
              Choose how you would like to pay your {isVendor ? 'vendor fee' : 'registration fee'}.
            </p>
          </div>

          {cancelled && (
            <div className="rounded-xl p-4 mb-4 text-sm" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
              Payment was cancelled. You can try again below.
            </div>
          )}

          {id ? (
            <>
              {/* Amount summary */}
              <div className="rounded-xl p-4 mb-5" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
                {isVendor ? (
                  <div className="flex justify-between font-bold text-sm" style={{ color: '#8B1A1A' }}>
                    <span>Vendor spot fee</span>
                    <span>{fmt(xafTotal)} XAF</span>
                  </div>
                ) : (
                  <>
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
                    <div className="border-t mt-2 pt-2 flex justify-between font-bold text-sm" style={{ borderColor: '#A8D5C2', color: '#8B1A1A' }}>
                      <span>Total ({people} person{people > 1 ? 's' : ''})</span>
                      <span>{fmt(xafTotal)} XAF</span>
                    </div>
                  </>
                )}
              </div>

              {/* Payment method tabs */}
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Choose payment method
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {([
                  { key: 'mtn' as PaymentMethod, icon: '📱', label: 'MTN MoMo', sub: 'Mobile Money' },
                  { key: 'orange' as PaymentMethod, icon: '🟠', label: 'Orange Money', sub: 'Mobile Money' },
                ]).map(m => (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key)}
                    className="rounded-xl border p-3 text-center transition-all"
                    style={{
                      background: paymentMethod === m.key ? '#8B1A1A' : '#fff',
                      color: paymentMethod === m.key ? '#fff' : '#374151',
                      borderColor: paymentMethod === m.key ? '#8B1A1A' : '#D1D5DB',
                    }}
                  >
                    <div className="text-xl mb-1">{m.icon}</div>
                    <div className="text-xs font-bold leading-tight">{m.label}</div>
                    <div className="text-xs opacity-70 leading-tight mt-0.5">{m.sub}</div>
                  </button>
                ))}
              </div>

              {/* MTN MoMo */}
              {paymentMethod === 'mtn' && (
                <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#92400E' }}>MTN Mobile Money</p>
                      <p className="text-xs text-amber-700">Send to the number below — use your {isVendor ? 'vendor ID' : 'reg ID'} as reference</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg divide-y divide-neutral-100 border border-amber-200 mb-4">
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Send to</p>
                      <p className="text-lg font-bold font-mono" style={{ color: '#92400E' }}>{MTN_NUMBER}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Amount</p>
                      <p className="text-base font-bold" style={{ color: '#8B1A1A' }}>{fmt(xafTotal)} XAF</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Reference (required)</p>
                      <p className="text-sm font-mono font-bold text-neutral-800">{id}</p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-800">
                    After sending, email your screenshot to{' '}
                    <a href="mailto:yoloreunion@gmail.com" style={{ color: '#92400E', fontWeight: 600 }}>
                      yoloreunion@gmail.com
                    </a>{' '}
                    or WhatsApp <strong>{WHATSAPP_NUMBER}</strong> with your {isVendor ? 'vendor ID' : 'registration ID'}.
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
                      <p className="text-xs" style={{ color: '#c2410c' }}>Send to the number below — use your {isVendor ? 'vendor ID' : 'reg ID'} as reference</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg divide-y divide-neutral-100 border mb-4" style={{ borderColor: '#fed7aa' }}>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Send to</p>
                      <p className="text-lg font-bold font-mono" style={{ color: '#9a3412' }}>{ORANGE_NUMBER}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Amount</p>
                      <p className="text-base font-bold" style={{ color: '#8B1A1A' }}>{fmt(xafTotal)} XAF</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 mb-0.5">Reference (required)</p>
                      <p className="text-sm font-mono font-bold text-neutral-800">{id}</p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: '#9a3412' }}>
                    After sending, email your screenshot to{' '}
                    <a href="mailto:yoloreunion@gmail.com" style={{ color: '#9a3412', fontWeight: 600 }}>
                      yoloreunion@gmail.com
                    </a>{' '}
                    or WhatsApp <strong>{WHATSAPP_NUMBER}</strong> with your {isVendor ? 'vendor ID' : 'registration ID'}.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl p-5" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: '#8B1A1A' }}>What happens next?</p>
              <ul className="text-sm text-neutral-700 space-y-2">
                <li className="flex gap-2"><span style={{ color: '#8B1A1A' }}>1.</span><span>Check your email for your confirmation and registration ID.</span></li>
                <li className="flex gap-2"><span style={{ color: '#8B1A1A' }}>2.</span><span>Use the link in your email to complete payment (25,000 XAF/person).</span></li>
                <li className="flex gap-2"><span style={{ color: '#8B1A1A' }}>3.</span><span>Your spot is confirmed once payment is received.</span></li>
              </ul>
            </div>
          )}

          <p className="text-sm text-neutral-500 mt-5 text-center">
            Questions? Email{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }} className="underline">
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
