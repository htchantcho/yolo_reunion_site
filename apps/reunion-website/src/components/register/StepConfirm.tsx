'use client'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  registrationId: string
  fullName: string
}

export function StepConfirm({ registrationId, fullName }: Props) {
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

      <div
        className="rounded-xl p-6 mx-auto max-w-sm"
        style={{ background: '#F0F7F4', border: '2px solid #2D6A4F' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#2D6A4F' }}>
          Registration ID
        </p>
        <p className="text-2xl font-bold font-mono tracking-wider text-neutral-900">
          {registrationId}
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Keep this ID — you will need it for payment and check-in.
        </p>
      </div>

      <div className="rounded-lg p-4 text-left space-y-3" style={{ background: '#FBF7E8', border: '1px solid #F5EBC5' }}>
        <p className="font-semibold text-sm" style={{ color: '#92660a' }}>
          Next Steps
        </p>
        <ul className="text-sm text-neutral-700 space-y-2">
          <li className="flex gap-2">
            <span style={{ color: '#B7960C' }}>1.</span>
            <span>
              Payment instructions (25,000 XAF) will be sent to your email within 24 hours.
            </span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: '#B7960C' }}>2.</span>
            <span>
              Your registration will be confirmed once payment is received.
            </span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: '#B7960C' }}>3.</span>
            <span>
              Questions? Email{' '}
              <a
                href="mailto:yoloreunion@gmail.com"
                style={{ color: '#2D6A4F' }}
                className="underline"
              >
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
          href="/"
          className={buttonVariants({ variant: 'default' })}
          style={{ background: '#2D6A4F' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
