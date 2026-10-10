import { paymentContactLinks } from '@/lib/payment-contact'

export default function PaymentContactLinks({ id, isVendor, method, color }: {
  id: string
  isVendor: boolean
  method?: string
  color: string
}) {
  const c = paymentContactLinks({ id, isVendor, method })
  const linkStyle = { color, fontWeight: 600, textDecoration: 'underline' }

  return (
    <p className="text-xs" style={{ color }}>
      Need the account holder&apos;s name before sending? After sending, share your receipt screenshot with your {c.idLabel}.
      Contact us on WhatsApp{' '}
      <a href={c.whatsappHref} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {c.whatsappNumber}
      </a>{' '}
      or email{' '}
      <a href={c.mailHref} style={linkStyle}>
        {c.email}
      </a>{' '}
      (<a href={c.gmailHref} target="_blank" rel="noopener noreferrer" style={linkStyle}>open in Gmail</a>).
    </p>
  )
}
