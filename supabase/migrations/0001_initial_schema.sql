-- ============================================================
-- TradeQuote — Initial Schema
-- ============================================================

-- ── users ────────────────────────────────────────────────────
CREATE TABLE users (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  email                  TEXT UNIQUE NOT NULL,
  full_name              TEXT NOT NULL,
  business_name          TEXT NOT NULL,
  whatsapp_number        TEXT UNIQUE NOT NULL,
  logo_url               TEXT,
  plan                   TEXT NOT NULL DEFAULT 'trial'
                           CHECK (plan IN ('trial','starter','pro','team')),
  trial_ends_at          TIMESTAMPTZ,
  paddle_customer_id     TEXT,
  paddle_subscription_id TEXT
);

-- ── customers ────────────────────────────────────────────────
CREATE TABLE customers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  phone      TEXT,
  email      TEXT,
  address    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── quotes ───────────────────────────────────────────────────
CREATE TABLE quotes (
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
CREATE TABLE quote_sessions (
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
CREATE TABLE price_memory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_type    TEXT NOT NULL,
  last_labor  NUMERIC(12,2),
  last_total  NUMERIC(12,2),
  use_count   INTEGER NOT NULL DEFAULT 1,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── indexes ──────────────────────────────────────────────────
CREATE INDEX ON customers(user_id);
CREATE INDEX ON quotes(user_id);
CREATE INDEX ON quotes(status);
CREATE INDEX ON quote_sessions(user_id);
CREATE INDEX ON quote_sessions(whatsapp_thread_id);
CREATE INDEX ON price_memory(user_id, job_type);

-- ── updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_quote_sessions_updated_at
  BEFORE UPDATE ON quote_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_price_memory_updated_at
  BEFORE UPDATE ON price_memory
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_memory   ENABLE ROW LEVEL SECURITY;

-- users: can only see/edit own row
CREATE POLICY users_self ON users
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- customers: scoped to owner
CREATE POLICY customers_owner ON customers
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- quotes: scoped to owner
CREATE POLICY quotes_owner ON quotes
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- quote_sessions: scoped to owner
CREATE POLICY quote_sessions_owner ON quote_sessions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- price_memory: scoped to owner
CREATE POLICY price_memory_owner ON price_memory
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
