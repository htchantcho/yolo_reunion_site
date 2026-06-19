'use client'
import { useState } from 'react'
import { StepIndicator } from '@/components/register/StepIndicator'
import { StepVerification, type VerifiedAlumni, type ManualVerificationResult } from '@/components/register/StepVerification'
import { StepDetails } from '@/components/register/StepDetails'
import { StepConfirm } from '@/components/register/StepConfirm'

type Step = 1 | 2 | 3

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [verifiedAlumni, setVerifiedAlumni] = useState<VerifiedAlumni | null>(null)
  const [manualVerification, setManualVerification] = useState<ManualVerificationResult | null>(null)
  const [registrationResult, setRegistrationResult] = useState<{ registrationId: string; fullName: string } | null>(null)

  const handleAlumniVerified = (alumni: VerifiedAlumni) => {
    setVerifiedAlumni(alumni)
    setStep(2)
  }

  const handleManualVerification = (result: ManualVerificationResult) => {
    setManualVerification(result)
    setStep(2)
  }

  const handleSubmitted = (result: { registrationId: string; fullName: string }) => {
    setRegistrationResult(result)
    setStep(3)
  }

  return (
    <div className="py-12 min-h-screen" style={{ background: '#fafafa' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Register for SHEDESA Reunion 2026
          </h1>
          <p className="text-neutral-600 text-sm">
            Sacred Heart College Douala — December 19, 2026 · Douala, Cameroon
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
          {step === 1 && (
            <StepVerification
              onAlumniVerified={handleAlumniVerified}
              onManualVerification={handleManualVerification}
            />
          )}
          {step === 2 && (
            <StepDetails
              verifiedAlumni={verifiedAlumni}
              manualVerification={manualVerification}
              onSubmitted={handleSubmitted}
            />
          )}
          {step === 3 && registrationResult && (
            <StepConfirm
              registrationId={registrationResult.registrationId}
              fullName={registrationResult.fullName}
            />
          )}
        </div>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Need help? Email{' '}
          <a href="mailto:yoloreunion@gmail.com" style={{ color: '#2D6A4F' }}>
            yoloreunion@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
