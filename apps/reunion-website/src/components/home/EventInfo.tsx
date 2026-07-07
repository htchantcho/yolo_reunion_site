import { CalendarDays, MapPin, Users, Heart } from 'lucide-react'
const highlights = [
  { icon: CalendarDays, label: 'Event Date', value: 'December 19, 2026' },
  { icon: MapPin, label: 'Location', value: 'Douala, Cameroon' },
  { icon: Users, label: 'Who Attends', value: 'All SHEDESA alumni worldwide' },
  { icon: Heart, label: 'Entry Fee', value: '25,000 XAF' },
]
export function EventInfo() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">About the Reunion</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">The Sacred Heart College Douala (SHEDESA) reunion brings together former students from across generations and across the world.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{background:'#FDF2F2'}}>
                <Icon size={22} style={{color:'#8B1A1A'}}/>
              </div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-semibold text-neutral-900 text-sm">{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 max-w-3xl mx-auto">
          <h3 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">Our Story</h3>
          <div className="text-neutral-600 space-y-4">
            <p>Sacred Heart College Douala — known by its alumni as SHEDESA — has been shaping minds and characters in Cameroon for decades. Our alumni span the globe, carrying with them the values of excellence, integrity, and community instilled within those beloved walls.</p>
            <p>The SHEDESA reunion is our celebration of that shared heritage — a moment to step away from the hustle of modern life and return to the friendships, the laughter, and the pride of being part of something larger than ourselves.</p>
            <p>This year's reunion is more than a gathering. It is a milestone — a chance to honour the school that formed us, support its future, and lay the groundwork for a lasting alumni community that gives back for generations to come.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
