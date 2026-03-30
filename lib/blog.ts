export interface BlogPost {
  slug: string
  title: string
  metaDescription: string
  date: string
  readTime: string
  content: string // HTML string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-quote-a-plumbing-job',
    title: 'How to Quote a Plumbing Job: A Complete Guide for Plumbers',
    metaDescription: 'Learn how to quote a plumbing job accurately and professionally. Covers labour rates, materials, call-out fees, and how to send a quote to a customer fast.',
    date: '2026-03-20',
    readTime: '5 min',
    content: `
      <p class="lead">Quoting a plumbing job accurately is one of the most important skills you can have as a tradesperson. Quote too low and you lose money. Quote too high and you lose the job. This guide covers how to build a professional plumbing quote quickly — even on-site.</p>

      <h2>What Should a Plumbing Quote Include?</h2>
      <p>A professional plumbing quote should always include:</p>
      <ul>
        <li><strong>Labour rate</strong> — hourly or fixed price, clearly stated</li>
        <li><strong>Materials and parts</strong> — itemised list with individual prices</li>
        <li><strong>Call-out fee</strong> — if applicable, make it visible</li>
        <li><strong>VAT or tax</strong> — clearly shown before the total</li>
        <li><strong>Your business name and contact details</strong></li>
        <li><strong>Quote validity period</strong> — e.g. "valid for 30 days"</li>
      </ul>

      <h2>How to Estimate Labour Time</h2>
      <p>The biggest mistake plumbers make when quoting is underestimating labour. Always add a buffer for:</p>
      <ul>
        <li>Access issues (pipes behind tiles, tight spaces)</li>
        <li>Finding and sourcing parts</li>
        <li>Unexpected complications once you open up the wall</li>
        <li>Customer questions and sign-off time</li>
      </ul>
      <p>As a rule of thumb: estimate the time you think it'll take, then add 20-30%.</p>

      <h2>Quote vs Estimate: What's the Difference?</h2>
      <p>A <strong>quote</strong> is a fixed price offer — the customer pays exactly that unless the scope changes. An <strong>estimate</strong> is an approximation that may vary. Always be clear which one you're giving. Misunderstandings here are the #1 cause of payment disputes.</p>

      <h2>How to Send a Quote Fast (Without Going Back to the Office)</h2>
      <p>The best time to send a quote is while you're still in the customer's driveway. Customers who receive a quote within an hour of a visit are far more likely to accept it.</p>
      <p>With TradeQuote, you can describe the job in plain English — "replaced kitchen tap, 2 hours labour, £45 parts" — and get a branded PDF quote sent to the customer's email in under 60 seconds. No laptop, no spreadsheet, no waiting until you get home.</p>

      <h2>What's a Fair Labour Rate for Plumbers?</h2>
      <p>In the UK, plumbing labour rates typically range from £40–£80/hour depending on region and specialisation. Gas engineers (Gas Safe registered) command a premium. Always check local rates in your area — don't underprice just to win work.</p>

      <h2>Final Checklist Before Sending a Quote</h2>
      <ul>
        <li>Is the customer name and address correct?</li>
        <li>Are all line items itemised clearly?</li>
        <li>Is VAT/tax calculated correctly?</li>
        <li>Does the total match your verbal estimate?</li>
        <li>Have you included your business logo and contact details?</li>
      </ul>
      <p>A clean, professional quote builds trust before the job even starts.</p>
    `,
  },

  {
    slug: 'electrician-quoting-software',
    title: 'Best Electrician Quoting Software in 2025 (Free & Paid)',
    metaDescription: 'Looking for electrician quoting software? Compare the best options for creating and sending professional electrical quotes fast — including AI-powered tools.',
    date: '2026-03-22',
    readTime: '4 min',
    content: `
      <p class="lead">Electricians spend hours quoting jobs that should take minutes. The right quoting software can cut that time to under 60 seconds — and get you paid faster. Here's what to look for and what's available in 2025.</p>

      <h2>What Makes Good Electrician Quoting Software?</h2>
      <p>The best quoting tools for electricians share a few key traits:</p>
      <ul>
        <li><strong>Works on mobile</strong> — you're on-site, not at a desk</li>
        <li><strong>PDF output</strong> — customers expect a professional document, not a text message</li>
        <li><strong>Your branding</strong> — your business name, logo, and contact on every quote</li>
        <li><strong>Fast input</strong> — describe the job in plain English, not fill in 15 form fields</li>
        <li><strong>Email delivery</strong> — send directly from the app while still on-site</li>
      </ul>

      <h2>Types of Electrician Quoting Tools</h2>

      <h3>Spreadsheet Templates (Free, Slow)</h3>
      <p>Most electricians start with Excel or Google Sheets. It works, but it's slow, looks unprofessional, and you can't easily send it from your phone. Fine for occasional use, not for a busy business.</p>

      <h3>Full Job Management Software (Expensive, Overkill)</h3>
      <p>Tools like Tradify, ServiceM8, and Simpro include quoting as part of a larger job management suite. They're powerful but cost £40–£100+/month and take weeks to set up. If you just need to quote jobs quickly, this is overkill.</p>

      <h3>AI-Powered Quote Apps (Fast, Simple)</h3>
      <p>Tools like TradeQuote let you describe a job in plain English — "installed 10 double sockets, rewired consumer unit, 4 hours labour" — and generate a professional branded PDF instantly. Works via ChatGPT, Claude, or the web app. Starts at £29/month.</p>

      <h2>What Should an Electrician Quote Include?</h2>
      <ul>
        <li>Labour rate (hourly or fixed)</li>
        <li>Itemised materials (cable, sockets, consumer units, etc.)</li>
        <li>Call-out or survey fee if applicable</li>
        <li>VAT clearly stated</li>
        <li>Total</li>
        <li>Your NICEIC/NAPIT registration number (builds trust)</li>
        <li>Quote validity period</li>
      </ul>

      <h2>How Fast Should You Send a Quote?</h2>
      <p>Studies consistently show that the faster you send a quote after a site visit, the higher your acceptance rate. Aim to send while you're still in the customer's street. Customers who receive a quote within 30 minutes are 3x more likely to accept than those who receive it the next day.</p>

      <h2>Bottom Line</h2>
      <p>If you're quoting more than 5 jobs a week, a dedicated tool pays for itself immediately. For quick, professional quotes you can send from your phone in seconds, TradeQuote is built specifically for tradespeople.</p>
    `,
  },

  {
    slug: 'how-to-get-paid-faster-as-a-tradesman',
    title: 'How to Get Paid Faster as a Tradesman: 7 Practical Tips',
    metaDescription: 'Tired of chasing payments? These 7 tips help tradespeople — plumbers, electricians, HVAC techs — get paid faster without awkward conversations.',
    date: '2026-03-24',
    readTime: '4 min',
    content: `
      <p class="lead">Late payments are the #1 cash flow problem for tradespeople. Most of them are preventable. Here are 7 things you can do right now to get paid faster — without chasing customers or having awkward conversations.</p>

      <h2>1. Send the Quote Before You Leave the Job</h2>
      <p>The longer you wait to send a quote, the lower your acceptance rate and the slower the payment cycle. Send it while the customer is still standing in front of you. Use a tool like TradeQuote that lets you send a branded PDF from your phone in 60 seconds.</p>

      <h2>2. Always Use a Written Quote — Never Verbal</h2>
      <p>Verbal quotes lead to disputes. A written quote sets clear expectations. When the customer approves it in writing, you have a paper trail if anything goes wrong. This alone eliminates most payment disputes.</p>

      <h2>3. Set Clear Payment Terms on Every Quote</h2>
      <p>Always state your payment terms on the quote itself: "Payment due within 7 days of invoice" or "50% deposit required before work starts." If it's not written down, customers assume they can pay whenever they like.</p>

      <h2>4. Request a Deposit for Larger Jobs</h2>
      <p>For jobs over £500, ask for a 25–50% deposit upfront. This weeds out timewasters, covers your materials, and demonstrates the customer is serious. Most professional customers expect this.</p>

      <h2>5. Invoice Immediately After Completion</h2>
      <p>Don't wait until the end of the week to send invoices. Send the final invoice the same day the job is done, while the work is fresh in the customer's mind and they're still happy with it.</p>

      <h2>6. Follow Up Systematically</h2>
      <p>Have a follow-up process: a reminder at 7 days, a firmer message at 14 days, and a call at 21 days. Most late payments happen because nobody followed up — not because the customer intended to not pay.</p>

      <h2>7. Make It Easy to Pay</h2>
      <p>The harder it is to pay, the longer customers delay. Include your bank details or a payment link directly in the quote. Accepting bank transfer, card, or even PayPal removes every friction point.</p>

      <h2>The Fastest Way to Start</h2>
      <p>The single biggest change most tradespeople can make is to send quotes and invoices faster and more professionally. TradeQuote lets you send a branded PDF quote on-site in under a minute — from ChatGPT, Claude, or the web app.</p>
    `,
  },

  {
    slug: 'hvac-estimate-vs-quote',
    title: 'HVAC Estimate vs Quote: What\'s the Difference and Why It Matters',
    metaDescription: 'Not sure whether to give customers an HVAC estimate or a fixed quote? This guide explains the difference and how to use each one correctly to avoid payment disputes.',
    date: '2026-03-26',
    readTime: '3 min',
    content: `
      <p class="lead">Many HVAC technicians use "estimate" and "quote" interchangeably — but legally and practically, they're different. Getting this wrong can lead to disputes, unpaid invoices, and damaged customer relationships.</p>

      <h2>What is an HVAC Estimate?</h2>
      <p>An estimate is an approximation of what a job will cost. It's not a binding price — the actual invoice may be higher or lower depending on what you find once the job starts. Estimates are common for:</p>
      <ul>
        <li>Fault diagnosis jobs where you don't know the cause yet</li>
        <li>System replacements where final equipment choice isn't confirmed</li>
        <li>Reactive maintenance where access difficulty is unknown</li>
      </ul>
      <p>Always make it clear in writing that an estimate may change.</p>

      <h2>What is an HVAC Quote?</h2>
      <p>A quote is a fixed price offer. If the customer accepts it, you must do the work for that price — regardless of how long it takes or what complications arise. Quotes are better for:</p>
      <ul>
        <li>New installations where you know exactly what's needed</li>
        <li>Planned maintenance with a defined scope</li>
        <li>Replacement work where equipment is already specified</li>
      </ul>

      <h2>Which Should You Use?</h2>
      <p>Use a <strong>quote</strong> whenever you're confident about the scope. Use an <strong>estimate</strong> when there are unknowns — but always be explicit about what could change and by how much.</p>
      <p>Customers generally prefer a fixed quote because it removes uncertainty. If you can give one, do. It builds trust and removes the #1 cause of post-job disputes.</p>

      <h2>How to Write a Professional HVAC Quote</h2>
      <p>A good HVAC quote includes:</p>
      <ul>
        <li>Equipment model numbers and specifications</li>
        <li>Labour time and rate</li>
        <li>Any warranty on parts and labour</li>
        <li>Whether F-Gas certification work is included</li>
        <li>Commissioning and testing fees</li>
        <li>Disposal costs for old units</li>
        <li>Payment terms</li>
      </ul>
      <p>TradeQuote lets HVAC techs generate a fully itemised PDF quote from a plain English job description — in under 60 seconds, directly from ChatGPT or the app.</p>
    `,
  },

  {
    slug: 'ai-quote-generator-for-tradespeople',
    title: 'AI Quote Generator for Tradespeople: How It Works and Why It\'s Faster',
    metaDescription: 'AI quote generators let plumbers, electricians, and HVAC techs create professional PDF job quotes in seconds. Here\'s how they work and what to look for.',
    date: '2026-03-28',
    readTime: '4 min',
    content: `
      <p class="lead">AI is changing how tradespeople quote jobs. Instead of filling out forms or copying last week's quote and editing it, you can now describe a job in plain English and get a professional PDF ready to send in under 60 seconds.</p>

      <h2>How an AI Quote Generator Works</h2>
      <p>The basic process:</p>
      <ol>
        <li>You describe the job in plain English — "fitted new consumer unit, 6 hours labour, parts £180"</li>
        <li>The AI extracts line items, quantities, labour, and materials</li>
        <li>It structures them into a professional quote with your business branding</li>
        <li>You send the PDF to the customer by email — directly from the app</li>
      </ol>
      <p>No forms, no templates to fill in, no going back to the office. The whole thing takes less than a minute.</p>

      <h2>Why It's Faster Than Traditional Quoting</h2>
      <p>Traditional quoting involves:</p>
      <ul>
        <li>Remembering every line item from the job</li>
        <li>Opening a spreadsheet or invoicing tool</li>
        <li>Typing each item manually</li>
        <li>Calculating subtotals and tax</li>
        <li>Exporting or saving to PDF</li>
        <li>Attaching to an email</li>
      </ul>
      <p>That's 10–20 minutes per quote. An AI tool reduces this to under 60 seconds.</p>

      <h2>Works Where You Already Work</h2>
      <p>TradeQuote integrates directly into the AI tools you may already use:</p>
      <ul>
        <li><strong>ChatGPT</strong> — install the TradeQuote GPT from the ChatGPT store</li>
        <li><strong>Claude</strong> — available as a skill in Claude</li>
        <li><strong>Web app</strong> — full dashboard for managing all your quotes</li>
        <li><strong>WhatsApp</strong> — send quotes via WhatsApp bot</li>
      </ul>

      <h2>What Trades Is It Best For?</h2>
      <p>AI quoting tools work well for any trade with variable job scopes:</p>
      <ul>
        <li>Plumbers quoting repair and installation jobs</li>
        <li>Electricians quoting rewires, additions, and fault-finding</li>
        <li>HVAC technicians quoting installations and servicing</li>
        <li>Roofers quoting repairs and replacements</li>
        <li>Gas engineers quoting boiler work</li>
        <li>Builders quoting renovation and extension work</li>
      </ul>

      <h2>Is It Accurate?</h2>
      <p>The AI extracts exactly what you describe. If you say "3 hours labour at £55/hour", it calculates £165. Your stored pricing history is used to suggest rates for repeat job types. You review before sending — so accuracy is in your hands.</p>
    `,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map(p => p.slug)
}
