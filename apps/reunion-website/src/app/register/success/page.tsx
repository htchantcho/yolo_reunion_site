import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function RegisterSuccessPage() {
  return (
    <div className="py-16 min-h-screen" style={{ background: '#fafafa' }}>
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📬</div>
          <h1 className="font-playfair text-3xl font-bold text-neutral-900 mb-3">
            Registration Received
          </h1>
          <p className="text-neutral-600 mb-6">
            Thank you for registering for the SHEDESA Reunion 2026. We have received your submission
            and will be in touch shortly.
          </p>

          <div
            className="rounded-xl p-5 mb-6 text-left"
            style={{ background: '#F0F7F4', border: '1px solid #A8D5C2' }}
          >
            <p className="font-semibold text-sm mb-2" style={{ color: '#2D6A4F' }}>
              What happens next?
            </p>
            <ul className="text-sm text-neutral-700 space-y-2">
              <li className="flex gap-2">
                <span style={{ color: '#B7960C' }}>1.</span>
                <span>Check your email for a confirmation and your registration ID.</span>
              </li>
              <li className="flex gap-2">
                <span style={{ color: '#B7960C' }}>2.</span>
                <span>Payment instructions (25,000 XAF) will be included in that email.</span>
              </li>
              <li className="flex gap-2">
                <span style={{ color: '#B7960C' }}>3.</span>
                <span>Your spot is confirmed once payment is received.</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-neutral-500 mb-8">
            Questions? Email{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#2D6A4F' }} className="underline">
              yoloreunion@gmail.com
            </a>
          </p>

          <Link
            href="/"
            className={buttonVariants({ variant: 'default' })}
            style={{ background: '#2D6A4F' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
