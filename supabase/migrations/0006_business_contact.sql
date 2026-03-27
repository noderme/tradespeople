-- Add business contact fields to users table
-- These appear in the PDF footer instead of personal WhatsApp/email

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS business_phone TEXT,
  ADD COLUMN IF NOT EXISTS business_email TEXT;
