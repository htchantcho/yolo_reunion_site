import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendPaymentInstructions({
  to,
  fullName,
  registrationId,
}: {
  to: string
  fullName: string
  registrationId: string
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%">
        <tr><td style="background:#2D6A4F;padding:28px;text-align:center">
          <h1 style="color:#F4D03F;margin:0;font-size:22px">SHEDESA REUNION 2026</h1>
          <p style="color:#a8d8c0;margin:6px 0 0;font-size:13px">Payment Instructions</p>
        </td></tr>
        <tr><td style="padding:28px">
          <p style="color:#333;font-size:15px;margin:0 0 16px">Dear <strong>${fullName}</strong>,</p>
          <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 20px">
            Your SHEDESA Reunion 2026 registration has been verified. Please complete your payment of <strong>35,000 XAF</strong> using one of the methods below.
          </p>
          <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:0 0 20px">
            <p style="color:#2D6A4F;font-weight:bold;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px">Your Registration ID</p>
            <p style="font-family:monospace;font-size:22px;font-weight:bold;color:#2D6A4F;margin:0">${registrationId}</p>
          </div>
          <p style="color:#333;font-size:14px;font-weight:bold;margin:0 0 12px">Payment Methods — 35,000 XAF</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
            <tr><td style="padding:12px;background:#fff8e1;border-radius:8px;margin-bottom:10px;display:block">
              <p style="color:#92400e;font-weight:bold;font-size:13px;margin:0 0 4px">MTN Mobile Money</p>
              <p style="color:#78350f;font-size:13px;margin:0">Send to: <strong>+237 6XX XXX XXX</strong><br>Reference: <strong>${registrationId}</strong></p>
            </td></tr>
            <tr><td style="padding:12px;background:#fff3e0;border-radius:8px">
              <p style="color:#92400e;font-weight:bold;font-size:13px;margin:0 0 4px">Orange Money</p>
              <p style="color:#78350f;font-size:13px;margin:0">Send to: <strong>+237 6XX XXX XXX</strong><br>Reference: <strong>${registrationId}</strong></p>
            </td></tr>
          </table>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 16px">
            After sending payment, reply to this email or WhatsApp <strong>+12402716512</strong> with your payment confirmation screenshot and registration ID.
          </p>
          <p style="color:#555;font-size:13px;margin:0">
            Questions? Email <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a> or WhatsApp <strong>+12402716512</strong>.
          </p>
        </td></tr>
        <tr><td style="background:#f5f5f5;padding:16px;text-align:center;border-top:1px solid #e0e0e0">
          <p style="color:#aaa;font-size:11px;margin:0">SHEDESA Reunion 2026 &mdash; <a href="https://shedesareunion.com" style="color:#2D6A4F;text-decoration:none">shedesareunion.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'yoloreunion@gmail.com',
    to,
    subject: `Payment Instructions — SHEDESA Reunion 2026 (${registrationId})`,
    html,
  })
}
