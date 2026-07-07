'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryImage = { src: string; alt: string }

export function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const prev = useCallback(() => setActive(i => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length])
  const next = useCallback(() => setActive(i => (i === null ? null : (i + 1) % images.length)), [images.length])

  useEffect(() => {
    if (active === null) return
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
  }, [active, close, prev, next])

  return (
    <>
      {/* Masonry grid */}
      <section style={{ background: '#FAF7F2', padding: '48px 16px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            columns: 'auto 300px',
            columnGap: 12,
          }}>
            {images.map((img, i) => (
              <div
                key={img.src}
                onClick={() => setActive(i)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: 12,
                  borderRadius: 10,
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  position: 'relative',
                  display: 'block',
                  background: '#e5e5e5',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingBottom: i % 3 === 0 ? '66%' : i % 3 === 1 ? '75%' : '56%' }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    className="gallery-thumb"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {active !== null && (
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
              src={images[active].src}
              alt={images[active].alt}
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
            {active + 1} / {images.length}
          </div>
        </div>
      )}

      <style>{`
        .gallery-thumb:hover { transform: scale(1.04); }
      `}</style>
    </>
  )
}
