export const EVENT = {
  name: 'SHEDESA Reunion 2026',
  fullName: 'Sacred Heart College Douala (SHEDESA)',
  date: new Date('2026-12-19T10:00:00'),
  dateDisplay: 'December 19, 2026',
  location: 'Douala, Cameroon',
  venue: 'TBD — Sacred Heart College Douala',
  registrationFee: 25000,
  registrationFeeDisplay: '25,000 XAF',
  contactEmail: 'yoloreunion@gmail.com',
  contactWhatsApp: '+12402716512',
  socialLinks: { facebook: '', instagram: '', twitter: '' },
} as const

export const TRADE_FAIR = {
  vendorFee: 10000,
  vendorFeeDisplay: '10,000 XAF',
  spotLimit: 15,
} as const

// Shared MTN/Orange Money numbers used for both event and vendor payments
export const PAYMENT_NUMBERS = {
  mtn: '+237 679 371 356',
  orange: '+237 691 241 454',
  whatsapp: '+237 683 031 320',
} as const
