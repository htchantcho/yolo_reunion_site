const objectives = [
  { emoji: '🤝', title: 'Networking', desc: 'Reconnect former classmates, teachers, and staff across generations and borders.' },
  { emoji: '🏫', title: 'Support the School', desc: 'Fund improvements to Sacred Heart College Douala\'s infrastructure and resources.' },
  { emoji: '❤️', title: 'Charity', desc: 'Raise funds for community development initiatives championed by the SHEDESA alumni.' },
  { emoji: '🎓', title: 'Mentorship', desc: 'Connect experienced alumni with current students and recent graduates.' },
  { emoji: '💰', title: 'Fundraising', desc: 'Build a sustainable alumni fund to support ongoing school and community development.' },
  { emoji: '📚', title: 'Preserve History', desc: 'Document and celebrate the rich history of Sacred Heart College Douala.' },
]
export function Objectives() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Our Objectives</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">The SHEDESA reunion is built around six core pillars that define our vision for the alumni community.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map(({ emoji, title, desc }) => (
            <div key={title} className="rounded-xl border border-neutral-200 p-6 hover:border-[#8B1A1A]/30 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-playfair text-lg font-bold text-neutral-900 mb-2">{title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
