import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const registrationId = session.metadata?.registrationId

    if (!registrationId) {
      console.error('[Webhook] No registrationId in session metadata')
      return NextResponse.json({ error: 'No registrationId' }, { status: 400 })
    }

    const registration = await db.registration.findUnique({ where: { registrationId } })
    if (!registration) {
      console.error('[Webhook] Registration not found:', registrationId)
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    const amountPaid = session.amount_total ?? 0
    const currency = session.currency?.toUpperCase() ?? 'EUR'

    await db.$transaction([
      db.payment.create({
        data: {
          registrationId: registration.id,
          amount: amountPaid,
          currency,
          method: 'CARD',
          status: 'PAID',
          providerRef: session.id,
          receiptUrl: session.payment_intent
            ? `https://dashboard.stripe.com/payments/${session.payment_intent}`
            : null,
          providerData: session as object,
        },
      }),
      db.registration.update({
        where: { id: registration.id },
        data: {
          paymentStatus: 'PAID',
          status: 'PAID',
        },
      }),
    ])

    console.log(`[Webhook] Payment confirmed for ${registrationId}`)
  }

  return NextResponse.json({ received: true })
}
