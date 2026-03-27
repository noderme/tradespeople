-- WhatsApp number is no longer collected during signup.
-- Make it nullable so new users can be created without it.
-- The column stays for when WhatsApp quoting is ready.
ALTER TABLE users ALTER COLUMN whatsapp_number DROP NOT NULL;
