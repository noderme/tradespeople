-- ============================================================
-- TradeQuote — Full Schema (run this if starting fresh)
-- Last updated: 2026-03-27
-- ============================================================

-- ── users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  email                  TEXT UNIQUE NOT NULL,
  full_name              TEXT NOT NULL,
  business_name          TEXT NOT NULL,
  whatsapp_number        TEXT UNIQUE,
  logo_url               TEXT,
  plan                   TEXT NOT NULL DEFAULT 'trial'
                           CHECK (plan IN ('trial','starter','pro','team','canceled')),
  trial_ends_at          TIMESTAMPTZ,
  paddle_customer_id     TEXT,
  paddle_subscription_id TEXT,
  trade_type             TEXT CHECK (trade_type IN ('plumber','electrician','hvac','roofer','other')),
  default_tax_rate       NUMERIC(5,4) NOT NULL DEFAULT 0,
  currency               TEXT NOT NULL DEFAULT 'USD',
  business_phone         TEXT,
  business_email         TEXT
);

-- ── customers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  phone      TEXT,
  email      TEXT,
  address    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── quotes ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','sent','viewed','accepted','declined')),
  line_items    JSONB NOT NULL DEFAULT '[]',
  subtotal      NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate      NUMERIC(5,4) NOT NULL DEFAULT 0,
  total         NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes         TEXT,
  pdf_url       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at       TIMESTAMPTZ,
  viewed_at     TIMESTAMPTZ,
  accepted_at   TIMESTAMPTZ
);

-- ── quote_sessions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_sessions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  whatsapp_thread_id TEXT NOT NULL,
  state              TEXT NOT NULL DEFAULT 'collecting'
                       CHECK (state IN ('collecting','reviewing','customer_info','sending','complete')),
  quote_draft        JSONB NOT NULL DEFAULT '{}',
  messages           JSONB NOT NULL DEFAULT '[]',
  quote_id           UUID REFERENCES quotes(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── price_memory ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS price_memory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_type    TEXT NOT NULL,
  last_labor  NUMERIC(12,2),
  last_total  NUMERIC(12,2),
  use_count   INTEGER NOT NULL DEFAULT 1,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_customers_user_id          ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id             ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status              ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_sessions_user_id     ON quote_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_sessions_thread_id   ON quote_sessions(whatsapp_thread_id);
CREATE INDEX IF NOT EXISTS idx_price_memory_user_job      ON price_memory(user_id, job_type);

-- ── updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_sessions_updated_at ON quote_sessions;
CREATE TRIGGER trg_quote_sessions_updated_at
  BEFORE UPDATE ON quote_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_memory_updated_at ON price_memory;
CREATE TRIGGER trg_price_memory_updated_at
  BEFORE UPDATE ON price_memory
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_memory   ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY users_self ON users
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY customers_owner ON customers
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY quotes_owner ON quotes
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY quote_sessions_owner ON quote_sessions
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY price_memory_owner ON price_memory
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Storage buckets ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('quotes', 'quotes', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY logos_upload ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY logos_update ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY logos_read ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY quotes_upload ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'quotes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY quotes_update ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'quotes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY quotes_read ON storage.objects
    FOR SELECT USING (bucket_id = 'quotes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
