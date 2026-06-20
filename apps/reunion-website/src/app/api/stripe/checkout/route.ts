import { NextRequest, NextResponse } from 'next/server'
import { stripe, calcTotal } from '@/lib/stripe'
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

    const { people, totalAmount, label, amountPerPerson } = calcTotal(currency, registration.guestCount)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://shedesareunion.com'

    const guestLine = registration.guestCount > 0
      ? ` · ${registration.guestCount} guest${registration.guestCount > 1 ? 's' : ''} included`
      : ''

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: label.toLowerCase(),
            unit_amount: amountPerPerson,
            product_data: {
              name: 'SHEDESA Reunion 2026 — Registration Fee',
              description: `35,000 XAF/person × ${people} person${people > 1 ? 's' : ''}${guestLine} · Ref: ${registrationId}`,
            },
          },
          quantity: people,
        },
      ],
      metadata: {
        registrationId,
        currency: label,
        guestCount: String(registration.guestCount),
        totalAmount: String(totalAmount),
      },
      customer_email: registration.email,
      success_url: `${appUrl}/register/success?paid=1&session_id={CHECKOUT_SESSION_ID}&regId=${registrationId}`,
      cancel_url: `${appUrl}/register/success?regId=${registrationId}&cancelled=1`,
    })

    return NextResponse.json({ url: session.url, totalAmount, currency: label, people })
  } catch (err) {
    console.error('[Stripe Checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
