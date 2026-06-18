import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'About | SHEDESA Reunion 2026', description: 'Learn about Sacred Heart College Douala and the SHEDESA reunion community.' }
const visionItems = ['Build a self-sustaining alumni fund that supports the school annually.','Create a mentorship pipeline connecting SHEDESA graduates with current students.','Establish a scholarship programme for deserving students in need.','Digitise and preserve the full history of Sacred Heart College Douala.','Grow the SHEDESA alumni network to every corner of the world.']
export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">About the Reunion</h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">Understanding the heart behind the Sacred Heart College Douala (SHEDESA) reunion — our history, purpose, and vision.</p>
        </div>
        <div className="space-y-12">
          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4 border-l-4 pl-4" style={{borderColor:'#8B1A1A'}}>History of Sacred Heart College Douala</h2>
            <div className="text-neutral-700 space-y-4 leading-relaxed">
              <p>Sacred Heart College Douala — affectionately known as SHEDESA — is one of Cameroon's most respected educational institutions. Founded with a mission of academic excellence and moral formation, the school has shaped thousands of young minds over the decades, producing leaders, professionals, and community builders across Cameroon and the world.</p>
              <p>The SHEDESA reunion tradition began as a modest gathering of former students seeking to maintain the bonds forged in those school corridors. What started as a local get-together has grown into an internationally attended celebration of shared identity — a testament to how deeply Sacred Heart College Douala leaves its mark on all who pass through its gates.</p>
            </div>
          </section>
          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4 border-l-4 pl-4" style={{borderColor:'#8B1A1A'}}>Purpose of the Reunion</h2>
            <p className="text-neutral-700 leading-relaxed">The SHEDESA reunion exists to reconnect former students, faculty, and staff — not merely for nostalgia, but to transform shared history into collective action. We gather to celebrate what Sacred Heart College Douala gave us, and to give back in kind.</p>
          </section>
          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6 border-l-4 pl-4" style={{borderColor:'#8B1A1A'}}>Our Objectives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{title:'Networking',desc:'Reconnect across generations and borders.'},{title:'School Support',desc:"Fund improvements to Sacred Heart College Douala's infrastructure."},{title:'Charity',desc:'Raise funds for community development initiatives.'},{title:'Mentorship',desc:'Link experienced alumni with current students.'},{title:'Fundraising',desc:'Build a sustainable alumni fund.'},{title:'Preserving History',desc:"Document and celebrate the school's rich legacy."}].map(obj => (
                <div key={obj.title} className="rounded-xl p-5 border" style={{background:'#FDF2F2',borderColor:'#FAE2E2'}}>
                  <h3 className="font-semibold mb-1" style={{color:'#7A1616'}}>{obj.title}</h3>
                  <p className="text-sm text-neutral-600">{obj.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4 border-l-4 pl-4" style={{borderColor:'#8B1A1A'}}>Our Vision for the Future</h2>
            <ul className="space-y-3">
              {visionItems.map(item => (
                <li key={item} className="flex items-start gap-3 text-neutral-700">
                  <span className="mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{background:'#D4AF37'}}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
