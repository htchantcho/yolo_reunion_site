'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number required'),
  classYear: z.string().min(2, 'Class year required'),
  details: z.string().min(20, 'Please provide at least 20 characters of detail'),
})
type FormData = z.infer<typeof schema>

interface ManualVerificationResult {
  verificationRequestId: string
  fullName: string
}

interface Props {
  onSubmitted: (result: ManualVerificationResult) => void
}

export function ManualVerificationForm({ onSubmitted }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/alumni/verify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Submission failed')
      onSubmitted({ verificationRequestId: json.id, fullName: data.fullName })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div
        className="rounded-lg p-4 text-sm"
        style={{ background: '#FBF7E8', border: '1px solid #F5EBC5', color: '#92660a' }}
      >
        <strong>Not in our database?</strong> Fill out this form and our team will verify your alumni
        status within 48 hours.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input
            {...register('fullName')}
            placeholder="As it appeared on your school records"
            className="mt-1"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <Label>Email Address</Label>
          <Input
            type="email"
            {...register('email')}
            placeholder="your@email.com"
            className="mt-1"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input {...register('phone')} placeholder="+237 6XX XXX XXX" className="mt-1" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>Class / Year</Label>
          <Input {...register('classYear')} placeholder="e.g. Form 5A, 1998" className="mt-1" />
          {errors.classYear && (
            <p className="text-red-500 text-xs mt-1">{errors.classYear.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label>Details to help us verify you</Label>
        <Textarea
          {...register('details')}
          rows={4}
          placeholder="Describe your time at SHEDESA — teachers you remember, friends, activities, events, years attended..."
          className="mt-1"
        />
        {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>}
      </div>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60"
        style={{ background: '#2D6A4F' }}
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Verification Request'}
      </button>
    </form>
  )
}
