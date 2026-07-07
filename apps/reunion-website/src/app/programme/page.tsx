import type { Metadata } from 'next'
import { db } from '@/lib/db'

export const metadata: Metadata = { title: 'Programme | SHEDESA Reunion 2026' }
export const dynamic = 'force-dynamic'

const MAPS_LINK = 'https://maps.google.com/?q=Douala,+Cameroon'
const MAPS_EMBED = 'https://maps.google.com/maps?q=Douala,+Cameroon&output=embed'

const DAY_CONFIG = [
  {
    day: 1,
    date: 'Friday, December 18, 2026',
    label: 'Day 1',
    theme: 'Football Classic',
    icon: '⚽',
    color: '#8B1A1A',
    light: '#FAF0F0',
    border: '#A8D5C2',
    desc: 'Alumni football match — come cheer, play, and relive your school days on the pitch.',
  },
  {
    day: 2,
    date: 'Saturday, December 19, 2026',
    label: 'Day 2',
    theme: 'Gala Ball — Everything Linen and Classy',
    icon: '✨',
    color: '#8B1A1A',
    light: '#FFFBEB',
    border: '#FCD34D',
    desc: 'An elegant evening celebration. Dress code: formal linen. Theme: Everything Linen and Classy.',
  },
]

function TimelineItem({
  time, title, description, speaker, location, color, isLast,
}: {
  time: string; title: string; description?: string | null; speaker?: string | null;
  location?: string | null; color: string; isLast: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 16, paddingBottom: isLast ? 0 : 24, position: 'relative' }}>
      {!isLast && (
        <div style={{ position: 'absolute', left: 19, top: 36, bottom: 0, width: 2, background: color + '30' }} />
      )}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', background: color + '20',
        border: `2px solid ${color}`, flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, fontWeight: 700, color, zIndex: 1,
      }}>
        {time.replace(' AM', '').replace(' PM', '')}
      </div>
      <div style={{ flex: 1, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color, fontWeight: 700 }}>{time}</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
        </div>
        {description && <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0', lineHeight: 1.5 }}>{description}</p>}
        {(speaker || location) && (
          <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            {speaker && <span style={{ fontSize: 12, color: '#9ca3af' }}>🎤 {speaker}</span>}
            {location && <span style={{ fontSize: 12, color: '#9ca3af' }}>📍 {location}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default async function ProgrammePage() {
  const allItems = await db.programmeItem.findMany({
    orderBy: [{ day: 'asc' }, { order: 'asc' }, { time: 'asc' }],
  })

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* Hero — linen theme */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #2C0A0A 0%, #8B1A1A 45%, #4A1010 100%)',
        padding: '72px 24px 80px',
      }}>
        {/* Decorative linen circles */}
        {[
          { w: 320, h: 320, t: -80, r: -80, o: 0.12 },
          { w: 200, h: 200, t: 20, l: -60, o: 0.08 },
          { w: 160, h: 160, b: -40, r: 120, o: 0.15 },
          { w: 100, h: 100, t: 60, r: 200, o: 0.2 },
          { w: 80,  h: 80,  b: 20, l: 180, o: 0.18 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: c.w, height: c.h,
            ...(c.t !== undefined ? { top: c.t } : {}),
            ...(c.b !== undefined ? { bottom: c.b } : {}),
            ...(c.l !== undefined ? { left: c.l } : {}),
            ...(c.r !== undefined ? { right: c.r } : {}),
            background: `radial-gradient(circle, rgba(180,130,60,${c.o}) 0%, rgba(180,130,60,0) 70%)`,
            pointerEvents: 'none',
          }} />
        ))}
        {/* Petal shapes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div key={i} style={{
            position: 'absolute', right: 80, top: '50%',
            width: 60, height: 100, borderRadius: '50%',
            background: 'rgba(180,130,60,0.1)',
            transform: `translateY(-50%) rotate(${deg}deg) translateY(-60px)`,
            transformOrigin: 'center 60px',
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(180,130,60,0.25)', border: '1px solid rgba(180,130,60,0.5)', borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 600, color: '#E8D5A3', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
            SHEDESA Reunion 2026
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 700, color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>
            Event Programme
          </h1>
          <p style={{ fontSize: 17, color: '#E8C8C8', margin: '0 0 8px' }}>
            December 18–19, 2026 &nbsp;·&nbsp; Douala, Cameroon
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            Theme: <span style={{ color: '#E8D5A3', fontStyle: 'italic' }}>Everything Linen and Classy</span>
          </p>
        </div>
      </div>

      {/* Location card */}
      <div style={{ maxWidth: 860, margin: '-28px auto 0', padding: '0 20px' }}>
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FAF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              📍
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Location</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '2px 0' }}>Douala, Cameroon</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Venue details sent to registered attendees</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#8B1A1A', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
              🗺 Open in Google Maps
            </a>
            <a href={`${MAPS_LINK}&output=kml`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#f0f8f4', color: '#8B1A1A', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', border: '1px solid #A8D5C2' }}>
              ⬇ Download Map
            </a>
          </div>
        </div>
      </div>

      {/* Embedded map */}
      <div style={{ maxWidth: 860, margin: '20px auto', padding: '0 20px' }}>
        <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 280 }}>
          <iframe
            src={MAPS_EMBED}
            width="100%" height="280" style={{ border: 0, display: 'block' }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Programme days */}
      <div style={{ maxWidth: 860, margin: '32px auto 64px', padding: '0 20px' }}>
        {DAY_CONFIG.map(cfg => {
          const dayItems = allItems.filter(i => i.day === cfg.day)
          return (
            <div key={cfg.day} style={{ marginBottom: 36 }}>
              {/* Day header */}
              <div style={{ background: cfg.color, borderRadius: '14px 14px 0 0', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 32 }}>{cfg.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>{cfg.label}</div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'white', margin: '2px 0' }}>{cfg.theme}</h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{cfg.date}</p>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '28px 28px 20px' }}>
                {/* Day description */}
                <div style={{ background: cfg.light, border: `1px solid ${cfg.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 28 }}>
                  <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>{cfg.desc}</p>
                </div>

                {dayItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{cfg.icon}</div>
                    <p style={{ fontSize: 14 }}>Schedule to be announced soon.</p>
                  </div>
                ) : (
                  <div>
                    {dayItems.map((item, i) => (
                      <TimelineItem
                        key={item.id}
                        time={item.time}
                        title={item.title}
                        description={item.description}
                        speaker={item.speaker}
                        location={item.location}
                        color={cfg.color}
                        isLast={i === dayItems.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        <div style={{ textAlign: 'center', padding: '16px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FCD34D' }}>
          <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>
            ⚠ Programme is subject to change. Final schedule will be emailed to all registered attendees.
          </p>
        </div>
      </div>
    </div>
  )
}
