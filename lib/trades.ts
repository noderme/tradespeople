export interface Trade {
  slug: string
  name: string
  plural: string
  headline: string
  subheadline: string
  jobExamples: string[]
  quoteExample: string
  faqs: { q: string; a: string }[]
}

export const TRADES: Trade[] = [
  {
    slug: 'plumbers',
    name: 'Plumber',
    plural: 'Plumbers',
    headline: 'Quoting software for plumbers',
    subheadline: 'Send a professional plumbing quote to your customer in 60 seconds — from your phone, on-site.',
    jobExamples: ['Replacing a boiler', 'Fixing a burst pipe', 'Installing a new bathroom suite', 'Unblocking drains', 'Fitting a new kitchen tap'],
    quoteExample: 'replaced kitchen tap, 1.5 hours labour at £55/hr, new fitting £12, call-out £30',
    faqs: [
      { q: 'How do I quote a plumbing job?', a: 'Describe the job in plain English — labour hours, parts, and call-out fee. TradeQuote turns it into a professional PDF quote in seconds.' },
      { q: 'What should a plumbing quote include?', a: 'Labour rate, itemised parts and materials, call-out fee, VAT, and your total. Always include your business name and a validity period.' },
      { q: 'How fast should I send a plumbing quote?', a: 'Aim to send it within 30 minutes of the site visit. Customers who receive quotes quickly are far more likely to accept them.' },
    ],
  },
  {
    slug: 'electricians',
    name: 'Electrician',
    plural: 'Electricians',
    headline: 'Quoting software for electricians',
    subheadline: 'Create professional electrical quotes on-site. Send a branded PDF to your customer before you leave.',
    jobExamples: ['Consumer unit replacement', 'Adding new circuits', 'Installing sockets and switches', 'Fault finding and repairs', 'EV charger installation'],
    quoteExample: 'replaced consumer unit 10-way, 5 hours labour at £65/hr, unit £180, testing and cert included',
    faqs: [
      { q: 'What should an electrician quote include?', a: 'Labour rate, itemised materials, your NICEIC/NAPIT number, VAT, total, and a validity period. For larger jobs, include certification costs.' },
      { q: 'How do I price electrical work?', a: 'Calculate your hourly labour rate, list all materials at cost plus markup, and add a contingency for unexpected complications. TradeQuote helps you build this in seconds.' },
      { q: 'Can I send electrical quotes from my phone?', a: 'Yes. TradeQuote works on any device. Describe the job, review the quote, and email a branded PDF — all from your phone.' },
    ],
  },
  {
    slug: 'hvac-technicians',
    name: 'HVAC Technician',
    plural: 'HVAC Technicians',
    headline: 'Quoting software for HVAC technicians',
    subheadline: 'Quote HVAC installations and service calls in seconds. Professional PDF estimates sent directly to your customer.',
    jobExamples: ['Air conditioning installation', 'Heat pump installation', 'Boiler service and repair', 'Ductwork installation', 'Commercial HVAC servicing'],
    quoteExample: 'installed split AC unit Mitsubishi 3.5kW, 6 hours labour at £70/hr, unit £850, commissioning and F-Gas cert included',
    faqs: [
      { q: 'What\'s the difference between an HVAC estimate and a quote?', a: 'A quote is a fixed price. An estimate may vary once work begins. Use a quote for installations with defined scope; an estimate for diagnostic or fault-finding work.' },
      { q: 'What should an HVAC quote include?', a: 'Equipment model and specs, labour, commissioning, F-Gas certification work, disposal of old units, warranty terms, and payment terms.' },
      { q: 'How do I quote HVAC jobs faster?', a: 'Use TradeQuote to describe the job in plain English. The AI extracts all line items and builds a professional PDF quote in under 60 seconds.' },
    ],
  },
  {
    slug: 'roofers',
    name: 'Roofer',
    plural: 'Roofers',
    headline: 'Quoting software for roofers',
    subheadline: 'Send professional roofing quotes on-site. Beat the competition by getting your quote in first.',
    jobExamples: ['Full roof replacement', 'Flat roof repair', 'Guttering replacement', 'Ridge tile repointing', 'Chimney pointing and flashing'],
    quoteExample: 'replaced 40 broken concrete roof tiles, 2 days labour at £350/day, tiles £180, scaffolding hire £220',
    faqs: [
      { q: 'What should a roofing quote include?', a: 'Labour (daily or hourly), materials itemised, scaffolding hire, skip hire if needed, VAT, and total. Include a note about weather-dependent scheduling.' },
      { q: 'How do I win more roofing jobs?', a: 'Speed matters. Send your quote the same day as the survey. Customers who get multiple quotes often go with whoever responds first with a professional document.' },
      { q: 'Can I quote roofing jobs from my phone?', a: 'Yes. TradeQuote generates a branded PDF quote from a plain English job description — works on any phone, no app download needed.' },
    ],
  },
  {
    slug: 'gas-engineers',
    name: 'Gas Engineer',
    plural: 'Gas Engineers',
    headline: 'Quoting software for gas engineers',
    subheadline: 'Create professional gas service and installation quotes in seconds. Branded PDF, emailed directly to your customer.',
    jobExamples: ['Boiler installation', 'Boiler service', 'Gas safety certificate', 'Radiator installation', 'Gas leak repair'],
    quoteExample: 'Worcester Bosch 30i boiler installation, 8 hours labour at £75/hr, boiler £900, flue kit £85, Gas Safe cert included',
    faqs: [
      { q: 'What should a gas engineer quote include?', a: 'Labour, equipment (with model numbers), flue and ancillary parts, Gas Safe certification, and whether a landlord safety certificate is included.' },
      { q: 'Do I need to include my Gas Safe number on quotes?', a: 'It\'s not legally required on a quote, but including it builds customer trust and demonstrates you\'re registered. TradeQuote lets you include it in your business profile.' },
      { q: 'How do I quote boiler installations quickly?', a: 'Describe the boiler model, labour, and any extras in plain English. TradeQuote structures it into a professional PDF quote in under 60 seconds.' },
    ],
  },
  {
    slug: 'builders',
    name: 'Builder',
    plural: 'Builders',
    headline: 'Quoting software for builders',
    subheadline: 'Quote renovation, extension, and construction jobs professionally. Send branded estimates on-site.',
    jobExamples: ['Kitchen extension', 'Loft conversion', 'Bathroom renovation', 'Brick and blockwork', 'Plastering and rendering'],
    quoteExample: 'bathroom renovation: strip out, new shower tray and screen, tiling 20sqm, replastering, 5 days labour at £350/day, materials £800',
    faqs: [
      { q: 'How do I quote a building job accurately?', a: 'Break the job into phases — preparation, materials, labour, finishing. Itemise each phase clearly. A professional written quote sets expectations and protects you legally.' },
      { q: 'Should I use a fixed quote or estimate for building work?', a: 'Use fixed quotes for clearly defined scopes. Use estimates for work where unknowns exist (e.g. opening up walls). Always specify what could change and by how much.' },
      { q: 'How do builders send professional quotes?', a: 'TradeQuote lets builders describe a job in plain English and receive a formatted PDF quote in seconds — ready to email directly to the customer.' },
    ],
  },
]

export function getTrade(slug: string): Trade | undefined {
  return TRADES.find(t => t.slug === slug)
}

export function getAllTradeSlugs(): string[] {
  return TRADES.map(t => t.slug)
}
