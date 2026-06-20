import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'
import { db } from '@/lib/db'
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/admin-auth'

type CsvRow = {
  fullName?: string
  formerName?: string
  yearAdmission?: string
  yearGraduation?: string
  className?: string
  batch?: string
  house?: string
  phone?: string
  email?: string
  country?: string
  city?: string
  occupation?: string
}

function nullable(val: string | undefined): string | null {
  return val?.trim() || null
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const text = await file.text()
  const { data, errors: parseErrors } = Papa.parse<CsvRow>(text, { header: true, skipEmptyLines: true })

  if (parseErrors.length > 0) {
    return NextResponse.json({ error: 'CSV parse error', details: parseErrors.map(e => e.message) }, { status: 400 })
  }

  let imported = 0
  let skipped = 0
  const rowErrors: string[] = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNum = i + 2

    if (!row.fullName?.trim()) {
      rowErrors.push(`Row ${rowNum}: missing fullName`)
      skipped++
      continue
    }

    const yearAdmission = parseInt(row.yearAdmission ?? '', 10)
    if (isNaN(yearAdmission)) {
      rowErrors.push(`Row ${rowNum}: invalid yearAdmission "${row.yearAdmission}"`)
      skipped++
      continue
    }

    const email = nullable(row.email)
    const phone = nullable(row.phone)

    if (email || phone) {
      const exists = await db.alumniRecord.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : []),
          ],
        },
      })
      if (exists) {
        skipped++
        continue
      }
    }

    await db.alumniRecord.create({
      data: {
        fullName: row.fullName.trim(),
        formerName: nullable(row.formerName),
        yearAdmission,
        yearGraduation: row.yearGraduation ? parseInt(row.yearGraduation, 10) || null : null,
        className: nullable(row.className),
        batch: nullable(row.batch),
        house: nullable(row.house),
        phone,
        email,
        country: nullable(row.country),
        city: nullable(row.city),
        occupation: nullable(row.occupation),
        verificationStatus: 'PENDING',
      },
    })
    imported++
  }

  return NextResponse.json({ imported, skipped, errors: rowErrors })
}
