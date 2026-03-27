-- Rename paddle columns to stripe
ALTER TABLE users RENAME COLUMN paddle_customer_id     TO stripe_customer_id;
ALTER TABLE users RENAME COLUMN paddle_subscription_id TO stripe_subscription_id;

-- Drop existing plan CHECK (auto-named by Postgres) and add 'canceled'
DO $$
DECLARE
  cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'users'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%trial%';

  IF cname IS NOT NULL THEN
    EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || quote_ident(cname);
  END IF;
END $$;

ALTER TABLE users ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('trial', 'starter', 'pro', 'team', 'canceled'));
