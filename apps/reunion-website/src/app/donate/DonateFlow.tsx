'use client'
import { useState } from 'react'
import { StepVerification, type VerifiedAlumni, type ManualVerificationResult } from '@/components/register/StepVerification'
import { PAYMENT_NUMBERS } from '@/lib/constants'

export function DonateFlow() {
  const [verified, setVerified] = useState<VerifiedAlumni | null>(null)

  if (verified) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold" style={{ color: '#8B1A1A' }}>Thank you, {verified.fullName.split(' ')[0]} 🙏</p>
          <h2 className="font-playfair text-xl font-bold text-neutral-900 mt-1">You&apos;re verified — here&apos;s how to give</h2>
        </div>

        <blockquote className="rounded-xl p-5 mb-6 text-sm text-neutral-700 italic leading-relaxed" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
          &ldquo;Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.&rdquo;
          <footer className="not-italic text-xs text-neutral-500 mt-2">— 2 Corinthians 9:7 (KJV)</footer>
        </blockquote>

        <div className="rounded-xl p-5 space-y-3" style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-neutral-700">MTN MoMo</span>
            <span className="font-mono text-sm font-bold" style={{ color: '#8B1A1A' }}>{PAYMENT_NUMBERS.mtn}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-neutral-700">Orange Money</span>
            <span className="font-mono text-sm font-bold" style={{ color: '#8B1A1A' }}>{PAYMENT_NUMBERS.orange}</span>
          </div>
          <p className="text-xs text-neutral-500 pt-1">Please use your name as the payment reference so we can send you a receipt.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
      <div className="text-center mb-2">
        <h2 className="font-playfair text-xl font-bold text-neutral-900">Donate via Mobile Money</h2>
        <p className="text-neutral-500 text-sm mt-1">
          Confirm you&apos;re a Sacred Heart alumnus to reveal the MTN MoMo &amp; Orange Money numbers.
        </p>
      </div>
      <StepVerification
        onAlumniVerified={(alumni: VerifiedAlumni) => setVerified(alumni)}
        onManualVerification={(_result: ManualVerificationResult) => {}}
      />
    </div>
  )
}
