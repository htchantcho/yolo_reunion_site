import { NextRequest, NextResponse } from 'next/server'
import { stripe, getCurrencyOption, type SupportedCurrency } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { registrationId, currency = 'eur' } = await req.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId required' }, { status: 400 })
    }

    const registration = await db.registration.findUnique({
      where: { registrationId },
    })

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    if (registration.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Already paid' }, { status: 409 })
    }

    const option = getCurrencyOption(currency)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shedesareunion.com'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: option.label.toLowerCase(),
            unit_amount: option.amount,
            product_data: {
              name: 'SHEDESA Reunion 2026 — Registration Fee',
              description: `35,000 XAF (${option.display}) · Ref: ${registrationId}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId,
        currency: option.label,
      },
      customer_email: registration.email,
      success_url: `${appUrl}/register/success?paid=1&session_id={CHECKOUT_SESSION_ID}&regId=${registrationId}`,
      cancel_url: `${appUrl}/register/success?regId=${registrationId}&cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[Stripe Checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
