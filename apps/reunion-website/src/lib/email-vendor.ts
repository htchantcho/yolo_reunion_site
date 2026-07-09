import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendVendorConfirmation({
  to,
  fullName,
  vendorId,
  businessName,
}: {
  to: string
  fullName: string
  vendorId: string
  businessName: string
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
          <h1 style="color:#F4D03F;margin:0;font-size:22px">SHEDESA TRADE FAIR 2026</h1>
          <p style="color:#a8d8c0;margin:6px 0 0;font-size:13px">December 18, 2026 &mdash; Vendor Registration</p>
        </td></tr>
        <tr><td style="padding:28px">
          <p style="color:#333;font-size:15px;margin:0 0 16px">Dear <strong>${fullName}</strong>,</p>
          <div style="background:#d1fae5;border-left:4px solid #16a34a;padding:14px 18px;border-radius:0 6px 6px 0;margin:0 0 20px">
            <p style="color:#14532d;font-weight:700;font-size:14px;margin:0">Your spot has been reserved!</p>
            <p style="color:#166534;font-size:13px;margin:4px 0 0">Business: <strong>${businessName}</strong></p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:0 0 20px">
            <p style="color:#2D6A4F;font-weight:bold;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px">Your Vendor ID</p>
            <p style="font-family:monospace;font-size:24px;font-weight:bold;color:#2D6A4F;margin:0">${vendorId}</p>
          </div>
          <p style="color:#333;font-size:14px;font-weight:bold;margin:0 0 12px">Complete Your Payment &mdash; 5,000 XAF</p>
          <p style="color:#555;font-size:13px;line-height:1.6;margin:0 0 16px">
            To confirm your spot at the trade fair, please send <strong>5,000 XAF</strong> using MTN Mobile Money or Orange Money. Use your Vendor ID as the payment reference.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:separate;border-spacing:0 8px">
            <tr><td style="padding:14px 16px;background:#fff8e1;border-radius:8px">
              <p style="color:#92400e;font-weight:bold;font-size:13px;margin:0 0 4px">&#128242; MTN Mobile Money</p>
              <p style="color:#78350f;font-size:13px;margin:0">Send to: <strong>+237 6XX XXX XXX</strong><br>Reference: <strong>${vendorId}</strong></p>
            </td></tr>
            <tr><td style="padding:14px 16px;background:#fff3e0;border-radius:8px">
              <p style="color:#92400e;font-weight:bold;font-size:13px;margin:0 0 4px">&#128241; Orange Money</p>
              <p style="color:#78350f;font-size:13px;margin:0">Send to: <strong>+237 6XX XXX XXX</strong><br>Reference: <strong>${vendorId}</strong></p>
            </td></tr>
          </table>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 16px">
            After payment, send your confirmation screenshot and vendor ID to:<br>
            WhatsApp: <strong>+12402716512</strong> or email: <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a>
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin:0 0 16px">
            <p style="color:#14532d;font-size:13px;margin:0;line-height:1.6">
              <strong>Event Details</strong><br>
              Date: December 18, 2026<br>
              Alongside the SHEDESA Alumni Football Game<br>
              Spots are limited &mdash; first paid, first confirmed.
            </p>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin:0">Questions? Contact us at <a href="mailto:yoloreunion@gmail.com" style="color:#2D6A4F">yoloreunion@gmail.com</a></p>
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
    subject: `Trade Fair Spot Reserved — SHEDESA 2026 (${vendorId})`,
    html,
  })
}
