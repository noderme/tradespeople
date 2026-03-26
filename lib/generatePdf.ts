import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib'
import { createServiceClient } from '@/lib/supabase/service'
import type { Database, LineItem } from '@/types/database'

type Quote = Database['public']['Tables']['quotes']['Row']
type User  = Database['public']['Tables']['users']['Row']

// A4 dimensions in points
const PAGE_WIDTH  = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN      = 50
const CONTENT_W   = PAGE_WIDTH - MARGIN * 2

// Brand colours
const COL_BLACK  = rgb(0.10, 0.10, 0.10)
const COL_GRAY   = rgb(0.50, 0.50, 0.50)
const COL_LGRAY  = rgb(0.96, 0.96, 0.96)
const COL_BORDER = rgb(0.85, 0.85, 0.85)
const COL_ORANGE = rgb(0.976, 0.451, 0.086)
const COL_WHITE  = rgb(1, 1, 1)

function line(page: PDFPage, x1: number, y1: number, x2: number, y2: number) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.5, color: COL_BORDER })
}

function fmt(amount: number) {
  return `£${amount.toFixed(2)}`
}

function rAlign(page: PDFPage, text: string, rightX: number, y: number, size: number, font: PDFFont, color = COL_BLACK) {
  const w = font.widthOfTextAtSize(text, size)
  page.drawText(text, { x: rightX - w, y, size, font, color })
}

/** Builds the PDF and returns the raw buffer — no Supabase side effects. */
export async function buildPdfBuffer(quote: Quote, user: User): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page   = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold     = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = PAGE_HEIGHT - MARGIN

  // ── LOGO ────────────────────────────────────────────────────────────────────
  let logoEndX = MARGIN
  if (user.logo_url) {
    try {
      const res   = await fetch(user.logo_url)
      const bytes = await res.arrayBuffer()
      const ct    = res.headers.get('content-type') ?? ''

      const img = ct.includes('png')
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes)

      const maxH = 52
      const maxW = 120
      const scale = Math.min(maxH / img.height, maxW / img.width)
      const w = img.width  * scale
      const h = img.height * scale

      page.drawImage(img, { x: MARGIN, y: y - h, width: w, height: h })
      logoEndX = MARGIN + w + 12
    } catch {
      // logo fetch failed — continue without it
    }
  }

  // ── BUSINESS NAME ────────────────────────────────────────────────────────────
  page.drawText(user.business_name, {
    x: logoEndX, y: y - 18,
    size: 16, font: bold, color: COL_BLACK,
  })

  // ── QUOTE LABEL (top-right) ──────────────────────────────────────────────────
  page.drawText('QUOTE', {
    x: PAGE_WIDTH - MARGIN - bold.widthOfTextAtSize('QUOTE', 26),
    y: y - 18,
    size: 26, font: bold, color: COL_ORANGE,
  })

  const year     = new Date(quote.created_at).getFullYear()
  const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
  const dateStr  = new Date(quote.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  rAlign(page, quoteNum, PAGE_WIDTH - MARGIN, y - 38, 10, bold, COL_BLACK)
  rAlign(page, dateStr,  PAGE_WIDTH - MARGIN, y - 52,  9, regular, COL_GRAY)

  y -= 72
  line(page, MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y -= 20

  // ── BILL TO ──────────────────────────────────────────────────────────────────
  page.drawText('BILL TO', { x: MARGIN, y, size: 8, font: bold, color: COL_GRAY })
  y -= 16

  page.drawText(quote.customer_name, { x: MARGIN, y, size: 13, font: bold, color: COL_BLACK })
  y -= 14

  // customer_id lookup omitted here — address will come from WhatsApp session data
  y -= 16
  line(page, MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y -= 22

  // ── LINE ITEMS TABLE ─────────────────────────────────────────────────────────
  const colDesc  = MARGIN
  const colQty   = MARGIN + CONTENT_W * 0.56
  const colUnit  = MARGIN + CONTENT_W * 0.70
  const colTotal = MARGIN + CONTENT_W * 0.86
  const tableR   = PAGE_WIDTH - MARGIN

  // Header row
  page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: COL_ORANGE })
  const hY = y - 14
  for (const [text, x] of [
    ['DESCRIPTION', colDesc + 6],
    ['QTY',         colQty],
    ['UNIT PRICE',  colUnit],
    ['TOTAL',       colTotal],
  ] as [string, number][]) {
    page.drawText(text, { x, y: hY, size: 8, font: bold, color: COL_WHITE })
  }
  y -= 20

  // Item rows
  const lineItems = quote.line_items as LineItem[]
  for (let i = 0; i < lineItems.length; i++) {
    const item    = lineItems[i]
    const rowH    = 22
    const textY   = y - 15

    if (i % 2 === 1) {
      page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: COL_LGRAY })
    }

    const desc = item.description.length > 48 ? item.description.slice(0, 45) + '…' : item.description
    page.drawText(desc,              { x: colDesc + 6,     y: textY, size: 9, font: regular, color: COL_BLACK })
    page.drawText(String(item.quantity), { x: colQty,      y: textY, size: 9, font: regular, color: COL_BLACK })
    page.drawText(fmt(item.unit_price),  { x: colUnit,     y: textY, size: 9, font: regular, color: COL_BLACK })
    page.drawText(fmt(item.total),       { x: colTotal,    y: textY, size: 9, font: regular, color: COL_BLACK })

    y -= rowH
  }

  line(page, MARGIN, y, tableR, y)
  y -= 24

  // ── TOTALS ───────────────────────────────────────────────────────────────────
  const labelX = PAGE_WIDTH - MARGIN - 160
  const valueX = PAGE_WIDTH - MARGIN

  // Subtotal
  page.drawText('Subtotal', { x: labelX, y, size: 10, font: regular, color: COL_GRAY })
  rAlign(page, fmt(Number(quote.subtotal)), valueX, y, 10, regular)
  y -= 18

  // Tax (only if non-zero)
  const taxRate = Number(quote.tax_rate)
  if (taxRate > 0) {
    const taxAmt   = Number(quote.subtotal) * taxRate
    const taxLabel = `Tax (${(taxRate * 100 % 1 === 0 ? (taxRate * 100).toFixed(0) : (taxRate * 100).toFixed(1))}%)`
    page.drawText(taxLabel, { x: labelX, y, size: 10, font: regular, color: COL_GRAY })
    rAlign(page, fmt(taxAmt), valueX, y, 10, regular)
    y -= 18
  }

  line(page, labelX - 8, y, valueX, y)
  y -= 16

  // Total
  page.drawText('TOTAL', { x: labelX, y, size: 14, font: bold, color: COL_BLACK })
  rAlign(page, fmt(Number(quote.total)), valueX, y, 14, bold, COL_ORANGE)

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  const footerY = MARGIN + 36
  line(page, MARGIN, footerY + 16, PAGE_WIDTH - MARGIN, footerY + 16)

  page.drawText('Quote valid for 30 days', {
    x: MARGIN, y: footerY,
    size: 9, font: regular, color: COL_GRAY,
  })

  const contact = `${user.whatsapp_number}  |  ${user.email}`
  rAlign(page, contact, PAGE_WIDTH - MARGIN, footerY, 9, regular, COL_GRAY)

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

/** Generates the PDF, uploads to Supabase Storage, updates the quote row, returns the buffer. */
export async function generateQuotePdf(quote: Quote, user: User): Promise<Buffer> {
  const buffer   = await buildPdfBuffer(quote, user)
  const supabase = createServiceClient()
  const filename = `quote-${quote.id}.pdf`

  const { error: uploadError } = await supabase.storage
    .from('quotes')
    .upload(filename, buffer, { contentType: 'application/pdf', upsert: true })

  if (uploadError) throw new Error(`PDF upload failed: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage.from('quotes').getPublicUrl(filename)

  await supabase
    .from('quotes')
    .update({ pdf_url: publicUrl, status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', quote.id)

  return buffer
}
