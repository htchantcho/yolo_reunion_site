import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { ScheduleItem } from '@/components/programme/ScheduleItem'
export const metadata: Metadata = { title: 'Programme | SHEDESA Reunion 2026' }
export default async function ProgrammePage() {
  const items = await db.programmeItem.findMany({ orderBy: { order: 'asc' } })
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">Event Programme</h1>
          <p className="text-neutral-600 text-lg">Sacred Heart College Douala (SHEDESA) Reunion — December 19, 2026, Douala, Cameroon.</p>
          <div className="mt-4 inline-block px-4 py-2 rounded-lg text-sm" style={{background:'#FBF7E8',border:'1px solid #F5EBC5',color:'#92660a'}}>
            ⚠️ Concept programme — subject to change. Final schedule emailed to registered attendees.
          </div>
        </div>
        <div className="mt-8">
          {items.map((item, i) => (
            <ScheduleItem key={item.id} time={item.time} title={item.title} description={item.description} speaker={item.speaker} location={item.location} isLast={i === items.length - 1}/>
          ))}
        </div>
      </div>
    </div>
  )
}
