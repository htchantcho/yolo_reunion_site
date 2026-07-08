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

export default function RegisterFlow() {
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
    <>
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
    </>
  )
}
