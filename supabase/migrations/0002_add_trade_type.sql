-- Add trade_type and default_tax_rate to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS trade_type TEXT
    CHECK (trade_type IN ('plumber', 'electrician', 'hvac', 'roofer', 'other')),
  ADD COLUMN IF NOT EXISTS default_tax_rate NUMERIC(5,4) NOT NULL DEFAULT 0;

-- Create public logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
DO $$ BEGIN
  CREATE POLICY logos_upload ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow update/replace of own logo
DO $$ BEGIN
  CREATE POLICY logos_update ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow public read
DO $$ BEGIN
  CREATE POLICY logos_read ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
