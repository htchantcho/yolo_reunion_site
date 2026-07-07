import { GalleryClient } from './GalleryClient'

const IMAGES = [
  { src: '/images/gallery/gallery_001.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_002.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_003.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_004.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_005.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_006.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_007.jpg', alt: 'SHEDESA Alumni — Sports Day' },
  { src: '/images/gallery/gallery_008.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_009.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_010.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_011.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_012.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_013.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_014.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_015.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_016.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_017.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_018.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_019.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_020.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_021.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_022.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_023.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_024.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_025.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_026.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_027.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_028.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_029.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_030.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_031.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_032.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_033.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_034.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_035.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_036.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_037.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_038.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_039.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_040.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_041.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_042.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_043.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_044.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_045.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_046.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_047.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_048.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_049.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_050.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_051.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_052.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_053.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_054.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_055.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_056.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_057.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_058.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_059.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_060.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_061.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_062.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_063.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_064.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_065.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_066.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_067.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_068.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_069.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_070.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_071.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_072.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_073.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_074.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_075.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_076.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_077.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_078.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_079.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_080.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_081.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_082.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_083.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_084.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_085.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_086.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_087.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_088.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_089.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_090.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_091.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_092.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_093.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_094.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_095.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_096.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_097.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_098.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_099.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_100.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_101.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_102.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_103.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_104.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_105.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_106.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_107.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_108.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_109.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_110.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_111.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_112.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_113.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_114.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_115.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_116.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_117.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_118.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_119.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_120.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_121.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_122.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_123.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_124.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_125.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_126.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_127.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_128.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_129.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_130.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_131.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_132.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_133.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_134.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_135.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_136.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_137.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_138.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_139.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_140.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
  { src: '/images/gallery/gallery_141.jpg', alt: 'SHEDESA Alumni — Gala Ceremony' },
]

export const metadata = {
  title: 'Gallery — SHEDESA Reunion 2026',
  description: 'Photos from previous SHEDESA alumni reunions. Relive the memories and get excited for December 2026.',
}

export default function GalleryPage() {
  return (
    <main>
      <section style={{
        background: 'linear-gradient(135deg, #2C0A0A 0%, #4A1010 60%, #2C0A0A 100%)',
        padding: '72px 24px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle, #E8D5A3 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(180,130,60,0.15)',
            border: '1px solid rgba(180,130,60,0.35)',
            borderRadius: 20, padding: '5px 18px',
            fontSize: 12, fontWeight: 600, color: '#E8D5A3',
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18,
          }}>
            Our Memories
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700, color: '#E8D5A3',
            margin: '0 0 16px', lineHeight: 1.2,
          }}>
            Photo Gallery
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 17, lineHeight: 1.65, margin: '0 auto', maxWidth: 580 }}>
            Memories from our previous SHEDESA alumni gatherings — Sports Day and the Gala Ceremony. These moments remind us why December 2026 will be unforgettable.
          </p>
        </div>
      </section>

      <div style={{
        background: 'white', borderBottom: '1px solid #e5e7eb',
        padding: '14px 24px', textAlign: 'center',
      }}>
        <span style={{ fontSize: 14, color: '#6b7280' }}>
          {IMAGES.length} photos · Click any photo to view full size
        </span>
      </div>

      <GalleryClient images={IMAGES} />

      <section style={{
        background: 'linear-gradient(135deg, #2C0A0A 0%, #4A1010 100%)',
        padding: '56px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#E8D5A3', margin: '0 0 12px' }}>
            Be Part of the Next Chapter
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: '0 0 28px', lineHeight: 1.65 }}>
            Join us in Douala this December 18–19, 2026 to create new memories with your SHEDESA family.
          </p>
          <a
            href="/register"
            style={{
              display: 'inline-block', padding: '13px 32px',
              background: '#8B1A1A', color: 'white',
              borderRadius: 8, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', letterSpacing: 0.3,
            }}
          >
            Register for Reunion 2026 →
          </a>
        </div>
      </section>
    </main>
  )
}
