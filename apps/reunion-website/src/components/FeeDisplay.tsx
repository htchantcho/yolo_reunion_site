import { getXafRates, formatFeeEquivalents } from '@/lib/exchange-rate'
import { EVENT } from '@/lib/constants'

export async function FeeDisplay() {
  const rates = await getXafRates()
  const equiv = rates ? formatFeeEquivalents(EVENT.registrationFee, rates) : null

  return (
    <span>
      {EVENT.registrationFeeDisplay} per person
      {equiv && (
        <span style={{ color: '#6b7280', fontWeight: 400 }}> — approx. {equiv}</span>
      )}
    </span>
  )
}
