import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { CalendarDays, MapPin } from 'lucide-react'
export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden" style={{background:'linear-gradient(135deg, #661212 0%, #8B1A1A 50%, #1a1a1a 100%)'}}>
      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',backgroundSize:'32px 32px'}}/>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{background:'rgba(212,175,55,0.2)',border:'1px solid rgba(212,175,55,0.3)',color:'#F5EBC5'}}>
          🎓 Sacred Heart College Douala — Alumni Reunion 2026
        </div>
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
          Welcome Home,<br/><span style={{color:'#D4AF37'}}>SHEDESA Family</span>
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{color:'rgba(255,255,255,0.8)'}}>
          Reconnect with your Sacred Heart College Douala community. Celebrate memories, honour our school, and build our future together.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm" style={{color:'rgba(255,255,255,0.7)'}}>
          <span className="flex items-center gap-1.5"><CalendarDays size={16}/> December 26, 2026</span>
          <span style={{color:'rgba(255,255,255,0.3)'}}>•</span>
          <span className="flex items-center gap-1.5"><MapPin size={16}/> Douala, Cameroon</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className={buttonVariants({ size: 'lg' }) + ' font-bold text-base px-8'} style={{background:'#D4AF37',color:'#1a1a1a'}}>
            Register Now
          </Link>
          <Link href="/pay" className={buttonVariants({ size: 'lg', variant: 'outline' }) + ' border-white text-white hover:bg-white hover:text-[#8B1A1A] text-base px-8'}>
            Pay for Event
          </Link>
          <Link href="/donate" className={buttonVariants({ size: 'lg', variant: 'ghost' }) + ' text-white hover:bg-white/10 text-base px-8'}>
            Donate / Support
          </Link>
        </div>
      </div>
    </section>
  )
}
