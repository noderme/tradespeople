-- Add customer_address to quotes for PDF Bill To section
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_address TEXT;
