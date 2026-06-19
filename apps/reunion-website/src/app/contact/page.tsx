import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { Mail, Phone } from 'lucide-react'
export const metadata: Metadata = { title: 'Contact | SHEDESA Reunion 2026' }
export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">Contact Us</h1>
          <p className="text-neutral-600 text-lg">Have a question? Our team is here to help.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-8">
              <a href="mailto:yoloreunion@gmail.com" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-[#8B1A1A]/30 hover:bg-[#FDF2F2] transition-all">
                <Mail size={20} style={{color:'#8B1A1A'}}/>
                <div><p className="text-xs text-neutral-500">Email</p><p className="font-medium text-neutral-900">yoloreunion@gmail.com</p></div>
              </a>
              <a href="https://wa.me/12402716512" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-green-300 hover:bg-green-50 transition-all">
                <Phone size={20} className="text-green-500"/>
                <div><p className="text-xs text-neutral-500">WhatsApp</p><p className="font-medium text-neutral-900">+1 240 271 6512</p></div>
              </a>
            </div>
            <div className="rounded-xl p-5 border" style={{background:'#FDF2F2',borderColor:'#FAE2E2'}}>
              <h3 className="font-semibold mb-2" style={{color:'#7A1616'}}>Response Time</h3>
              <p className="text-sm text-neutral-600">We respond to all inquiries within 24 hours. For urgent matters, please use WhatsApp.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
            <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-6">Send a Message</h2>
            <ContactForm/>
          </div>
        </div>
      </div>
    </div>
  )
}
