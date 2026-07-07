'use client'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export interface GuestPass { name: string; id: string }

interface Props {
  registrationId: string
  fullName: string
  guests: GuestPass[]
}

export function StepConfirm({ registrationId, fullName, guests }: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-5xl">🎉</div>

      <div>
        <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-2">
          You&apos;re Registered!
        </h2>
        <p className="text-neutral-600">
          Welcome, {fullName}. Your registration for the SHEDESA Reunion 2026 has been received.
        </p>
      </div>

      {/* Main pass */}
      <div
        className="rounded-xl p-5 mx-auto max-w-sm"
        style={{ background: '#F0F7F4', border: '2px solid #8B1A1A' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#8B1A1A' }}>
          Your Registration ID
        </p>
        <p className="text-2xl font-bold font-mono tracking-wider text-neutral-900">
          {registrationId}
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Keep this ID — you will need it for payment and check-in.
        </p>
      </div>

      {/* Guest passes */}
      {guests.length > 0 && (
        <div className="rounded-xl p-5 mx-auto max-w-sm text-left" style={{ background: '#FBF7E8', border: '1px solid #F5EBC5' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#7A1A1A' }}>
            Guest Passes
          </p>
          <div className="space-y-3">
            {guests.map((g, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-700 truncate">{g.name}</span>
                <span className="text-sm font-bold font-mono text-neutral-900 whitespace-nowrap">{g.id}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Each guest must present their ID at check-in.
          </p>
        </div>
      )}

      {/* Next steps */}
      <div className="rounded-lg p-4 text-left space-y-3" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <p className="font-semibold text-sm text-neutral-700">Next Steps</p>
        <ul className="text-sm text-neutral-600 space-y-2">
          <li className="flex gap-2">
            <span style={{ color: '#8B1A1A' }}>1.</span>
            <span>Pay your registration fee below (25,000 XAF per person).</span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: '#8B1A1A' }}>2.</span>
            <span>Your spot is confirmed once payment is received.</span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: '#8B1A1A' }}>3.</span>
            <span>
              Questions? Email{' '}
              <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }} className="underline">
                yoloreunion@gmail.com
              </a>
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/api/calendar?regId=${registrationId}`}
          className={buttonVariants({ variant: 'outline' })}
        >
          Download Calendar Invite
        </Link>
        <Link
          href={`/register/success?regId=${registrationId}`}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
          style={{ background: '#8B1A1A' }}
        >
          Pay Now →
        </Link>
      </div>

      <Link
        href="/"
        className="block text-sm text-neutral-500 underline"
      >
        Back to Home
      </Link>
    </div>
  )
}
