'use client'
import { useEffect, useState } from 'react'
const EVENT_DATE = new Date('2026-12-26T10:00:00')
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }
function calc(): TimeLeft {
  const diff = EVENT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}
export function CountdownTimer() {
  const [t, setT] = useState<TimeLeft>(calc())
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [])
  return (
    <section className="py-12 text-white" style={{background:'#8B1A1A'}}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="uppercase tracking-widest text-sm mb-6" style={{color:'rgba(255,255,255,0.7)'}}>Time Until Reunion</p>
        <div className="flex justify-center gap-4 sm:gap-8">
          {[{l:'Days',v:t.days},{l:'Hours',v:t.hours},{l:'Minutes',v:t.minutes},{l:'Seconds',v:t.seconds}].map(({l,v}) => (
            <div key={l} className="flex flex-col items-center">
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-xl flex items-center justify-center" style={{background:'rgba(255,255,255,0.1)'}}>
                <span className="font-playfair text-2xl sm:text-4xl font-bold tabular-nums">{String(v).padStart(2,'0')}</span>
              </div>
              <span className="text-xs mt-2 uppercase tracking-wide" style={{color:'rgba(255,255,255,0.6)'}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
