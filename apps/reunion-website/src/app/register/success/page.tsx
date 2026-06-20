import { Suspense } from 'react'
import SuccessContent from './SuccessContent'

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<div className="py-16 min-h-screen flex items-center justify-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  )
}
