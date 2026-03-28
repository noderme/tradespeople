import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import type { LineItem } from '@/types/database'

type QuoteStatus = 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected' | 'cancelled'; // Define all possible quote statuses

/**
 * SKILL AS A SERVICE (SkaaS) API
 * 
 * This endpoint allows external AI agents (Manus, ChatGPT, Claude) to interact with
 * the Trade Quotes app's "brain" without needing the Web UI.
 * 
 * Authentication: API Key in Authorization header
 * Format: Authorization: Bearer {SKILL_API_KEY}
 */

interface SkillRequest {
  action: 'chat' | 'get_price_history' | 'create_quote' | 'send_quote' | 'get_quotes'
  user_id: string
  data?: Record<string, unknown>
}

interface SkillResponse {
  success: boolean
  action: string
  result?: unknown
  error?: string
}

// Verify the API key from the request
function verifySkillApiKey(authHeader: string | null): boolean {
  if (!authHeader) return false
  
  const token = authHeader.replace('Bearer ', '')
  const validKey = process.env.SKILL_API_KEY
  
  if (!validKey) {
    console.error('SKILL_API_KEY not configured in environment')
    return false
  }
  
  return token === validKey
}

export async function POST(request: NextRequest): Promise<NextResponse<SkillResponse>> {
  try {
    // 1. Verify API Key
    const authHeader = request.headers.get('Authorization')
    if (!verifySkillApiKey(authHeader)) {
      return NextResponse.json(
        { success: false, action: 'auth', error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = (await request.json()) as SkillRequest
    const { action, user_id, data } = body

    if (!action || !user_id) {
      return NextResponse.json(
        { success: false, action: 'validate', error: 'Missing action or user_id' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // 3. Route to the appropriate handler
    switch (action) {
      case 'chat': {
        // Handle conversational AI interaction (quote building)
        const { message, threadId } = data as { message: string; threadId: string }
        if (!message || !threadId) {
          return NextResponse.json(
            { success: false, action: 'chat', error: 'Missing message or threadId' },
            { status: 400 }
          )
        }

        const result = await handleConversation(user_id, message, threadId)
        return NextResponse.json({ success: true, action: 'chat', result })
      }

      case 'get_price_history': {
        // Get the plumber's previous pricing for a job type
        const { job_type } = data as { job_type: string }
        if (!job_type) {
          return NextResponse.json(
            { success: false, action: 'get_price_history', error: 'Missing job_type' },
            { status: 400 }
          )
        }

        const { data: priceMemory, error } = await supabase
          .from('price_memory')
          .select('*')
          .eq('user_id', user_id)
          .eq('job_type', job_type.toLowerCase())
          .order('use_count', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        return NextResponse.json({
          success: true,
          action: 'get_price_history',
          result: priceMemory || { message: 'No previous pricing found for this job type' },
        })
      }

      case 'get_quotes': {
        // Get all quotes for the user (for dashboard-like queries)
        const { limit = 10, status } = data as { limit?: number; status?: string }

        let query = supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false })
          .limit(limit)

        const validQuoteStatuses: QuoteStatus[] = ['draft', 'pending', 'sent', 'accepted', 'rejected', 'cancelled'];

        if (status) {
          if (validQuoteStatuses.includes(status as QuoteStatus)) {
            query = query.eq('status', status as QuoteStatus);
          } else {
            console.warn(`Invalid quote status provided: ${status}`);
            return NextResponse.json(
              { success: false, action: 'get_quotes', error: `Invalid status provided: ${status}` },
              { status: 400 }
            );
          }
        }

        const { data: quotes, error } = await query

        if (error) throw error

        return NextResponse.json({
          success: true,
          action: 'get_quotes',
          result: quotes,
        })
      }

      case 'create_quote': {
        // Directly create a quote (for advanced AI use cases)
        const { customer_name, customer_address, line_items, notes, tax_rate } = data as {
          customer_name: string
          customer_address?: string
          line_items: LineItem[]
          notes?: string
          tax_rate?: number
        }

        if (!customer_name || !line_items || line_items.length === 0) {
          return NextResponse.json(
            { success: false, action: 'create_quote', error: 'Missing required fields' },
            { status: 400 }
          )
        }

        // Get user's default tax rate if not provided
        const { data: userProfile } = await supabase
          .from('users')
          .select('default_tax_rate')
          .eq('id', user_id)
          .single()

        const finalTaxRate = tax_rate ?? userProfile?.default_tax_rate ?? 0
        const subtotal = line_items.reduce((sum, item) => sum + item.total, 0)
        const total = subtotal * (1 + finalTaxRate)

        const { data: quote, error: quoteError } = await supabase
          .from('quotes')
          .insert({
            user_id,
            customer_name,
            customer_address: customer_address || null,
            status: 'draft',
            line_items,
            subtotal,
            tax_rate: finalTaxRate,
            total,
            notes: notes || null,
            pdf_url: null,
            sent_at: null,
            viewed_at: null,
            accepted_at: null,
            customer_id: null,
          })
          .select()
          .single()

        if (quoteError || !quote) throw quoteError

        return NextResponse.json({
          success: true,
          action: 'create_quote',
          result: { quote_id: quote.id, total, message: `Quote created for ${customer_name}` },
        })
      }

      case 'send_quote': {
        // Send a quote via email or other channels
        const { quote_id, email, phone } = data as { quote_id: string; email?: string; phone?: string }

        if (!quote_id || (!email && !phone)) {
          return NextResponse.json(
            { success: false, action: 'send_quote', error: 'Missing quote_id and email/phone' },
            { status: 400 }
          )
        }

        // Trigger the existing send endpoint
        const sendResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/quotes/${quote_id}/send`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone }),
          }
        )

        if (!sendResponse.ok) {
          throw new Error(`Failed to send quote: ${sendResponse.statusText}`)
        }

        return NextResponse.json({
          success: true,
          action: 'send_quote',
          result: { message: `Quote sent to ${email || phone}` },
        })
      }

      default:
        return NextResponse.json(
          { success: false, action: 'unknown', error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Skill API error:', error)
    return NextResponse.json(
      {
        success: false,
        action: 'error',
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
