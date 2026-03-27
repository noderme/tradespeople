-- Replace Stripe billing columns with Paddle equivalents
ALTER TABLE users RENAME COLUMN stripe_customer_id TO paddle_customer_id;
ALTER TABLE users RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;
