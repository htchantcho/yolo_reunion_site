import { NextResponse } from 'next/server'
import { getXafRates } from '@/lib/exchange-rate'

export const revalidate = 3600

export async function GET() {
  const rates = await getXafRates()
  if (!rates) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
  return NextResponse.json(rates)
}
