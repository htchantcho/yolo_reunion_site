import Image from 'next/image'

const SPONSORS: { name: string; logo: string; url?: string }[] = [
  { name: 'Genesys Capital',       logo: 'genesys_capital.png'       },
  { name: 'DK Hotel',              logo: 'dk_hotel.png'              },
  { name: 'Afroserv',              logo: 'afroserv.png'              },
  { name: 'BIJ Luxury Protocol',   logo: 'bij_luxury_protocol.png'   },
  { name: 'Urban Drive',           logo: 'urbandrive.png'            },
  { name: 'Zacks Events',          logo: 'zacks_events.png'          },
  { name: 'Afritibi',              logo: 'afritibi.png'              },
  { name: 'AFYA Tea',              logo: 'afya_tea.png'              },
  { name: 'CK',                    logo: 'ck.png'                    },
  { name: 'IFPHNT',                logo: 'ifphnt.png'                },
  { name: 'KenRos',                logo: 'kenros.png'                },
  { name: 'SAHECO',                logo: 'logo_saheco.png'           },
  { name: 'Moundi Juices',         logo: 'moundi_juices.png'         },
  { name: 'Premium Care Services', logo: 'premium_care_services.png' },
  { name: 'Premium Pressing',      logo: 'premium_pressing.png'      },
  { name: 'Sure Security',         logo: 'sure_security.png'         },
  { name: 'Tabard',                logo: 'tabard.png'                },
  { name: 'Wound Masters',         logo: 'wound_masters.png'         },
  { name: 'SHEDESA Douala',        logo: 'shedesa_douala.png'        },
]

export function Sponsors() {
  return (
    <section style={{ background: '#FAF7F2', borderTop: '1px solid #e5e7eb', padding: '56px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(180,130,60,0.12)',
            border: '1px solid rgba(180,130,60,0.3)', borderRadius: 20,
            padding: '4px 16px', fontSize: 12, fontWeight: 600,
            color: '#7A1A1A', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Our Supporters
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
            Sponsors &amp; Partners
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>
            Thank you to those who make SHEDESA Reunion 2026 possible.
          </p>
        </div>

        {/* Logo grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          {SPONSORS.map(s => (
            <div key={s.name} title={s.name} style={{
              padding: '12px 18px',
              background: 'white',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 80,
            }}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <Image src={`/images/sponsors/${s.logo}`} alt={s.name} width={120} height={60} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
                </a>
              ) : (
                <Image src={`/images/sponsors/${s.logo}`} alt={s.name} width={120} height={60} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
              )}
            </div>
          ))}
        </div>

        {/* Become a sponsor */}
        <div style={{ textAlign: 'center', paddingTop: 32, borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px' }}>
            Interested in sponsoring the SHEDESA Reunion 2026?
          </p>
          <a
            href="mailto:yoloreunion@gmail.com?subject=Sponsorship%20Enquiry%20—%20SHEDESA%20Reunion%202026"
            style={{
              display: 'inline-block', padding: '10px 24px',
              background: '#8B1A1A', color: 'white', borderRadius: 8,
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}
          >
            Contact Us About Sponsorship →
          </a>
        </div>

      </div>
    </section>
  )
}
