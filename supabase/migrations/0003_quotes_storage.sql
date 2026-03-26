-- Public bucket for generated quote PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotes', 'quotes', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload their own quotes
DO $$ BEGIN
  CREATE POLICY quotes_upload ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'quotes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow replace/update
DO $$ BEGIN
  CREATE POLICY quotes_update ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'quotes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public read (customers can open their PDF link)
DO $$ BEGIN
  CREATE POLICY quotes_read ON storage.objects
    FOR SELECT USING (bucket_id = 'quotes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
