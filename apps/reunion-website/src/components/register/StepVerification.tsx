'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlumniSearchResult } from './AlumniSearchResult'
import { ManualVerificationForm } from './ManualVerificationForm'

const schema = z.object({
  name: z.string().min(2, 'Enter at least 2 characters'),
  year: z.string().optional(),
  batch: z.string().optional(),
})
type SearchForm = z.infer<typeof schema>

interface AlumniRecord {
  id: string
  fullName: string
  formerName?: string | null
  yearAdmission: number
  yearGraduation?: number | null
  className?: string | null
  batch?: string | null
  house?: string | null
  country?: string | null
}

export interface VerifiedAlumni {
  alumniRecordId: string
  fullName: string
  yearGraduation: number | null
  batch: string | null
}

export interface ManualVerificationResult {
  verificationRequestId: string
  fullName: string
}

interface Props {
  onAlumniVerified: (alumni: VerifiedAlumni) => void
  onManualVerification: (result: ManualVerificationResult) => void
}

type ViewState = 'search' | 'results' | 'no-match' | 'manual-submitted'

export function StepVerification({ onAlumniVerified, onManualVerification }: Props) {
  const [view, setView] = useState<ViewState>('search')
  const [results, setResults] = useState<AlumniRecord[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchForm>({ resolver: zodResolver(schema) })

  const onSearch = async (data: SearchForm) => {
    setSearching(true)
    setSearchError('')
    try {
      const res = await fetch('/api/alumni/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          year: data.year ? Number(data.year) : undefined,
          batch: data.batch || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error('Search failed')
      setResults(json.results)
      setView(json.results.length > 0 ? 'results' : 'no-match')
    } catch {
      setSearchError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleSelectAlumni = (id: string) => {
    const record = results.find(r => r.id === id)
    if (!record) return
    onAlumniVerified({
      alumniRecordId: record.id,
      fullName: record.fullName,
      yearGraduation: record.yearGraduation ?? null,
      batch: record.batch ?? null,
    })
  }

  const handleManualSubmitted = (result: ManualVerificationResult) => {
    setView('manual-submitted')
    onManualVerification(result)
  }

  if (view === 'manual-submitted') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">📬</div>
        <h3 className="font-playfair text-2xl font-bold text-neutral-900 mb-3">
          Request Submitted!
        </h3>
        <p className="text-neutral-600 max-w-md mx-auto mb-6">
          Our team will verify your alumni status and contact you at your email within{' '}
          <strong>48 hours</strong>.
        </p>
        <p className="text-sm text-neutral-500">
          Questions? Email{' '}
          <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>
            yoloreunion@gmail.com
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-1">
          Verify Your Alumni Status
        </h2>
        <p className="text-neutral-600 text-sm">
          Search our SHEDESA alumni database to confirm your identity.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
        <div>
          <Label>
            Your Name <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register('name')}
            placeholder="Enter your name as it appeared at school"
            className="mt-1"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Graduation Year{' '}
              <span className="text-neutral-400 font-normal">(optional)</span>
            </Label>
            <Input {...register('year')} placeholder="e.g. 1998" className="mt-1" />
          </div>
          <div>
            <Label>
              Batch <span className="text-neutral-400 font-normal">(optional)</span>
            </Label>
            <Input {...register('batch')} placeholder="e.g. 1998" className="mt-1" />
          </div>
        </div>
        {searchError && <p className="text-red-500 text-sm">{searchError}</p>}
        <button
          type="submit"
          disabled={searching}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: '#8B1A1A' }}
        >
          {searching ? 'Searching...' : '🔍 Search Alumni Database'}
        </button>
      </form>

      {view === 'results' && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-700">
            {results.length} result{results.length !== 1 ? 's' : ''} found — select yourself to
            continue:
          </p>
          {results.map(r => (
            <AlumniSearchResult key={r.id} record={r} onSelect={handleSelectAlumni} />
          ))}
          <button
            onClick={() => setView('no-match')}
            className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-700 underline"
          >
            I don&apos;t see my name in the list
          </button>
        </div>
      )}

      {view === 'no-match' && (
        <div className="space-y-4">
          <div className="rounded-lg p-4 border border-neutral-200 bg-neutral-50">
            <p className="text-sm text-neutral-700">
              No matching records found. You can{' '}
              <button
                onClick={() => setView('search')}
                className="underline font-medium"
                style={{ color: '#8B1A1A' }}
              >
                search again
              </button>{' '}
              or submit a manual verification request below.
            </p>
          </div>
          <ManualVerificationForm onSubmitted={handleManualSubmitted} />
        </div>
      )}
    </div>
  )
}
