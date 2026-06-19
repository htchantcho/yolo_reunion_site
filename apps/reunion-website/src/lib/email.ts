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
}: {
  to: string
  fullName: string
  registrationId: string
  classYear: string
}) {
  const calendarUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar?regId=${registrationId}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#2D6A4F;padding:32px;text-align:center">
            <h1 style="color:#F4D03F;margin:0;font-size:24px;letter-spacing:1px">SHEDESA REUNION 2026</h1>
            <p style="color:#a8d8c0;margin:8px 0 0;font-size:14px">Sacred Heart College Douala</p>
          </td>
        </tr>

        <!-- Body -->
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
                  <p style="color:#888;font-size:12px;margin:8px 0 0">Keep this for your records</p>
                </td>
              </tr>
            </table>

            <!-- Event details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e0e0e0;border-radius:8px">
              <tr><td style="background:#fafafa;padding:16px;border-radius:8px 8px 0 0">
                <p style="color:#2D6A4F;font-size:13px;font-weight:bold;margin:0;text-transform:uppercase;letter-spacing:0.5px">Event Details</p>
              </td></tr>
              <tr><td style="padding:16px">
                <table width="100%" cellpadding="4" cellspacing="0">
                  <tr>
                    <td style="color:#888;font-size:13px;width:120px">Date</td>
                    <td style="color:#333;font-size:13px;font-weight:bold">December 19, 2026</td>
                  </tr>
                  <tr>
                    <td style="color:#888;font-size:13px">Location</td>
                    <td style="color:#333;font-size:13px;font-weight:bold">Douala, Cameroon</td>
                  </tr>
                  <tr>
                    <td style="color:#888;font-size:13px">Class Year</td>
                    <td style="color:#333;font-size:13px;font-weight:bold">${classYear}</td>
                  </tr>
                  <tr>
                    <td style="color:#888;font-size:13px">Fee</td>
                    <td style="color:#333;font-size:13px;font-weight:bold">35,000 XAF</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Next steps -->
            <p style="color:#333;font-size:14px;font-weight:bold;margin:0 0 12px">Next Steps</p>
            <ol style="color:#555;font-size:14px;line-height:1.8;margin:0 0 24px;padding-left:20px">
              <li>You will receive a <strong>payment link by email</strong> within 48 hours to complete your registration fee of 35,000 XAF.</li>
              <li>Once payment is confirmed, your spot is fully secured.</li>
              <li>Add the event to your calendar using the button below.</li>
            </ol>

            <!-- Calendar button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
              <tr>
                <td style="background:#B7960C;border-radius:6px;padding:12px 24px">
                  <a href="${calendarUrl}" style="color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none">📅 Add to Calendar</a>
                </td>
              </tr>
            </table>

            <p style="color:#555;font-size:14px;line-height:1.6;margin:0">
              Questions? Reply to this email or contact us at
              <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a>.<br>
              WhatsApp: <strong>+12402716512</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
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
