'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryImage = { src: string; alt: string }
type GallerySection = { title: string; images: GalleryImage[] }

export function GalleryClient({ sections }: { sections: GallerySection[] }) {
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => { setActiveSection(null); setActiveIndex(null) }, [])

  const prev = useCallback(() => {
    setActiveIndex(i => {
      if (i === null || activeSection === null) return i
      const len = sections[activeSection].images.length
      return (i - 1 + len) % len
    })
  }, [activeSection, sections])

  const next = useCallback(() => {
    setActiveIndex(i => {
      if (i === null || activeSection === null) return i
      const len = sections[activeSection].images.length
      return (i + 1) % len
    })
  }, [activeSection, sections])

  useEffect(() => {
    if (activeIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [activeIndex, close, prev, next])

  const activeImages = activeSection === null ? null : sections[activeSection].images

  return (
    <>
      {sections.map((section, sIdx) => (
        <section key={section.title} style={{ background: '#FAF7F2', padding: sIdx === 0 ? '48px 16px 24px' : '24px 16px 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: '#4A1010',
              margin: '0 0 20px',
            }}>
              {section.title}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 12,
            }}>
              {section.images.slice(0, 4).map((img, i) => (
                <div
                  key={img.src}
                  onClick={() => { setActiveSection(sIdx); setActiveIndex(i) }}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    cursor: 'zoom-in',
                    position: 'relative',
                    display: 'block',
                    background: '#e5e5e5',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      className="gallery-thumb"
                    />
                  </div>
                </div>
              ))}

              {/* View all */}
              <div
                onClick={() => { setActiveSection(sIdx); setActiveIndex(0) }}
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'block',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                  {section.images[4] && (
                    <Image
                      src={section.images[4].src}
                      alt={`View all ${section.images.length} photos from ${section.title}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      style={{ objectFit: 'cover', filter: 'brightness(0.5)' }}
                    />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: 12,
                    background: section.images[4] ? 'transparent' : 'rgba(74,16,16,0.85)',
                  }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>
                      View all {section.images.length} photos →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Lightbox */}
      {activeIndex !== null && activeImages !== null && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              padding: '8px 10px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={22} />
          </button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            style={{
              position: 'absolute', left: 12, zIndex: 10,
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              padding: '12px 10px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh', width: '100%', height: '100%' }}
          >
            <Image
              src={activeImages[activeIndex].src}
              alt={activeImages[activeIndex].alt}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            style={{
              position: 'absolute', right: 12, zIndex: 10,
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              padding: '12px 10px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: 13,
          }}>
            {activeIndex + 1} / {activeImages.length}
          </div>
        </div>
      )}

      <style>{`
        .gallery-thumb:hover { transform: scale(1.04); }
      `}</style>
    </>
  )
}
