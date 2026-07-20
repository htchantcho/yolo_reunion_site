export const metadata = {
  title: 'Privacy Policy — SHEDESA Reunion 2026',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{title}</h2>
      <div style={{ color: '#4B5563', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '48px 16px' }}>
      <div style={{ maxWidth: 740, margin: '0 auto', background: 'white', borderRadius: 12, padding: '48px 40px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Last updated: June 2026</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, color: '#111827', margin: 0 }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#6b7280', marginTop: 10, fontSize: 15 }}>
            SHEDESA Reunion 2026 — Sacred Heart College Douala Alumni
          </p>
        </div>

        <Section title="1. Who We Are">
          <p>
            The SHEDESA Reunion 2026 is organised by a volunteer committee of Sacred Heart College Douala
            alumni. We operate the registration platform at <strong>shedesareunion.com</strong> solely for
            the purpose of coordinating the alumni reunion event scheduled for December 19, 2026 in Douala,
            Cameroon.
          </p>
          <p style={{ marginTop: 10 }}>
            For all data and privacy inquiries, contact us at{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>.
          </p>
        </Section>

        <Section title="2. What Personal Data We Collect">
          <p>When you register, we collect:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}><strong>Identity information:</strong> Full name, former/maiden name, graduation year and batch</li>
            <li style={{ marginBottom: 6 }}><strong>Contact information:</strong> Email address, phone number, country of residence</li>
            <li style={{ marginBottom: 6 }}><strong>Guest information:</strong> Names of additional guests you register</li>
            <li style={{ marginBottom: 6 }}><strong>Event preferences:</strong> Dietary requirements, accessibility needs</li>
            <li style={{ marginBottom: 6 }}><strong>Payment information:</strong> For mobile money payments, we receive the transaction reference you or your bank provides.</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            We also collect basic technical information when you visit our website (IP address, browser type)
            through standard server logs, but we do not use cookies for tracking or advertising purposes.
          </p>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use your personal data exclusively to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>Process and confirm your event registration</li>
            <li style={{ marginBottom: 6 }}>Verify your alumni status against our Sacred Heart College Douala records</li>
            <li style={{ marginBottom: 6 }}>Process payments and issue receipts</li>
            <li style={{ marginBottom: 6 }}>Send you event information, schedule updates, and logistics details</li>
            <li style={{ marginBottom: 6 }}>Manage check-in on the day of the event</li>
            <li style={{ marginBottom: 6 }}>Contact you if we need to resolve questions about your registration</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            If you consented to receive updates during registration, we may also send occasional
            communications about SHEDESA alumni activities beyond the 2026 reunion. You can withdraw
            this consent at any time by emailing us.
          </p>
          <p style={{ marginTop: 10 }}>
            We will <strong>never</strong> sell, rent, or share your personal data with third parties
            for marketing purposes.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>We use the following trusted third-party services to operate the platform:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>
              <strong>Email delivery service</strong> — for sending registration confirmations and event
              communications. Emails contain your name and registration ID.
            </li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your registration data for the duration of the event planning period and for a
            reasonable period afterwards (up to 24 months) to resolve any post-event matters such as
            payment disputes or administrative follow-up.
          </p>
          <p style={{ marginTop: 10 }}>
            Alumni database records — names, graduation years, and related details drawn from school
            records — are retained as part of the ongoing SHEDESA alumni directory to support future
            reunion events and alumni activities.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}><strong>Access</strong> the personal data we hold about you</li>
            <li style={{ marginBottom: 6 }}><strong>Correct</strong> inaccurate data — including correcting your name in our alumni database during registration</li>
            <li style={{ marginBottom: 6 }}><strong>Request deletion</strong> of your registration data (note: this may affect your event access)</li>
            <li style={{ marginBottom: 6 }}><strong>Withdraw consent</strong> for marketing communications at any time</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            To exercise any of these rights, email{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>{' '}
            with your name and registration ID.
          </p>
        </Section>

        <Section title="7. Data Security">
          <p>
            We take reasonable technical measures to protect your data, including encrypted connections
            (HTTPS), secure database storage, and access controls limiting who on the organising committee
            can view registration data. Passwords and sensitive credentials are never stored in plain text.
          </p>
          <p style={{ marginTop: 10 }}>
            While we take security seriously, no system is entirely immune to risk. In the unlikely event
            of a data breach that affects your rights, we will notify affected individuals promptly.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            For any questions, corrections, or complaints regarding this privacy policy or how we handle
            your data, please contact the SHEDESA Reunion 2026 committee at{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>.
          </p>
        </Section>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>
            SHEDESA Reunion 2026 &mdash; Sacred Heart College Douala Alumni &mdash;{' '}
            <a href="/" style={{ color: '#8B1A1A', textDecoration: 'none' }}>shedesareunion.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
