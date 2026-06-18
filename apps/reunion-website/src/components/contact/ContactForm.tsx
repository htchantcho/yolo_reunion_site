'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
const schema = z.object({ name: z.string().min(2), email: z.string().email(), category: z.enum(['registration','payment','verification','sponsorship','media','general']), message: z.string().min(10) })
type FormData = z.infer<typeof schema>
const categories = [{value:'registration',label:'Registration Help'},{value:'payment',label:'Payment Issue'},{value:'verification',label:'Verification Issue'},{value:'sponsorship',label:'Sponsorship'},{value:'media',label:'Media Upload'},{value:'general',label:'General Inquiry'}]
export function ContactForm() {
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch { setStatus('error') }
  }
  if (status === 'success') return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">✅</div>
      <h3 className="font-playfair text-xl font-bold text-neutral-900 mb-2">Message Sent!</h3>
      <p className="text-neutral-600">We will respond within 24 hours.</p>
    </div>
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div><Label htmlFor="name">Full Name</Label><Input id="name" {...register('name')} placeholder="Your name" className="mt-1"/>{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}</div>
      <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" {...register('email')} placeholder="you@example.com" className="mt-1"/>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}</div>
      <div><Label>Category</Label><Select onValueChange={(val) => setValue('category', val as FormData['category'])}><SelectTrigger className="mt-1"><SelectValue placeholder="Select a category"/></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>{errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}</div>
      <div><Label htmlFor="message">Message</Label><Textarea id="message" {...register('message')} placeholder="How can we help?" rows={5} className="mt-1"/>{errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}</div>
      <Button type="submit" disabled={status === 'loading'} className="w-full text-white" style={{background:'#8B1A1A'}}>{status === 'loading' ? 'Sending...' : 'Send Message'}</Button>
      {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please email us directly at yoloreunion@gmail.com</p>}
    </form>
  )
}
