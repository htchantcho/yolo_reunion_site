export const metadata = {
  title: 'User Agreement — SHEDESA Reunion 2026',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{title}</h2>
      <div style={{ color: '#4B5563', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
    </section>
  )
}

export default function AgreementPage() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '48px 16px' }}>
      <div style={{ maxWidth: 740, margin: '0 auto', background: 'white', borderRadius: 12, padding: '48px 40px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Last updated: June 2026</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, color: '#111827', margin: 0 }}>
            Registration Agreement
          </h1>
          <p style={{ color: '#6b7280', marginTop: 10, fontSize: 15 }}>
            SHEDESA Reunion 2026 — Sacred Heart College Douala Alumni
          </p>
        </div>

        <div style={{ padding: '20px 24px', background: '#F0F7F4', borderRadius: 10, border: '1px solid #A8D5C2', marginBottom: 36 }}>
          <p style={{ color: '#8B1A1A', fontWeight: 600, fontSize: 15, margin: '0 0 6px' }}>
            This is the agreement you enter into when you register for the SHEDESA Reunion 2026.
          </p>
          <p style={{ color: '#374151', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            By completing registration, you confirm that you have read, understood, and agreed to everything on this page, as well as our{' '}
            <a href="/terms" style={{ color: '#8B1A1A', fontWeight: 600 }}>Terms of Use</a> and{' '}
            <a href="/privacy" style={{ color: '#8B1A1A', fontWeight: 600 }}>Privacy Policy</a>.
          </p>
        </div>

        <Section title="1. Your Identity and Alumni Status">
          <p>
            By registering, you confirm that you are a former student of Sacred Heart College Douala,
            or a guest of a registered alumnus. You understand that:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>
              The organising committee may verify your alumni status using school records. If your name
              is found in our database and you select it, that record will be linked to your registration.
            </li>
            <li style={{ marginBottom: 6 }}>
              If your name does not appear in our database, you may submit a manual verification request.
              The committee will contact you within 48 hours to confirm your status before your
              registration is finalised.
            </li>
            <li style={{ marginBottom: 6 }}>
              If your name appears misspelled in our records, you may correct it during registration.
              The correction will be applied to the alumni database immediately.
            </li>
            <li style={{ marginBottom: 6 }}>
              Registrations found to be fraudulent or unverifiable will be cancelled, and any payments
              already made will be refunded in full.
            </li>
          </ul>
        </Section>

        <Section title="2. Accuracy of Information">
          <p>
            You agree to provide accurate, current, and complete information during registration. This
            includes your name, email address, phone number, and country of residence. Providing false
            or misleading information may result in cancellation of your registration.
          </p>
          <p style={{ marginTop: 10 }}>
            If any of your details change before the event (especially contact information), please
            notify us at{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>{' '}
            so we can update your record.
          </p>
        </Section>

        <Section title="3. Payment Obligation">
          <p>
            You agree to pay the full registration fee of <strong>25,000 XAF per person</strong>
            (including guests) in a timely manner. You understand that:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>
              Your registration is only confirmed once full payment is received and verified by the committee.
            </li>
            <li style={{ marginBottom: 6 }}>
              For mobile money payments (MTN or Orange), you must include your registration ID as the
              payment reference and send proof of payment to the committee.
            </li>
            <li style={{ marginBottom: 6 }}>
              Unpaid registrations may be released to allow others to attend if payment is not received
              by a reasonable deadline before the event.
            </li>
            <li style={{ marginBottom: 6 }}>
              Refunds are subject to the cancellation policy set out in our{' '}
              <a href="/terms" style={{ color: '#8B1A1A' }}>Terms of Use</a>.
            </li>
          </ul>
        </Section>

        <Section title="4. Your Guests">
          <p>
            If you register additional guests (up to 5), you confirm that:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>You have obtained consent from each guest to share their name for event check-in purposes</li>
            <li style={{ marginBottom: 6 }}>You are responsible for ensuring your guests are aware of and comply with the event's code of conduct</li>
            <li style={{ marginBottom: 6 }}>Each guest will receive a unique guest pass ID. This ID must be presented at check-in.</li>
            <li style={{ marginBottom: 6 }}>Guest names cannot be changed after registration is submitted. If you need to update a guest name, contact the committee.</li>
          </ul>
        </Section>

        <Section title="5. Use of the Platform">
          <p>You agree to use shedesareunion.com only for its intended purpose — registering for the SHEDESA Reunion 2026. You agree not to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>Attempt to access other users' registration data</li>
            <li style={{ marginBottom: 6 }}>Submit multiple registrations for the same person</li>
            <li style={{ marginBottom: 6 }}>Use the platform for any unlawful purpose</li>
            <li style={{ marginBottom: 6 }}>Attempt to disrupt or compromise the security of the platform</li>
          </ul>
        </Section>

        <Section title="6. Communications">
          <p>
            By registering, you agree to receive transactional emails related to your registration:
            confirmation of registration, payment receipts, event logistics, and check-in details.
            These are not optional — they are necessary for your participation in the event.
          </p>
          <p style={{ marginTop: 10 }}>
            If you checked the box to consent to general SHEDESA updates, you also agree to receive
            occasional community communications. You may opt out of these at any time by emailing{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>.
          </p>
        </Section>

        <Section title="7. Our Values">
          <p>
            SHEDESA — Sacred Heart College Douala — shaped us with values of excellence, integrity,
            community, and service. This reunion is an expression of those values. We ask every
            attendee to carry the same spirit: respect for one another, pride in our shared heritage,
            and joy in reconnecting with the family that formed us.
          </p>
          <p style={{ marginTop: 10 }}>
            We are proud of where we come from. We are proud of what each of you has become. This
            event is yours — and we ask only that you honour it with the same heart that Sacred Heart
            gave you.
          </p>
        </Section>

        <Section title="8. Agreement">
          <p>
            By completing registration on shedesareunion.com, you acknowledge that you have read and
            agree to this Registration Agreement, the{' '}
            <a href="/terms" style={{ color: '#8B1A1A' }}>Terms of Use</a>, and the{' '}
            <a href="/privacy" style={{ color: '#8B1A1A' }}>Privacy Policy</a>.
          </p>
          <p style={{ marginTop: 10 }}>
            Questions? We are happy to help — reach us at{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>.
          </p>
        </Section>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/terms" style={{ fontSize: 13, color: '#8B1A1A', textDecoration: 'none' }}>Terms of Use</a>
          <span style={{ color: '#d1d5db' }}>|</span>
          <a href="/privacy" style={{ fontSize: 13, color: '#8B1A1A', textDecoration: 'none' }}>Privacy Policy</a>
          <span style={{ color: '#d1d5db' }}>|</span>
          <a href="/" style={{ fontSize: 13, color: '#8B1A1A', textDecoration: 'none' }}>shedesareunion.com</a>
        </div>
      </div>
    </div>
  )
}
