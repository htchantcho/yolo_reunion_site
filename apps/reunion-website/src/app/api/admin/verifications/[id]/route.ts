import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { sendRegistrationConfirmation } from '@/lib/email'
import { sendPaymentInstructions } from '@/lib/email-payment'

const schema = z.object({
  action: z.enum(['approve', 'reject']),
  adminNotes: z.string().optional(),
})

function generateRegistrationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'SHEDESA-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

// Ordered longest-prefix first so +1242 (Bahamas) matches before +1 (USA)
const PHONE_PREFIXES: [string, string][] = [
  ['+1242', 'Bahamas'], ['+1246', 'Barbados'], ['+1264', 'Anguilla'],
  ['+1268', 'Antigua'], ['+1284', 'British Virgin Islands'], ['+1340', 'US Virgin Islands'],
  ['+1345', 'Cayman Islands'], ['+1441', 'Bermuda'], ['+1473', 'Grenada'],
  ['+1649', 'Turks and Caicos'], ['+1664', 'Montserrat'], ['+1721', 'Sint Maarten'],
  ['+1758', 'Saint Lucia'], ['+1767', 'Dominica'], ['+1784', 'Saint Vincent'],
  ['+1809', 'Dominican Republic'], ['+1868', 'Trinidad and Tobago'],
  ['+1869', 'Saint Kitts'], ['+1876', 'Jamaica'],
  ['+20', 'Egypt'], ['+212', 'Morocco'], ['+213', 'Algeria'], ['+216', 'Tunisia'],
  ['+218', 'Libya'], ['+220', 'Gambia'], ['+221', 'Senegal'], ['+222', 'Mauritania'],
  ['+223', 'Mali'], ['+224', 'Guinea'], ['+225', 'Ivory Coast'], ['+226', 'Burkina Faso'],
  ['+227', 'Niger'], ['+228', 'Togo'], ['+229', 'Benin'], ['+230', 'Mauritius'],
  ['+231', 'Liberia'], ['+232', 'Sierra Leone'], ['+233', 'Ghana'], ['+234', 'Nigeria'],
  ['+235', 'Chad'], ['+236', 'Central African Republic'], ['+237', 'Cameroon'],
  ['+238', 'Cape Verde'], ['+239', 'Sao Tome'], ['+240', 'Equatorial Guinea'],
  ['+241', 'Gabon'], ['+242', 'Republic of Congo'], ['+243', 'DR Congo'],
  ['+244', 'Angola'], ['+245', 'Guinea-Bissau'], ['+246', 'British Indian Ocean Territory'],
  ['+247', 'Ascension Island'], ['+248', 'Seychelles'], ['+249', 'Sudan'],
  ['+250', 'Rwanda'], ['+251', 'Ethiopia'], ['+252', 'Somalia'], ['+253', 'Djibouti'],
  ['+254', 'Kenya'], ['+255', 'Tanzania'], ['+256', 'Uganda'], ['+257', 'Burundi'],
  ['+258', 'Mozambique'], ['+260', 'Zambia'], ['+261', 'Madagascar'], ['+262', 'Reunion'],
  ['+263', 'Zimbabwe'], ['+264', 'Namibia'], ['+265', 'Malawi'], ['+266', 'Lesotho'],
  ['+267', 'Botswana'], ['+268', 'Eswatini'], ['+269', 'Comoros'],
  ['+27', 'South Africa'], ['+290', 'Saint Helena'], ['+291', 'Eritrea'],
  ['+297', 'Aruba'], ['+298', 'Faroe Islands'], ['+299', 'Greenland'],
  ['+30', 'Greece'], ['+31', 'Netherlands'], ['+32', 'Belgium'], ['+33', 'France'],
  ['+34', 'Spain'], ['+350', 'Gibraltar'], ['+351', 'Portugal'], ['+352', 'Luxembourg'],
  ['+353', 'Ireland'], ['+354', 'Iceland'], ['+355', 'Albania'], ['+356', 'Malta'],
  ['+357', 'Cyprus'], ['+358', 'Finland'], ['+359', 'Bulgaria'],
  ['+36', 'Hungary'], ['+370', 'Lithuania'], ['+371', 'Latvia'], ['+372', 'Estonia'],
  ['+373', 'Moldova'], ['+374', 'Armenia'], ['+375', 'Belarus'], ['+376', 'Andorra'],
  ['+377', 'Monaco'], ['+378', 'San Marino'], ['+380', 'Ukraine'], ['+381', 'Serbia'],
  ['+382', 'Montenegro'], ['+385', 'Croatia'], ['+386', 'Slovenia'], ['+387', 'Bosnia'],
  ['+389', 'North Macedonia'],
  ['+39', 'Italy'], ['+40', 'Romania'], ['+41', 'Switzerland'],
  ['+420', 'Czech Republic'], ['+421', 'Slovakia'], ['+423', 'Liechtenstein'],
  ['+43', 'Austria'], ['+44', 'United Kingdom'], ['+45', 'Denmark'],
  ['+46', 'Sweden'], ['+47', 'Norway'], ['+48', 'Poland'], ['+49', 'Germany'],
  ['+1', 'United States'],
  ['+51', 'Peru'], ['+52', 'Mexico'], ['+53', 'Cuba'], ['+54', 'Argentina'],
  ['+55', 'Brazil'], ['+56', 'Chile'], ['+57', 'Colombia'], ['+58', 'Venezuela'],
  ['+590', 'Guadeloupe'], ['+591', 'Bolivia'], ['+592', 'Guyana'], ['+593', 'Ecuador'],
  ['+595', 'Paraguay'], ['+597', 'Suriname'], ['+598', 'Uruguay'],
  ['+60', 'Malaysia'], ['+61', 'Australia'], ['+62', 'Indonesia'], ['+63', 'Philippines'],
  ['+64', 'New Zealand'], ['+65', 'Singapore'], ['+66', 'Thailand'],
  ['+7', 'Russia'],
  ['+81', 'Japan'], ['+82', 'South Korea'], ['+84', 'Vietnam'], ['+86', 'China'],
  ['+90', 'Turkey'], ['+91', 'India'], ['+92', 'Pakistan'], ['+93', 'Afghanistan'],
  ['+94', 'Sri Lanka'], ['+95', 'Myanmar'], ['+98', 'Iran'],
]

function countryFromPhone(phone: string): string {
  const digits = phone.replace(/[\s\-().]/g, '')
  const normalized = digits.startsWith('00') ? '+' + digits.slice(2) : digits
  for (const [prefix, country] of PHONE_PREFIXES) {
    if (normalized.startsWith(prefix)) return country
  }
  return 'Unknown'
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { action, adminNotes } = schema.parse(await req.json())

    if (action === 'reject') {
      const updated = await db.verificationRequest.update({
        where: { id },
        data: { status: 'REJECTED', adminNotes: adminNotes ?? null, resolvedAt: new Date() },
      })
      return NextResponse.json({ id: updated.id, status: updated.status })
    }

    const vr = await db.verificationRequest.findUnique({ where: { id } })
    if (!vr) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const parsedYear = parseInt(vr.classYear)
    const yearAdmission = !isNaN(parsedYear) ? parsedYear - 7 : new Date().getFullYear() - 7
    const country = countryFromPhone(vr.phone)

    let registrationId = generateRegistrationId()
    let attempts = 0
    while (attempts < 5) {
      const exists = await db.registration.findUnique({ where: { registrationId } })
      if (!exists) break
      registrationId = generateRegistrationId()
      attempts++
    }

    const { alumniRecord, registration } = await db.$transaction(async (tx) => {
      await tx.verificationRequest.update({
        where: { id },
        data: { status: 'VERIFIED', adminNotes: adminNotes ?? null, resolvedAt: new Date() },
      })

      const alumniRecord = await tx.alumniRecord.create({
        data: {
          fullName: vr.fullName,
          email: vr.email,
          phone: vr.phone,
          batch: vr.classYear,
          yearAdmission,
          country,
          verificationStatus: 'VERIFIED',
          adminNotes: adminNotes ?? null,
        },
      })

      const registration = await tx.registration.create({
        data: {
          registrationId,
          fullName: vr.fullName,
          email: vr.email,
          phone: vr.phone,
          country,
          classYear: vr.classYear,
          alumniRecordId: alumniRecord.id,
          status: 'VERIFIED',
          paymentStatus: 'PENDING',
          consentUpdates: false,
          agreedToTerms: true,
        },
      })

      return { alumniRecord, registration }
    })

    sendRegistrationConfirmation({
      to: registration.email,
      fullName: registration.fullName,
      registrationId: registration.registrationId,
      classYear: registration.classYear,
      guests: [],
    }).catch(err => console.error('[Email] Confirmation failed:', err))

    sendPaymentInstructions({
      to: registration.email,
      fullName: registration.fullName,
      registrationId: registration.registrationId,
    }).catch(err => console.error('[Email] Payment instructions failed:', err))

    console.log(`[Verification Approved] ${vr.fullName} (${country}) → alumni ${alumniRecord.id}, reg ${registrationId}`)

    return NextResponse.json({ id, status: 'VERIFIED', registrationId })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.flatten() }, { status: 400 })
    console.error('[Verification] Approve error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
