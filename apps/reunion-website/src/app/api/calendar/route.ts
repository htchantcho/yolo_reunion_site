import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export async function GET(req: NextRequest) {
  const regId = req.nextUrl.searchParams.get('regId')

  if (!regId) {
    return NextResponse.json({ error: 'Missing regId' }, { status: 400 })
  }

  const registration = await db.registration.findUnique({
    where: { registrationId: regId },
    select: { fullName: true, registrationId: true },
  })

  if (!registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  const eventStart = new Date('2026-12-19T09:00:00Z')
  const eventEnd = new Date('2026-12-19T18:00:00Z')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SHEDESA Reunion//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${registration.registrationId}@shedesareunion.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(eventStart)}`,
    `DTEND:${formatICSDate(eventEnd)}`,
    'SUMMARY:SHEDESA Reunion 2026',
    'DESCRIPTION:Sacred Heart College Douala (SHEDESA) Alumni Reunion 2026.\\nRegistration ID: ' + registration.registrationId + '\\nContact: yoloreunion@gmail.com',
    'LOCATION:Douala\\, Cameroon',
    'URL:https://shedesareunion.com',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    'DESCRIPTION:SHEDESA Reunion is in 1 week!',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:SHEDESA Reunion is tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  await db.registration.update({
    where: { registrationId: regId },
    data: { calendarSent: true },
  })

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="shedesa-reunion-2026.ics"`,
    },
  })
}
