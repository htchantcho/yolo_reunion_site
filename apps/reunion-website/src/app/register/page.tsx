'use client'
import { useState } from 'react'
import { StepIndicator } from '@/components/register/StepIndicator'
import { StepVerification, type VerifiedAlumni, type ManualVerificationResult } from '@/components/register/StepVerification'
import { StepDetails, type GuestPass } from '@/components/register/StepDetails'
import { StepConfirm } from '@/components/register/StepConfirm'

type Step = 1 | 2 | 3

interface RegistrationResult {
  registrationId: string
  fullName: string
  guests: GuestPass[]
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [verifiedAlumni, setVerifiedAlumni] = useState<VerifiedAlumni | null>(null)
  const [manualVerification, setManualVerification] = useState<ManualVerificationResult | null>(null)
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null)

  const handleAlumniVerified = (alumni: VerifiedAlumni) => {
    setVerifiedAlumni(alumni)
    setStep(2)
  }

  const handleManualVerification = (result: ManualVerificationResult) => {
    setManualVerification(result)
    setStep(2)
  }

  const handleSubmitted = (result: RegistrationResult) => {
    setRegistrationResult(result)
    setStep(3)
  }

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
              guests={registrationResult.guests}
            />
          )}
        </div>

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
