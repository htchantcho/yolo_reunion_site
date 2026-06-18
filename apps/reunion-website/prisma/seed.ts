import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.programmeItem.createMany({ skipDuplicates: true, data: [
    { time: '9:00 AM', title: 'Arrival & Registration', description: 'Welcome desk, name badges, and refreshments', order: 1 },
    { time: '10:00 AM', title: 'Welcome Speech', description: 'Opening remarks by the Reunion Committee Chair', order: 2 },
    { time: '10:30 AM', title: 'School History & Alumni Recognition', description: 'Celebrating milestones and honouring distinguished alumni', order: 3 },
    { time: '12:00 PM', title: 'Networking Session', description: 'Connect with former classmates and faculty', order: 4 },
    { time: '1:00 PM', title: 'Lunch', description: 'Shared meal — traditional and international options', order: 5 },
    { time: '2:30 PM', title: 'Fundraising & Charity Segment', description: 'Presentations and pledges for the school support fund', order: 6 },
    { time: '3:30 PM', title: 'Entertainment', description: 'Music, performances, and celebrations', order: 7 },
    { time: '5:00 PM', title: 'Group Photos', description: 'Official reunion photographs by class and batch', order: 8 },
    { time: '5:30 PM', title: 'Closing Remarks', description: 'Thank you from the committee and preview of next reunion', order: 9 },
  ]})
  await prisma.fAQItem.createMany({ skipDuplicates: true, data: [
    { question: 'Who can register?', answer: 'Any former student of Sacred Heart College Douala (SHEDESA) is welcome to register. You will need to verify your alumni status during registration.', category: 'registration', order: 1 },
    { question: 'How does SHEDESA alumni verification work?', answer: 'During registration, you enter your name, class year, batch, and other school details. Our system searches the alumni database for a match. If found, you proceed immediately. If not, you submit a manual verification request reviewed within 48 hours.', category: 'verification', order: 2 },
    { question: 'What if my name is not in the database?', answer: 'Submit a manual verification request with your name, graduation year, class, and any supporting details. Our admin team will review and respond within 48 hours.', category: 'verification', order: 3 },
    { question: 'How do I pay?', answer: 'After verification, you receive a payment link via email. You can pay via MTN Mobile Money, Orange Money, credit/debit card, or PayPal.', category: 'payment', order: 4 },
    { question: 'Which payment methods are accepted?', answer: 'MTN Mobile Money, Orange Money, international credit/debit cards, and PayPal. Bank transfer is also available — contact us for details.', category: 'payment', order: 5 },
    { question: 'Can I bring a guest?', answer: 'Yes. Guest details and fees are collected during registration.', category: 'registration', order: 6 },
    { question: 'Can I donate without attending?', answer: 'Absolutely. Visit our Donate page to contribute to the charity fund, school support, or alumni projects without registering for the event.', category: 'donation', order: 7 },
    { question: 'How do I get my receipt?', answer: 'Receipts are emailed automatically after successful payment. You can also download your receipt from your registration confirmation page.', category: 'payment', order: 8 },
    { question: 'Can I update my registration?', answer: 'Yes. Contact us at info@shedesareunion.com with your registration ID and the changes needed.', category: 'registration', order: 9 },
    { question: 'What is the refund policy?', answer: 'Refunds are available up to 30 days before the event. Contact info@shedesareunion.com. Donations are non-refundable.', category: 'payment', order: 10 },
    { question: 'Who do I contact for help?', answer: 'Email info@shedesareunion.com or WhatsApp +237600000000. Our team responds within 24 hours.', category: 'general', order: 11 },
  ]})
  await prisma.testimonial.createMany({ skipDuplicates: true, data: [
    { name: 'Jean-Paul Mbarga', classYear: 'Class of 1995', quote: 'SHEDESA shaped who I am. The values I learned there still guide me every day. The reunion brought it all back — tears, laughter, and pride.', order: 1 },
    { name: 'Marie-Claire Ngo', classYear: 'Class of 2001', quote: 'Seeing faces I had not seen in 20 years was magical. Sacred Heart gave us a bond that time cannot break.', order: 2 },
    { name: 'Emmanuel Fotso', classYear: 'Class of 1988', quote: 'The reunion reminded me why we all carry SHEDESA with us wherever we go in the world. This community is for life.', order: 3 },
  ]})
  console.log('Seed complete.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
