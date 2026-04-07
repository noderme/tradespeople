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
    slug: 'how-to-get-more-google-reviews-as-a-tradesperson',
    title: 'How to Get More Google Reviews as a Tradesperson (Without Asking Awkwardly)',
    metaDescription: 'Google reviews are the #1 factor customers use to choose a tradesperson. Here\'s how plumbers, electricians, and HVAC techs get more reviews without the awkward ask.',
    date: '2026-04-01',
    readTime: '4 min',
    content: `
      <p class="lead">When someone needs a plumber or electrician, the first thing they do is Google it and read the reviews. Five stars with 40 reviews wins over five stars with 3 — every time. Yet most tradespeople have far fewer reviews than they deserve. Here's why, and how to fix it.</p>

      <h2>Why Tradespeople Don't Get Enough Reviews</h2>
      <p>It's not because customers are unhappy. Most jobs go well. The problem is timing and friction:</p>
      <ul>
        <li>You finish the job, say goodbye, and drive off — the moment is gone</li>
        <li>Asking face-to-face feels awkward ("can you leave me a review?")</li>
        <li>Following up by text feels pushy</li>
        <li>By the time you remember to ask, the customer has moved on</li>
      </ul>
      <p>The result: a customer who would have happily left 5 stars never does, simply because nobody asked at the right moment.</p>

      <h2>When Is the Right Moment?</h2>
      <p>Immediately after the job — within the hour. That's when the customer is most satisfied, the work is fresh, and goodwill is at its peak. The longer you wait, the lower the chance they'll act.</p>
      <p>This is why automated review requests work so well. The request lands in their inbox while you're still packing up the van — not three days later when they've forgotten about you.</p>

      <h2>What Makes a Good Review Request Email?</h2>
      <p>Keep it short, personal, and low pressure. The worst review requests feel like corporate spam. The best ones feel like a genuine ask from a real person.</p>
      <p>Key elements:</p>
      <ul>
        <li><strong>Your business name</strong> — so they immediately know who it's from</li>
        <li><strong>A brief thank you</strong> — acknowledge the specific visit, not a generic message</li>
        <li><strong>One clear link</strong> — straight to your Google review page, no clicking around</li>
        <li><strong>No pressure</strong> — "if you have a moment" beats "please leave us a review"</li>
      </ul>

      <h2>Google Reviews vs Yelp vs Checkatrade — Which Matters Most?</h2>
      <p>For most tradespeople in the UK and US, <strong>Google is the priority</strong>. It's where people search first, and Google reviews directly affect how high you appear in local search results. More reviews = higher ranking = more leads. Yelp and Checkatrade are secondary — focus on Google first.</p>

      <h2>Does Asking Everyone Hurt Your Rating?</h2>
      <p>This is the fear that stops most tradespeople from asking. The reality: if you do good work, the overwhelming majority of customers will leave a positive review. The rare unhappy customer is more likely to leave a review whether you ask or not — so asking everyone actually improves your average by surfacing the happy majority.</p>

      <h2>How to Automate It Completely</h2>
      <p>The most effective system is one that requires zero effort after setup:</p>
      <ol>
        <li>Finish the job</li>
        <li>Send the quote</li>
        <li>Review request goes to the customer automatically — same email, same moment</li>
      </ol>
      <p>TradeQuote does exactly this. When you send a quote to a customer, a Google review request is included automatically — no extra step, no reminder needed. The customer gets the quote and a polite review request in one email, while the job is still fresh.</p>
      <p>You can also send standalone review requests via ChatGPT — just say "send a review request to [email]" and it's done in seconds. No dashboard, no copy-pasting links, no awkward conversations.</p>

      <h2>How Many Reviews Do You Need?</h2>
      <p>There's no magic number, but local search data consistently shows that businesses with 50+ reviews significantly outperform those with under 10 — in both ranking and conversion. If you're sending 5 quotes a week and converting half to reviews, you'll hit 50 reviews in under 5 months without lifting a finger.</p>
    `,
  },
  {
    slug: 'send-a-quote-from-your-phone-on-site',
    title: 'How to Send a Professional Quote From Your Phone While Still On-Site',
    metaDescription: 'Stop going back to the office to write quotes. This is how tradespeople send branded PDF quotes to customers in under 60 seconds — directly from their phone.',
    date: '2026-03-31',
    readTime: '3 min',
    content: `
      <p class="lead">The best time to send a quote is before you leave the customer's driveway. The longer you wait, the lower your chance of winning the job. Here's exactly how to do it from your phone in under 60 seconds.</p>

      <h2>Why On-Site Quoting Wins More Work</h2>
      <p>When a customer gets three quotes, they often go with whoever responds first — not who's cheapest. Sending your quote while you're still parked outside does two things:</p>
      <ul>
        <li>It shows you're organised and professional</li>
        <li>It lands in the customer's inbox while you're still fresh in their mind</li>
      </ul>
      <p>Waiting until you get home — or worse, the next morning — means competing against other tradespeople who moved faster than you.</p>

      <h2>What TradeQuote Does</h2>
      <p>TradeQuote takes a plain English job description and turns it into a professional, branded PDF quote in under 60 seconds.</p>
      <p>You describe what you did — labour, materials, call-out fee — and the app structures it into a clean quote with your business name and logo, calculates the total, and emails it directly to your customer. No templates, no spreadsheets, no going back to the office.</p>

      <h2>Step-by-Step: Send a Quote in 60 Seconds</h2>
      <ol>
        <li><strong>Open TradeQuote</strong> — in ChatGPT, Claude, or the web app on your phone</li>
        <li><strong>Describe the job</strong> — "replaced kitchen tap, 1.5 hours labour at £55/hr, new tap fitting £18, call-out £35"</li>
        <li><strong>Review the quote</strong> — the AI builds the line items and calculates the total</li>
        <li><strong>Enter the customer's email</strong> — and hit send</li>
      </ol>
      <p>The customer receives a branded PDF quote while you're still in their street.</p>

      <h2>Works in the Tools You Already Use</h2>
      <p>TradeQuote is available as a GPT in ChatGPT, a skill in Claude, and a standalone web app. If you're already using ChatGPT on your phone, you can quote jobs without opening anything new.</p>

      <h2>What the Customer Receives</h2>
      <p>A professional PDF with:</p>
      <ul>
        <li>Your business name and branding</li>
        <li>Itemised line items (labour, parts, call-out)</li>
        <li>Subtotal, VAT, and total</li>
        <li>Your contact details</li>
      </ul>
      <p>It looks like it came from an established business — because it did.</p>

      <h2>Start Today</h2>
      <p>TradeQuote has a 7-day free trial with no credit card required. Sign up, add your business details, and send your first quote in under two minutes.</p>
    `,
  },
  {
    slug: 'how-to-write-a-job-estimate-that-wins-work',
    title: 'How to Write a Job Estimate That Wins More Work',
    metaDescription: 'A well-written job estimate does more than list prices — it builds trust and closes jobs. Here\'s exactly how tradespeople should structure estimates to win more work.',
    date: '2026-03-31',
    readTime: '5 min',
    content: `
      <p class="lead">Most tradespeople think a job estimate is just a number. It's not. A well-written estimate is a sales document — and the difference between one that wins work and one that gets ignored often comes down to a few small things.</p>

      <h2>What Is a Job Estimate?</h2>
      <p>A job estimate is an approximation of the cost to complete a piece of work. Unlike a fixed quote, an estimate acknowledges that the final price may vary if the scope changes. It's commonly used when:</p>
      <ul>
        <li>You haven't fully assessed the job yet</li>
        <li>Access or hidden conditions could affect labour time</li>
        <li>Material prices are subject to availability</li>
      </ul>
      <p>Always make it explicit that your document is an estimate, not a fixed price — this protects you legally and sets the right expectations.</p>

      <h2>The 7 Things Every Job Estimate Must Include</h2>

      <h3>1. Your Business Details</h3>
      <p>Name, trading name, phone, email, and any trade registrations (Gas Safe, NICEIC, NAPIT, etc.). This isn't just professional — it's what customers check before they decide to trust you.</p>

      <h3>2. The Customer's Details</h3>
      <p>Full name, address, and the site address if different. This avoids any confusion about what the estimate covers and for whom.</p>

      <h3>3. A Clear Description of the Work</h3>
      <p>Don't just write "boiler replacement" — write "supply and install Worcester Bosch Greenstar 30i combi boiler, including flue kit, system flush, and commissioning." The more specific you are, the fewer disputes you'll have.</p>

      <h3>4. Itemised Costs</h3>
      <p>Break out labour and materials separately. Customers don't need to know your exact margins, but they do want to see where their money is going. Itemised estimates win more often than lump-sum ones because they look transparent.</p>

      <h3>5. VAT (if applicable)</h3>
      <p>State clearly whether your prices include or exclude VAT. Showing a clean subtotal and VAT line eliminates a major source of post-job disputes.</p>

      <h3>6. What's Not Included</h3>
      <p>This is the part most tradespeople skip — and it's the most important. If your estimate doesn't cover plastering after the job, say so. If skip hire isn't included, say so. Exclusions protect you when the customer expects more than you priced for.</p>

      <h3>7. Validity Period and Payment Terms</h3>
      <p>Material prices change. Labour demand changes. Put "this estimate is valid for 30 days" on every document. Also state your payment terms upfront — "50% deposit on acceptance, balance on completion" — so there are no surprises.</p>

      <h2>How to Make Your Estimate Stand Out</h2>

      <h3>Send It the Same Day</h3>
      <p>Speed is trust. A customer who gets three estimates will often go with whoever responds first — especially if all prices are similar. Aim to send your estimate the same day as the site visit, ideally within the hour.</p>

      <h3>Use a Branded PDF, Not a Text Message</h3>
      <p>A PDF with your logo, business name, and a clear layout signals professionalism before the customer even reads a word. A text message or a number scrawled on paper does the opposite.</p>

      <h3>Include a Short Personal Note</h3>
      <p>Two sentences at the top — "Thanks for showing me around today. I've outlined everything we discussed below and I'm happy to talk through any questions." — makes you sound like a person, not a vending machine.</p>

      <h2>Estimate vs Quote: When to Use Each</h2>
      <p>Use a <strong>fixed quote</strong> when you're confident about the full scope — new installations, like-for-like replacements, or well-defined refurbishment work. Use an <strong>estimate</strong> when you're less certain — investigation work, renovation jobs with hidden conditions, or reactive repairs where the full extent isn't clear until you open things up.</p>
      <p>If you use an estimate, always give a range ("£600–£850 depending on access") rather than a single number. A single number gets treated as a fixed price by customers, even when you've said "estimate" at the top.</p>

      <h2>The Fastest Way to Write and Send an Estimate</h2>
      <p>Writing a professional estimate used to mean going back to the office, opening a spreadsheet, filling in each line item, exporting a PDF, and attaching it to an email. Most tradespeople were sending estimates the next morning at best.</p>
      <p>With TradeQuote, you describe the job in plain English — "replaced kitchen radiator, 2 hours labour, new radiator £85, valves £22, call-out £40" — and get a fully itemised, branded PDF quote sent to your customer's email in under 60 seconds. Works directly in ChatGPT, Claude, or the web app. No templates, no spreadsheets.</p>
      <p>The faster your quote lands in the customer's inbox, the more jobs you win. It's that simple.</p>
    `,
  },
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
    slug: 'how-to-set-your-labour-rate-as-a-tradesperson',
    title: 'How to Set Your Labour Rate as a Tradesperson (Without Underselling Yourself)',
    metaDescription: 'Not sure what to charge per hour? This guide helps plumbers, electricians, and HVAC techs calculate a labour rate that covers costs, pays a wage, and wins work.',
    date: '2026-04-02',
    readTime: '5 min',
    content: `
      <p class="lead">Most tradespeople set their hourly rate by guessing what sounds reasonable, or copying what a mate charges. That's how you end up either losing money or losing jobs. Here's how to work out a rate that actually makes sense for your business.</p>

      <h2>Why Getting Your Rate Wrong Is Expensive</h2>
      <p>Too low and you're working hard for a wage that doesn't cover your costs. Too high and you price yourself out of jobs before you've had a chance to show your quality. The goal is a rate that:</p>
      <ul>
        <li>Covers all your business costs</li>
        <li>Pays you a proper wage</li>
        <li>Leaves room for profit</li>
        <li>Is competitive in your local market</li>
      </ul>
      <p>You can't hit all four by guessing.</p>

      <h2>Step 1: Work Out Your Annual Costs</h2>
      <p>Before you can charge enough, you need to know what "enough" is. Add up everything your business costs you in a year:</p>
      <ul>
        <li><strong>Van:</strong> finance or depreciation, insurance, fuel, servicing</li>
        <li><strong>Tools and equipment:</strong> purchases, repairs, replacements</li>
        <li><strong>Insurance:</strong> public liability, employer's liability, tool cover</li>
        <li><strong>Certifications and memberships:</strong> Gas Safe, NICEIC, trade association fees</li>
        <li><strong>Marketing:</strong> website, advertising, listing fees</li>
        <li><strong>Accounting and admin software</strong></li>
        <li><strong>Phone and data plan</strong></li>
        <li><strong>PPE and workwear</strong></li>
      </ul>
      <p>Most sole trader tradespeople are surprised to find their overheads run to £15,000–£25,000 a year before they pay themselves a penny.</p>

      <h2>Step 2: Work Out Your Billable Hours</h2>
      <p>You don't bill for every hour you work. A realistic year looks like this:</p>
      <ul>
        <li>52 weeks minus 4 weeks holiday = 48 working weeks</li>
        <li>5 days × 8 hours = 40 hours/week potential</li>
        <li>Minus travel time, admin, quoting, buying materials: realistically 5–6 billable hours/day</li>
        <li>Minus sick days, callbacks, and quiet periods: knock off another 10–15%</li>
      </ul>
      <p>A realistic billable figure for a sole trader is around <strong>900–1,100 hours per year</strong>. Use 1,000 hours as a starting point.</p>

      <h2>Step 3: Calculate Your Break-Even Rate</h2>
      <p>Divide your total annual costs by your billable hours. If your overheads are £20,000:</p>
      <p><strong>£20,000 ÷ 1,000 hours = £20/hour just to break even</strong></p>
      <p>That's before you pay yourself. Add your target salary — say £40,000 — and divide again:</p>
      <p><strong>(£20,000 + £40,000) ÷ 1,000 hours = £60/hour minimum</strong></p>
      <p>Add a 20% profit margin on top: <strong>£72/hour</strong>. That's your floor — the minimum that keeps your business viable.</p>

      <h2>Step 4: Check Against Your Local Market</h2>
      <p>Your calculated rate needs to be in range for your area. UK rates by trade (2025):</p>
      <ul>
        <li><strong>Plumber:</strong> £45–£80/hour (Gas Safe registered: add £10–£20)</li>
        <li><strong>Electrician:</strong> £45–£75/hour (approved contractor: add premium)</li>
        <li><strong>HVAC technician:</strong> £50–£90/hour</li>
        <li><strong>Roofer:</strong> £150–£250/day</li>
        <li><strong>Gas engineer:</strong> £60–£100/hour</li>
      </ul>
      <p>London and South East rates run 20–40% higher than the national average. If your calculated rate is well below market, you have room to charge more. If it's above market, look hard at your costs — or your target area.</p>

      <h2>Fixed Price vs Hourly Rate</h2>
      <p>Many experienced tradespeople move away from hourly rates for standard jobs. Once you know how long a boiler swap or consumer unit replacement takes, you can quote a fixed price — and earn more per hour when you're efficient.</p>
      <p>Fixed pricing also removes the customer's anxiety about the meter running. "£450 to replace the immersion heater" is easier to say yes to than "£65/hour, probably 4–5 hours".</p>
      <p>Use hourly rates for investigation work and reactive calls. Use fixed prices for everything repeatable.</p>

      <h2>Don't Compete on Price</h2>
      <p>The customers who haggle hardest on price are usually the hardest to work for. Tradespeople who cut their rate to win jobs end up working longer hours for less money. The answer is to compete on speed, professionalism, and trust — not price.</p>
      <p>Sending a clean, branded PDF quote within an hour of a site visit does more to win a job than dropping £10/hour off your rate. Customers choosing between three quotes often go with whoever looks most professional and responds fastest — not whoever is cheapest.</p>

      <h2>Review Your Rate Every Year</h2>
      <p>Material costs, fuel, insurance, and certification fees all go up. If you haven't reviewed your rate in two years, you're almost certainly undercharging. Build in an annual review — January is a natural time — and put rates up by at least the rate of inflation.</p>

      <h2>The Fastest Way to Quote at Your New Rate</h2>
      <p>Once you've set your rate, make sure every quote reflects it accurately. TradeQuote stores your labour rate and uses it automatically when you describe a job — so you never accidentally undercharge because you forgot to update a spreadsheet template. Describe the job in plain English, get a professional PDF, send it from your phone before you leave the site.</p>
    `,
  },

  {
    slug: 'how-to-follow-up-on-a-quote',
    title: 'How to Follow Up on a Quote Without Being Pushy',
    metaDescription: 'Sent a quote and heard nothing back? Here\'s exactly when and how to follow up with a customer — without sounding desperate or annoying.',
    date: '2026-04-06',
    readTime: '4 min',
    content: `
      <p class="lead">You sent the quote. It's been two days. Nothing. Most tradespeople either chase immediately and come across desperate, or wait too long and lose the job to someone faster. Here's how to follow up in a way that wins work without damaging the relationship.</p>

      <h2>Why Quotes Go Silent</h2>
      <p>A customer going quiet after a quote doesn't always mean they've chosen someone else. The most common reasons:</p>
      <ul>
        <li>They're waiting to get a second or third quote</li>
        <li>They haven't had time to read it properly</li>
        <li>They need to talk to a partner or landlord before deciding</li>
        <li>The quote landed in their spam folder</li>
        <li>Life got in the way — they forgot</li>
      </ul>
      <p>A well-timed follow-up catches the jobs that would have slipped through the cracks for no real reason.</p>

      <h2>When to Follow Up</h2>
      <p>Timing matters more than what you say.</p>

      <h3>First follow-up: 24–48 hours</h3>
      <p>A quick check-in the day after sending the quote is completely normal and expected. At this point, you're just making sure they received it — not chasing a decision.</p>

      <h3>Second follow-up: 5–7 days</h3>
      <p>If you've heard nothing after a week, a second message is reasonable. Keep it brief. You're checking if they have any questions, not pressuring them.</p>

      <h3>After that: let it go</h3>
      <p>If there's still no response after two follow-ups, the job has almost certainly gone elsewhere. One final message — "just checking if you still need this done" — is the absolute maximum. Move on.</p>

      <h2>What to Say: Scripts That Work</h2>

      <h3>First follow-up (text or email)</h3>
      <p><em>"Hi [name], just checking you received the quote I sent yesterday for [job]. Happy to answer any questions — let me know if you'd like to go ahead."</em></p>
      <p>That's it. Short, confident, no pressure.</p>

      <h3>Second follow-up</h3>
      <p><em>"Hi [name], following up on the quote from last week. Are you still looking to get this done? Happy to chat if you have any questions about the work."</em></p>

      <h3>Final message</h3>
      <p><em>"Hi [name], just a final check-in on the quote. No worries if you've gone with someone else — just let me know either way so I can free up the slot."</em></p>
      <p>The last line is key. Giving them an easy out often prompts a reply — either a yes or a no, both of which are better than silence.</p>

      <h2>What Not to Do</h2>
      <ul>
        <li><strong>Don't follow up the same day</strong> — it looks desperate</li>
        <li><strong>Don't justify your price unprompted</strong> — if they haven't raised price as an issue, don't bring it up</li>
        <li><strong>Don't send multiple messages in the same week</strong> — once is enough per follow-up window</li>
        <li><strong>Don't sound annoyed</strong> — customers can feel it, and it ends the conversation</li>
        <li><strong>Don't drop your price to get a response</strong> — this trains customers to ignore your first quote</li>
      </ul>

      <h2>Follow Up With Context, Not Just a Nudge</h2>
      <p>The best follow-ups reference something specific. If you know the customer viewed your quote, you can follow up with confidence rather than wondering if they even saw it. If you know they haven't opened it, your first message is about resending — not chasing a decision they haven't made yet.</p>
      <p>TradeQuote tracks whether your customer has viewed the quote, so your follow-up is always relevant. No more guessing — you can see exactly when they opened it and follow up at the right moment.</p>

      <h2>The Fastest Wins Come From Speed, Not Chasing</h2>
      <p>The best way to reduce the need for follow-ups is to send quotes faster in the first place. Customers who receive a quote within an hour are far more likely to respond quickly. By the time you're following up two days later, they may already have accepted someone else's quote.</p>
      <p>TradeQuote lets you send a professional PDF quote from your phone in under 60 seconds — while you're still on site. The faster your quote lands, the less chasing you need to do.</p>
    `,
  },

  {
    slug: 'how-to-quote-a-roofing-job',
    title: 'How to Quote a Roofing Job: A Complete Guide for Roofers',
    metaDescription: 'Learn how to quote a roofing job accurately — covering materials, labour, scaffolding, waste disposal, and how to send a professional roofing quote fast.',
    date: '2026-04-07',
    readTime: '5 min',
    content: `
      <p class="lead">Roofing quotes are high-value and competitive. Get the numbers wrong and you either lose money on the job or lose the job to a cheaper quote. This guide covers how to build an accurate, professional roofing quote — and get it to the customer before your competitors do.</p>

      <h2>What Makes Roofing Quotes Different</h2>
      <p>Roofing jobs have more moving parts than most trades. A single quote needs to account for:</p>
      <ul>
        <li>Variable material quantities (tiles, felt, battens, ridge, hip, lead flashing)</li>
        <li>Scaffolding costs — which can vary wildly by access and height</li>
        <li>Skip hire and waste disposal</li>
        <li>Weather dependency and scheduling risk</li>
        <li>Structural unknowns (rotten timbers, inadequate decking)</li>
      </ul>
      <p>Miss any of these and your margin disappears. Include them clearly and you look professional — which matters when a customer is weighing up three quotes for a job worth thousands.</p>

      <h2>What Every Roofing Quote Should Include</h2>

      <h3>1. Materials — Itemised</h3>
      <p>List every material line separately: tiles or slates, underfelt, battens, ridge tiles, hip tiles, valley materials, lead or GRP flashing, fixings. Customers can't compare quotes when one says "materials: £1,200" and yours says nothing.</p>
      <p>Always spec the material grade. "Sandtoft concrete interlocking tiles" is more trustworthy than "tiles." It also protects you if a customer later disputes what they were quoted.</p>

      <h3>2. Labour</h3>
      <p>Break out labour from materials. State whether it's a fixed price or a day rate. For larger jobs, show labour per section — stripping, felt and batten, tiling, ridge, lead work — so the customer understands what they're paying for.</p>

      <h3>3. Scaffolding</h3>
      <p>Either include scaffolding as a line item or explicitly exclude it and state that a scaffolding contractor's quote applies separately. Never leave it ambiguous — scaffold disputes are one of the most common causes of roofing payment problems.</p>

      <h3>4. Waste Removal</h3>
      <p>Skip hire, bag removal, or tipping fees need to be on the quote. If it's included, say so. If it's not, say so. A customer who sees £300 on the final invoice for waste removal — when it wasn't on the quote — will argue.</p>

      <h3>5. Exclusions</h3>
      <p>Always state what's not included. Common roofing exclusions:</p>
      <ul>
        <li>Replacement of rotten timbers or sarking boards (price on discovery)</li>
        <li>Chimney repointing or rebuilding</li>
        <li>Guttering replacement</li>
        <li>VELUX or skylight installation</li>
        <li>Fascia and soffit work</li>
      </ul>
      <p>If you find rotten timbers once the old roof is off, you need a paper trail that shows this wasn't in scope — or you'll be expected to fix it for free.</p>

      <h3>6. Guarantee</h3>
      <p>State your workmanship guarantee clearly — typically 10 years for a new roof, 5 years for a repair. If you're a member of a trade association (NFRC, TrustMark), include it. This is a major trust signal for high-value roofing jobs.</p>

      <h3>7. Payment Terms</h3>
      <p>For roofing jobs, a deposit is standard — typically 25–40% upfront to cover materials. State this clearly on the quote, along with when the balance is due (on completion, or in staged payments for larger jobs).</p>

      <h2>How to Estimate Roofing Materials</h2>
      <p>For a standard pitched roof:</p>
      <ul>
        <li>Measure the roof area in m² (length × width × pitch factor — use 1.15 for a 30° pitch, 1.3 for 45°)</li>
        <li>Add 10% for cuts and waste</li>
        <li>Check the tile manufacturer's coverage rate — typically 10–16 tiles per m² depending on tile type</li>
        <li>Calculate ridge and hip lengths separately — these need their own tiles or capping</li>
        <li>Lead flashings: measure linear metres of abutments, valleys, and chimney details</li>
      </ul>
      <p>Under-ordering materials mid-job causes delays and can mean going back to the merchant twice — which costs time and money. Always over-order slightly.</p>

      <h2>Estimate vs Fixed Price for Roofing</h2>
      <p>Give a <strong>fixed price</strong> for straightforward re-roofing where you've fully assessed the job. Give an <strong>estimate with a contingency range</strong> for older roofs where you can't see the structure until stripping starts.</p>
      <p>Never give a single fixed price if there's a realistic chance of rotten timbers — this is how roofers lose money. "£4,200 fixed, plus £45/m² for any rotten sarking discovered on strip" is fair, transparent, and protects you.</p>

      <h2>How to Send the Quote Quickly</h2>
      <p>Speed matters in roofing. A customer getting three quotes often goes with the first professional one that lands. Waiting until you get back to the office to write it up on a spreadsheet costs you jobs.</p>
      <p>With TradeQuote, you can describe the job in plain English — "re-roof detached house, 85m², concrete interlocking tiles, scaffolding included, skip hire, 10-year guarantee" — and get a branded PDF quote sent to the customer's email in under 60 seconds. Works from your phone while you're still on the drive.</p>

      <h2>Final Checklist Before Sending a Roofing Quote</h2>
      <ul>
        <li>Materials itemised with specifications?</li>
        <li>Labour clearly stated — fixed or day rate?</li>
        <li>Scaffolding — included or excluded and stated?</li>
        <li>Waste disposal — included or excluded and stated?</li>
        <li>Exclusions listed (timbers, guttering, etc.)?</li>
        <li>Workmanship guarantee included?</li>
        <li>Deposit amount and payment terms clear?</li>
        <li>Quote validity period stated?</li>
        <li>Your business name, contact, and trade memberships on the document?</li>
      </ul>
      <p>A thorough, itemised roofing quote builds trust before the job starts — and protects you if anything is disputed after.</p>
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
