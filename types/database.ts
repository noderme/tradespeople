export type Plan = 'trial' | 'starter' | 'pro' | 'team'
export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined'
export type SessionState = 'collecting' | 'reviewing' | 'customer_info' | 'sending' | 'complete'
export type TradeType = 'plumber' | 'electrician' | 'hvac' | 'roofer' | 'other'

export interface LineItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          business_name: string
          whatsapp_number: string
          logo_url: string | null
          plan: Plan
          trial_ends_at: string | null
          paddle_customer_id: string | null
          paddle_subscription_id: string | null
          trade_type: TradeType | null
          default_tax_rate: number
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          customer_id: string | null
          customer_name: string
          status: QuoteStatus
          line_items: LineItem[]
          subtotal: number
          tax_rate: number
          total: number
          notes: string | null
          pdf_url: string | null
          created_at: string
          sent_at: string | null
          viewed_at: string | null
          accepted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
      }
      quote_sessions: {
        Row: {
          id: string
          user_id: string
          whatsapp_thread_id: string
          state: SessionState
          quote_draft: Record<string, unknown>
          messages: unknown[]
          quote_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quote_sessions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['quote_sessions']['Insert']>
      }
      price_memory: {
        Row: {
          id: string
          user_id: string
          job_type: string
          last_labor: number | null
          last_total: number | null
          use_count: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['price_memory']['Row'], 'id' | 'updated_at'> & {
          id?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['price_memory']['Insert']>
      }
    }
  }
}
