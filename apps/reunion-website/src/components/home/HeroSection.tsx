import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { CalendarDays, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-white overflow-hidden">

      {/* Background photo */}
      <Image
        src="/images/school_hero.jpg"
        alt="Sacred Heart College Douala"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        quality={85}
      />

      {/* Layered overlay: dark bottom-up gradient + deep green tint for brand color */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(44,10,10,0.55) 0%, rgba(44,10,10,0.70) 50%, rgba(44,10,10,0.85) 100%)',
      }} />

      {/* Subtle vignette on sides */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">

        {/* Eyebrow badge */}
        <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{
          background: 'rgba(180,130,60,0.18)',
          border: '1px solid rgba(180,130,60,0.4)',
          color: '#E8D5A3',
          backdropFilter: 'blur(4px)',
        }}>
          🎓 Sacred Heart College Douala — Alumni Reunion 2026
        </div>

        {/* Headline */}
        <h1 className="font-playfair font-bold leading-tight mb-5" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}>
          Welcome Home,<br />
          <span style={{ color: '#E8D5A3' }}>SHEDESA Family</span>
        </h1>

        {/* Subline */}
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.65 }}>
          Reconnect with your Sacred Heart College Douala community. Celebrate memories, honour our school, and build our future together.
        </p>

        {/* Event meta */}
        <div className="flex flex-wrap items-center justify-center gap-5 mb-10 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} /> December 18–19, 2026
          </span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>|</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} /> Douala, Cameroon
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className={buttonVariants({ size: 'lg' }) + ' font-bold text-base px-8'}
            style={{ background: '#8B1A1A', color: 'white', border: 'none' }}
          >
            Register Now
          </Link>
          <Link
            href="/pay"
            className={buttonVariants({ size: 'lg', variant: 'outline' }) + ' text-base px-8'}
            style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,0.08)' }}
          >
            Pay for Event
          </Link>
          <Link
            href="/donate"
            className={buttonVariants({ size: 'lg', variant: 'ghost' }) + ' text-base px-8'}
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Donate / Support
          </Link>
        </div>

      </div>

      {/* Subtle caption bottom-left */}
      <p className="absolute bottom-4 left-5 text-xs z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
        Sacred Heart College Douala — Bali, Douala
      </p>

    </section>
  )
}
