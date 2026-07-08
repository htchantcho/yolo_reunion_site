export interface ExchangeRates {
  USD: number
  EUR: number
  GBP: number
  CAD: number
  fetchedAt: number
}

let cache: ExchangeRates | null = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function getXafRates(): Promise<ExchangeRates | null> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) return cache
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/XAF', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return cache
    const data = await res.json()
    const rates = data.rates as Record<string, number>
    cache = {
      USD: rates.USD,
      EUR: rates.EUR,
      GBP: rates.GBP,
      CAD: rates.CAD,
      fetchedAt: Date.now(),
    }
    return cache
  } catch {
    return cache
  }
}

export function formatFeeEquivalents(xafAmount: number, rates: ExchangeRates): string {
  const fmt = (val: number, symbol: string) =>
    `${symbol}${Math.round(xafAmount * val).toLocaleString()}`
  const parts = [
    fmt(rates.USD, '$'),
    fmt(rates.EUR, '€'),
    fmt(rates.GBP, '£'),
  ]
  return parts.join(' / ')
}
