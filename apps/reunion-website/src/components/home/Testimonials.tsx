import { db } from '@/lib/db'

export async function Testimonials() {
  const testimonials = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })
  if (testimonials.length === 0) return null

  return (
    <section style={{ background: 'linear-gradient(135deg, #2C0A0A 0%, #5C1010 100%)', padding: '72px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-block', background: 'rgba(180,130,60,0.25)', border: '1px solid rgba(180,130,60,0.4)', borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 600, color: '#E8D5A3', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            Alumni Voices
          </div>
          <h2 className="font-playfair" style={{ fontSize: 36, fontWeight: 700, color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>
            Voices of SHEDESA
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Real words from Sacred Heart College Douala alumni across the generations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={t.id} style={{
              background: i % 3 === 1 ? 'rgba(180,130,60,0.12)' : 'rgba(255,255,255,0.07)',
              border: i % 3 === 1 ? '1px solid rgba(180,130,60,0.3)' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Quote mark */}
              <div style={{ fontSize: 48, lineHeight: 1, color: '#E8D5A3', opacity: 0.45, marginBottom: 12, fontFamily: 'Georgia, serif' }}>&ldquo;</div>

              {/* Quote text */}
              <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 1.75, flex: 1, margin: 0, fontStyle: 'italic' }}>
                {t.quote}
              </p>

              {/* Attribution */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B1A1A, #8B6914)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 16, color: 'white',
                  flexShrink: 0,
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: 14, margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: '#E8D5A3', margin: '2px 0 0', fontWeight: 600 }}>{t.classYear}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
