import { db } from '@/lib/db'
import { Quote } from 'lucide-react'
export async function Testimonials() {
  const testimonials = await db.testimonial.findMany({ where: { published: true }, orderBy: { order: 'asc' } })
  if (testimonials.length === 0) return null
  return (
    <section className="py-16" style={{background:'#FDF2F2'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Voices of SHEDESA</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">What our alumni say about the reunion experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <Quote size={24} className="mb-4" style={{color:'rgba(139,26,26,0.2)'}}/>
              <p className="text-neutral-700 italic leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-playfair font-bold text-[#8B1A1A]" style={{background:'#FAE2E2'}}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.classYear}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
