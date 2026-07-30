export const metadata = {
  title: 'Terms of Use — SHEDESA Reunion 2026',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{title}</h2>
      <div style={{ color: '#4B5563', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="px-4 py-8 md:px-4 md:py-12" style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <div className="px-5 py-8 md:px-10 md:py-12" style={{ maxWidth: 740, margin: '0 auto', background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Last updated: June 2026</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, color: '#111827', margin: 0 }}>
            Terms of Use
          </h1>
          <p style={{ color: '#6b7280', marginTop: 10, fontSize: 15 }}>
            SHEDESA Reunion 2026 — Sacred Heart College Douala Alumni
          </p>
        </div>

        <p style={{ color: '#4B5563', fontSize: 15, lineHeight: 1.7, marginBottom: 32, padding: '16px 20px', background: '#F0F7F4', borderRadius: 8, borderLeft: '4px solid #8B1A1A' }}>
          By registering for the SHEDESA Reunion 2026 or using this website, you agree to these Terms of
          Use in full. Please read them carefully before proceeding.
        </p>

        <Section title="1. About This Event">
          <p>
            The SHEDESA Reunion 2026 is an alumni gathering organised by a volunteer committee of Sacred
            Heart College Douala alumni. The event is scheduled for <strong>December 19, 2026</strong> in
            Douala, Cameroon. These terms govern your use of the registration website at
            shedesareunion.com and your participation in the event.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            Registration is open to verified alumni of Sacred Heart College Douala and their nominated
            guests. By registering, you confirm that:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>You are a former student of Sacred Heart College Douala, or a guest of a registered alumnus</li>
            <li style={{ marginBottom: 6 }}>The information you provide is accurate and truthful to the best of your knowledge</li>
            <li style={{ marginBottom: 6 }}>You are at least 18 years of age, or attending with a registered adult alumnus</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            The organising committee reserves the right to verify alumni status and to cancel registrations
            that cannot be verified or that contain materially false information.
          </p>
        </Section>

        <Section title="3. Registration and Payment">
          <p style={{ marginBottom: 10 }}>
            The registration fee is <strong>25,000 XAF per person</strong> (alumnus and each guest).
            Payment is accepted via:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>MTN Mobile Money — send to +237 679 371 356</li>
            <li style={{ marginBottom: 6 }}>Orange Money — send to +237 691 241 454</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            <strong>Your registration spot is not confirmed until full payment is received.</strong> For
            mobile money payments, you must send your registration ID as the payment reference and provide
            proof of payment to{' '}
            <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>{' '}
            or via WhatsApp at +237 683 031 320.
          </p>
          <p style={{ marginTop: 10 }}>
            Only one registration per person is permitted. If you have already registered and need to
            make changes, contact us rather than registering again.
          </p>
        </Section>

        <Section title="4. Refund and Cancellation Policy">
          <p>
            We understand that circumstances change. Our policy is as follows:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>
              <strong>Before October 31, 2026:</strong> Full refund available upon written request to{' '}
              <a href="mailto:yoloreunion@gmail.com" style={{ color: '#8B1A1A' }}>yoloreunion@gmail.com</a>.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>November 1 – November 30, 2026:</strong> 50% refund available.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>From December 1, 2026 onwards:</strong> No refund, but your spot may be transferred
              to another eligible alumnus with prior written approval from the committee.
            </li>
          </ul>
          <p style={{ marginTop: 10 }}>
            Refunds for mobile money payments are processed manually and may take up to 14 business days.
          </p>
        </Section>

        <Section title="5. Event Conduct">
          <p>
            SHEDESA Reunion 2026 is a celebration of our shared heritage. All attendees are expected to
            behave respectfully towards fellow alumni, guests, staff, and venue personnel. The organising
            committee reserves the right to remove any person from the event without refund if their
            conduct is deemed disruptive, disrespectful, or harmful to others.
          </p>
          <p style={{ marginTop: 10 }}>
            Attendees are responsible for the conduct of their registered guests throughout the event.
          </p>
        </Section>

        <Section title="6. Photography and Media">
          <p>
            Photography and video recording will take place at the event. By attending, you acknowledge
            that images and videos in which you appear may be used by the SHEDESA alumni community for
            event documentation, social media sharing, and future alumni communications.
          </p>
          <p style={{ marginTop: 10 }}>
            If you have specific concerns about your image being used, please inform the organising team
            on the day of the event.
          </p>
        </Section>

        <Section title="7. Event Changes">
          <p>
            The organising committee reserves the right to modify the event date, venue, programme, or
            format if circumstances require it (including, but not limited to, venue unavailability,
            force majeure, or government directives). We will notify all registered attendees promptly
            of any material changes. In the event of a cancellation by the committee, full refunds will
            be issued.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            The SHEDESA Reunion 2026 organising committee is a volunteer group. To the extent permitted
            by applicable law, we are not liable for any loss, damage, injury, or expense incurred by
            attendees in connection with the event or travel to/from the event. Attendees participate
            at their own risk and are encouraged to arrange their own travel insurance where appropriate.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            These terms are governed by the laws of Cameroon. Any disputes arising from these terms or
            the event will be resolved through good-faith negotiation in the first instance. We are a
            community — we prefer to talk things through.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            For questions about these terms, contact the SHEDESA Reunion 2026 committee at{' '}
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
