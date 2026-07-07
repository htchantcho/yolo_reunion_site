import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

// Base fee per person: 25,000 XAF
// EUR is fixed (XAF pegged to EUR at 655.957). USD and NGN are approximate.
export const CURRENCY_OPTIONS = {
  eur: { amountPerPerson: 3800,    label: 'EUR', perPersonDisplay: '38 EUR'        },
  usd: { amountPerPerson: 4300,    label: 'USD', perPersonDisplay: '43 USD'        },
  ngn: { amountPerPerson: 6750000, label: 'NGN', perPersonDisplay: '67,500 NGN'   },
} as const

export type SupportedCurrency = keyof typeof CURRENCY_OPTIONS

export const DEFAULT_CURRENCY: SupportedCurrency = 'eur'

export function getCurrencyOption(currency: string) {
  const key = currency.toLowerCase() as SupportedCurrency
  return CURRENCY_OPTIONS[key] ?? CURRENCY_OPTIONS[DEFAULT_CURRENCY]
}

// Total = (1 registrant + N guests) × base price per person
export function calcTotal(currency: string, guestCount: number) {
  const option = getCurrencyOption(currency)
  const people = 1 + guestCount
  return {
    ...option,
    people,
    totalAmount: option.amountPerPerson * people,
  }
}

export function formatCurrencyAmount(currency: string, amountInSmallestUnit: number): string {
  // NGN (kobo = 1/100), EUR (cents = 1/100), USD (cents = 1/100)
  const major = amountInSmallestUnit / 100
  const fmt = new Intl.NumberFormat('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return `${fmt.format(major)} ${currency.toUpperCase()}`
}
