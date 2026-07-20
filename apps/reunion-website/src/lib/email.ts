import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendRegistrationConfirmation({
  to,
  fullName,
  registrationId,
  classYear,
  guests = [],
}: {
  to: string
  fullName: string
  registrationId: string
  classYear: string
  guests?: { name: string; id: string }[]
}) {
  const calendarUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar?regId=${registrationId}`
  const payUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register/success?regId=${registrationId}`

  const guestRows = guests.length > 0
    ? `<tr>
        <td style="color:#888;font-size:13px;vertical-align:top;padding-top:4px">Guest Passes</td>
        <td style="font-size:13px">
          ${guests.map(g => `<div style="margin-bottom:4px"><span style="color:#333">${g.name}</span> — <span style="font-family:monospace;font-weight:700;color:#B7960C">${g.id}</span></div>`).join('')}
        </td>
      </tr>`
    : ''

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%">

        <tr>
          <td style="background:#2D6A4F;padding:32px;text-align:center">
            <h1 style="color:#F4D03F;margin:0;font-size:24px;letter-spacing:1px">SHEDESA REUNION 2026</h1>
            <p style="color:#a8d8c0;margin:8px 0 0;font-size:14px">Sacred Heart College Douala</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px">
            <p style="color:#333;font-size:16px;margin:0 0 16px">Dear <strong>${fullName}</strong>,</p>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px">
              Thank you for registering for the <strong>SHEDESA Reunion 2026</strong>! We are thrilled to have you join us as we reconnect with fellow alumni of Sacred Heart College Douala.
            </p>

            <!-- Registration ID box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
              <tr>
                <td style="background:#f0f8f4;border:2px solid #2D6A4F;border-radius:8px;padding:20px;text-align:center">
                  <p style="color:#2D6A4F;font-size:12px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;text-transform:uppercase">Your Registration ID</p>
                  <p style="color:#2D6A4F;font-size:28px;font-weight:bold;margin:0;letter-spacing:3px;font-family:monospace">${registrationId}</p>
                  <p style="color:#888;font-size:12px;margin:8px 0 0">Keep this for payment and check-in</p>
                </td>
              </tr>
            </table>

            <!-- Event + guest details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e0e0e0;border-radius:8px">
              <tr><td style="background:#fafafa;padding:14px 16px;border-radius:8px 8px 0 0">
                <p style="color:#2D6A4F;font-size:13px;font-weight:bold;margin:0;text-transform:uppercase;letter-spacing:0.5px">Booking Summary</p>
              </td></tr>
              <tr><td style="padding:16px">
                <table width="100%" cellpadding="5" cellspacing="0" style="font-size:13px;color:#374151">
                  <tr>
                    <td style="color:#6b7280;width:130px">Date</td>
                    <td style="font-weight:bold;color:#333">December 19, 2026</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280">Location</td>
                    <td style="font-weight:bold;color:#333">Douala, Cameroon</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280">Class Year</td>
                    <td style="font-weight:bold;color:#333">${classYear}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280">Fee</td>
                    <td style="font-weight:bold;color:#333">25,000 XAF / person</td>
                  </tr>
                  ${guestRows}
                </table>
              </td></tr>
            </table>

            <!-- Pay Now -->
            <p style="color:#333;font-size:14px;font-weight:bold;margin:0 0 10px">Complete Your Payment</p>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px">
              Your spot is not confirmed until payment is received. Choose MTN Mobile Money or Orange Money:
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 20px">
              <tr>
                <td style="background:#B7960C;border-radius:6px;padding:14px 28px">
                  <a href="${payUrl}" style="color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">Pay Now — 25,000 XAF / person →</a>
                </td>
              </tr>
            </table>

            <!-- Calendar -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
              <tr>
                <td style="background:#2D6A4F;border-radius:6px;padding:12px 24px">
                  <a href="${calendarUrl}" style="color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none">📅 Add to Calendar</a>
                </td>
              </tr>
            </table>

            <p style="color:#555;font-size:14px;margin:0">
              Questions? Email us at
              <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f5f5f5;padding:20px;text-align:center;border-top:1px solid #e0e0e0">
            <p style="color:#aaa;font-size:12px;margin:0">SHEDESA Reunion 2026 &mdash; Sacred Heart College Douala Alumni</p>
            <p style="color:#aaa;font-size:12px;margin:4px 0 0">
              <a href="https://shedesareunion.com" style="color:#2D6A4F;text-decoration:none">shedesareunion.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'yoloreunion@gmail.com',
    to,
    subject: `Registration Confirmed — SHEDESA Reunion 2026 (${registrationId})`,
    html,
  })
}

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? 'yoloreunion@gmail.com'

export async function notifyAdminNewRegistration({
  fullName,
  email,
  phone,
  country,
  classYear,
  guestCount,
  registrationId,
  adminUrl,
}: {
  fullName: string
  email: string
  phone: string
  country: string
  classYear: string
  guestCount: number
  registrationId: string
  adminUrl: string
}) {
  const html = `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
  <div style="background:#2D6A4F;padding:20px 24px">
    <h2 style="color:#F4D03F;margin:0;font-size:18px">New Registration — SHEDESA 2026</h2>
  </div>
  <div style="padding:24px">
    <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#374151">
      <tr><td style="color:#6b7280;width:140px">Registration ID</td><td style="font-family:monospace;font-weight:700;color:#2D6A4F">${registrationId}</td></tr>
      <tr><td style="color:#6b7280">Name</td><td><strong>${fullName}</strong></td></tr>
      <tr><td style="color:#6b7280">Email</td><td>${email}</td></tr>
      <tr><td style="color:#6b7280">Phone</td><td>${phone}</td></tr>
      <tr><td style="color:#6b7280">Country</td><td>${country}</td></tr>
      <tr><td style="color:#6b7280">Class Year</td><td>${classYear}</td></tr>
      <tr><td style="color:#6b7280">Guests</td><td>${guestCount}</td></tr>
    </table>
    <div style="margin-top:20px">
      <a href="${adminUrl}" style="display:inline-block;background:#2D6A4F;color:#fff;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none">View in Admin →</a>
    </div>
  </div>
</div>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'yoloreunion@gmail.com',
    to: ADMIN_EMAIL,
    subject: `[SHEDESA] New registration: ${fullName} (${registrationId})`,
    html,
  })
}

export async function sendPaymentConfirmed({
  to,
  fullName,
  registrationId,
  amount,
  currency,
}: {
  to: string
  fullName: string
  registrationId: string
  amount: string
  currency: string
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%">
        <tr>
          <td style="background:#2D6A4F;padding:32px;text-align:center">
            <h1 style="color:#F4D03F;margin:0;font-size:24px;letter-spacing:1px">SHEDESA REUNION 2026</h1>
            <p style="color:#a8d8c0;margin:8px 0 0;font-size:14px">Sacred Heart College Douala</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;text-align:center">
            <div style="font-size:56px;margin-bottom:16px">🎉</div>
            <h2 style="color:#111827;font-size:22px;margin:0 0 12px">Payment Confirmed!</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px">
              Dear <strong>${fullName}</strong>, your payment has been received and your spot at the <strong>SHEDESA Reunion 2026</strong> is confirmed.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;max-width:360px">
              <tr>
                <td style="background:#f0f8f4;border:2px solid #2D6A4F;border-radius:8px;padding:20px;text-align:center">
                  <p style="color:#2D6A4F;font-size:12px;font-weight:bold;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Amount Paid</p>
                  <p style="color:#2D6A4F;font-size:26px;font-weight:bold;margin:0 0 6px">${amount} ${currency}</p>
                  <p style="color:#888;font-size:12px;margin:0">Ref: ${registrationId}</p>
                </td>
              </tr>
            </table>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 8px">We look forward to seeing you on <strong>December 19, 2026</strong> in Douala!</p>
            <p style="color:#888;font-size:13px;margin:0">Questions? <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a></p>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f5f5;padding:20px;text-align:center;border-top:1px solid #e0e0e0">
            <p style="color:#aaa;font-size:12px;margin:0">SHEDESA Reunion 2026 &mdash; Sacred Heart College Douala Alumni</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'yoloreunion@gmail.com',
    to,
    subject: `Payment Confirmed — SHEDESA Reunion 2026 (${registrationId})`,
    html,
  })
}

export async function sendVerificationApprovedReminder({
  to,
  fullName,
  appUrl,
}: {
  to: string
  fullName: string
  appUrl: string
}) {
  const registerUrl = `${appUrl}/register`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%">

        <tr>
          <td style="background:#2D6A4F;padding:32px;text-align:center">
            <h1 style="color:#F4D03F;margin:0;font-size:24px;letter-spacing:1px">SHEDESA REUNION 2026</h1>
            <p style="color:#a8d8c0;margin:8px 0 0;font-size:14px">Sacred Heart College Douala</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px">
            <p style="color:#333;font-size:16px;margin:0 0 16px">Dear <strong>${fullName}</strong>,</p>

            <div style="background:#f0fdf4;border:2px solid #2D6A4F;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px">
              <p style="color:#2D6A4F;font-size:20px;font-weight:bold;margin:0 0 6px">✓ You Have Been Verified!</p>
              <p style="color:#555;font-size:14px;margin:0">Your alumni status has been confirmed. You can now complete your registration.</p>
            </div>

            <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 20px">
              You are now cleared to register for the <strong>SHEDESA Reunion 2026</strong> on December 19, 2026 in Douala, Cameroon.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px">
              <tr>
                <td style="background:#2D6A4F;border-radius:6px;padding:14px 32px">
                  <a href="${registerUrl}" style="color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none">Register Now →</a>
                </td>
              </tr>
            </table>

            <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;padding:20px;margin:0 0 24px">
              <p style="color:#92400E;font-size:13px;font-weight:bold;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px">
                ⚠ How to Search the Alumni Records
              </p>
              <p style="color:#78350F;font-size:14px;line-height:1.7;margin:0 0 10px">
                When you arrive at the registration page, you will be asked to search for your name in our alumni database. <strong>Use only one of your names at a time</strong> — do not enter your full name as our records may contain spelling variations.
              </p>
              <p style="color:#78350F;font-size:14px;line-height:1.7;margin:0 0 10px">
                <strong>Example:</strong> If your name is <em>Jean Samuel Tonye</em>, first search <strong>Jean</strong> only. If nothing comes up, try <strong>Samuel</strong> only, then try <strong>Tonye</strong> only.
              </p>
              <p style="color:#78350F;font-size:14px;margin:0">
                If none of your names find a match, select <em>"I don't see my name in the list"</em> and your verified status will still be on record.
              </p>
            </div>

            <p style="color:#555;font-size:14px;line-height:1.7;margin:0">
              Questions? Reply to this email or contact us at
              <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f5f5f5;padding:20px;text-align:center;border-top:1px solid #e0e0e0">
            <p style="color:#aaa;font-size:12px;margin:0">SHEDESA Reunion 2026 &mdash; Sacred Heart College Douala Alumni</p>
            <p style="color:#aaa;font-size:12px;margin:4px 0 0">
              <a href="https://shedesareunion.com" style="color:#2D6A4F;text-decoration:none">shedesareunion.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'yoloreunion@gmail.com',
    to,
    subject: `You're Verified — Register Now for SHEDESA Reunion 2026`,
    html,
  })
}
