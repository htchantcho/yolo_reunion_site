import { EVENT, PAYMENT_NUMBERS } from '@/lib/constants'

// Pre-filled WhatsApp / email / Gmail links so payers can ask for the account
// holder's name before sending and share their receipt afterwards.
// Used by the payment pages and the payment/vendor emails.
export function paymentContactLinks({ id, isVendor, method }: {
  id: string
  isVendor: boolean
  method?: string
}) {
  const idLabel = isVendor ? 'vendor ID' : 'registration ID'
  const event = isVendor ? 'SHEDESA Trade Fair 2026' : 'SHEDESA Reunion 2026'
  const subject = `${event} payment - ${id}`
  const message =
    `Hello, I registered for the ${event} (${idLabel}: ${id}). ` +
    `I am paying by ${method ?? 'Mobile Money'}. Could you please confirm the name on the account I should send the payment to? ` +
    `I will share my payment receipt here once sent. Thank you.`
  const email = EVENT.contactEmail
  const q = (s: string) => encodeURIComponent(s)

  return {
    idLabel,
    whatsappNumber: PAYMENT_NUMBERS.whatsapp,
    email,
    whatsappHref: `https://wa.me/${PAYMENT_NUMBERS.whatsapp.replace(/\D/g, '')}?text=${q(message)}`,
    mailHref: `mailto:${email}?subject=${q(subject)}&body=${q(message)}`,
    gmailHref: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${q(subject)}&body=${q(message)}`,
  }
}
