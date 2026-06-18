import { HeroSection } from '@/components/home/HeroSection'
import { CountdownTimer } from '@/components/home/CountdownTimer'
import { EventInfo } from '@/components/home/EventInfo'
import { Objectives } from '@/components/home/Objectives'
import { Testimonials } from '@/components/home/Testimonials'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CountdownTimer />
      <EventInfo />
      <Objectives />
      <Testimonials />
      <section className="py-16 text-white text-center" style={{background:'linear-gradient(135deg, #7A1616 0%, #8B1A1A 100%)'}}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold mb-4">Ready to Join the Reunion?</h2>
          <p className="mb-8" style={{color:'rgba(255,255,255,0.8)'}}>Secure your place at the SHEDESA 2026 reunion. Verify your alumni status, register, and pay — all in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className={buttonVariants({ size: 'lg' }) + ' font-bold px-10'} style={{background:'#D4AF37',color:'#1a1a1a'}}>
              Register Now
            </Link>
            <Link href="/contact" className={buttonVariants({ size: 'lg', variant: 'outline' }) + ' border-white text-white hover:bg-white hover:text-[#8B1A1A] px-10'}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
