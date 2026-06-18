import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-playfair text-white text-lg mb-2">SHEDESA Reunion 2026</h3>
            <p className="text-sm leading-relaxed">Sacred Heart College Douala alumni — reconnecting, celebrating, and building our community together.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[{href:'/register',label:'Register'},{href:'/pay',label:'Pay for Event'},{href:'/donate',label:'Donate'},{href:'/faq',label:'FAQ'},{href:'/privacy',label:'Privacy Policy'},{href:'/terms',label:'Terms of Use'}].map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:yoloreunion@gmail.com" className="flex items-center gap-2 hover:text-white"><Mail size={14}/> yoloreunion@gmail.com</a>
              <a href="https://wa.me/237600000000" className="flex items-center gap-2 hover:text-white" target="_blank" rel="noopener noreferrer"><Phone size={14}/> +237 600 000 000</a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Sacred Heart College Douala (SHEDESA) Reunion Committee. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
