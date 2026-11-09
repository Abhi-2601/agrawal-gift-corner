-- Migration cleanup: remove broken create_order (column names mismatch with order_items)
-- Keep single unambiguous checkout: process_checkout (verified correct)
DROP FUNCTION IF EXISTS public.create_order(UUID, JSONB, NUMERIC, TEXT);
