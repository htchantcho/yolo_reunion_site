import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

// Base fee: 35,000 XAF
// EUR is fixed (XAF pegged to EUR at 655.957). USD and NGN are approximate.
export const CURRENCY_OPTIONS = {
  eur: { amount: 5400,   label: 'EUR', display: '54 EUR'         },  // 35,000 ÷ 655.957 = 53.36 → 54
  usd: { amount: 6000,   label: 'USD', display: '60 USD'         },  // ~35,000 XAF at ~0.0017 USD/XAF
  ngn: { amount: 9500000, label: 'NGN', display: '95,000 NGN'    },  // ~35,000 XAF at ~2.7 NGN/XAF (in kobo: ×100)
} as const

export type SupportedCurrency = keyof typeof CURRENCY_OPTIONS

export const DEFAULT_CURRENCY: SupportedCurrency = 'eur'

export function getCurrencyOption(currency: string): typeof CURRENCY_OPTIONS[SupportedCurrency] {
  const key = currency.toLowerCase() as SupportedCurrency
  return CURRENCY_OPTIONS[key] ?? CURRENCY_OPTIONS[DEFAULT_CURRENCY]
}
