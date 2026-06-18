import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
export const metadata: Metadata = { title: 'FAQ | SHEDESA Reunion 2026' }
const categories = [{key:'registration',label:'Registration'},{key:'verification',label:'Alumni Verification'},{key:'payment',label:'Payment & Fees'},{key:'donation',label:'Donations'},{key:'general',label:'General'}]
export default async function FAQPage() {
  const items = await db.fAQItem.findMany({ where: { published: true }, orderBy: [{ category: 'asc' }, { order: 'asc' }] })
  const byCategory = categories.map(cat => ({ ...cat, items: items.filter(i => i.category === cat.key) })).filter(c => c.items.length > 0)
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-neutral-600 text-lg">Everything you need to know about the Sacred Heart College Douala (SHEDESA) Reunion 2026.</p>
        </div>
        <div className="space-y-10">
          {byCategory.map(cat => (
            <div key={cat.key}>
              <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">{cat.label}</h2>
              <Accordion className="space-y-2">
                {cat.items.map(item => (
                  <AccordionItem key={item.id} value={item.id} className="border border-neutral-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium text-neutral-800 py-4">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-neutral-600 pb-4 leading-relaxed">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
