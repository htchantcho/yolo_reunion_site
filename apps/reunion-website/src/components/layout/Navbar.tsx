'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programme', label: 'Programme' },
  { href: '/faq', label: 'FAQ' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
]
export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
            <span className="font-playfair font-bold text-[#8B1A1A] text-lg leading-none">SHEDESA</span>
            <span className="text-xs text-neutral-500 leading-none">Reunion 2026</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-neutral-700 hover:text-[#8B1A1A] transition-colors">{l.label}</Link>
            ))}
          </nav>
          <div className="hidden md:flex">
            <Link href="/register" className={buttonVariants({ size: 'sm' }) + ' bg-[#8B1A1A] hover:bg-[#7A1616] text-white'}>
              Register Now
            </Link>
          </div>
          <button className="md:hidden p-2 text-neutral-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="block py-2 text-base font-medium text-neutral-700 hover:text-[#8B1A1A]" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/register" onClick={() => setOpen(false)} className={buttonVariants() + ' w-full bg-[#8B1A1A] hover:bg-[#7A1616] text-white mt-2 justify-center'}>
            Register Now
          </Link>
        </div>
      )}
    </header>
  )
}
