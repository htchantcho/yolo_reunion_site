'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { VerifiedAlumni, ManualVerificationResult } from './StepVerification'

const schema = z.object({
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number required'),
  country: z.string().min(2, 'Country required'),
  guestCount: z.string().regex(/^[0-5]$/, 'Enter a number between 0 and 5'),
  dietaryPrefs: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  consentUpdates: z.boolean(),
  agreedToTerms: z.literal(true, {
    message: 'You must agree to the terms and privacy policy',
  }),
})
type FormData = z.infer<typeof schema>

interface Props {
  verifiedAlumni: VerifiedAlumni | null
  manualVerification: ManualVerificationResult | null
  onSubmitted: (result: { registrationId: string; fullName: string }) => void
}

export function StepDetails({ verifiedAlumni, manualVerification, onSubmitted }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const fullName = verifiedAlumni?.fullName ?? manualVerification?.fullName ?? ''
  const classYear = verifiedAlumni?.yearGraduation
    ? String(verifiedAlumni.yearGraduation)
    : verifiedAlumni?.batch ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guestCount: '0', consentUpdates: false },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const body: Record<string, unknown> = {
        fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        classYear,
        guestCount: Number(data.guestCount),
        dietaryPrefs: data.dietaryPrefs,
        accessibilityNeeds: data.accessibilityNeeds,
        consentUpdates: data.consentUpdates,
        agreedToTerms: data.agreedToTerms,
      }
      if (verifiedAlumni?.alumniRecordId) {
        body.alumniRecordId = verifiedAlumni.alumniRecordId
      }
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Registration failed')
      onSubmitted({ registrationId: json.registrationId, fullName })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-1">
          Your Registration Details
        </h2>
        <p className="text-neutral-600 text-sm">
          Please fill in your information for the SHEDESA Reunion 2026.
        </p>
      </div>

      <div
        className="rounded-lg p-4 text-sm"
        style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}
      >
        <p className="font-semibold mb-0.5" style={{ color: '#2D6A4F' }}>
          Registration Fee: 25,000 XAF per person
        </p>
        <p className="text-neutral-600">
          Payment instructions will be sent to your email after registration is confirmed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <div className="mt-1 h-8 w-full rounded-lg border border-input bg-muted px-2.5 py-1 text-sm text-muted-foreground flex items-center">
            {fullName || <span className="italic">Not set</span>}
          </div>
        </div>
        <div>
          <Label>Graduation Year / Batch</Label>
          <div className="mt-1 h-8 w-full rounded-lg border border-input bg-muted px-2.5 py-1 text-sm text-muted-foreground flex items-center">
            {classYear || <span className="italic">Not set</span>}
          </div>
        </div>
        <div>
          <Label>
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input type="email" {...register('email')} placeholder="your@email.com" className="mt-1" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label>
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input {...register('phone')} placeholder="+237 6XX XXX XXX" className="mt-1" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>
            Country of Residence <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register('country')}
            placeholder="e.g. Cameroon, France, USA"
            className="mt-1"
          />
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
        </div>
        <div>
          <Label>
            Additional Guests <span className="text-neutral-400 font-normal">(0–5)</span>
          </Label>
          <Input type="number" min={0} max={5} {...register('guestCount')} className="mt-1" />
          {errors.guestCount && (
            <p className="text-red-500 text-xs mt-1">{errors.guestCount.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>
          Dietary Preferences <span className="text-neutral-400 font-normal">(optional)</span>
        </Label>
        <Input
          {...register('dietaryPrefs')}
          placeholder="e.g. vegetarian, halal, no pork..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>
          Accessibility Needs <span className="text-neutral-400 font-normal">(optional)</span>
        </Label>
        <Textarea
          {...register('accessibilityNeeds')}
          placeholder="Let us know if you need any special assistance"
          rows={2}
          className="mt-1"
        />
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('consentUpdates')} className="mt-0.5 w-4 h-4" />
          <span className="text-sm text-neutral-700">
            I consent to receive SHEDESA reunion updates and event information by email.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('agreedToTerms')} className="mt-0.5 w-4 h-4" />
          <span className="text-sm text-neutral-700">
            I agree to the{' '}
            <a href="/terms" target="_blank" style={{ color: '#2D6A4F' }} className="underline">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" style={{ color: '#2D6A4F' }} className="underline">
              Privacy Policy
            </a>
            . <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="text-red-500 text-xs">{errors.agreedToTerms.message}</p>
        )}
      </div>

      {errorMsg && (
        <p className="text-red-500 text-sm rounded-lg p-3 bg-red-50 border border-red-200">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60"
        style={{ background: '#2D6A4F' }}
      >
        {status === 'loading' ? 'Submitting...' : 'Complete Registration →'}
      </button>
    </form>
  )
}
