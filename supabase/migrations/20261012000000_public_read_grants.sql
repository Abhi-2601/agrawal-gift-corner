-- Migration: 20261012000000_public_read_grants.sql
-- Description: Grant storefront read access to anon/authenticated roles.
--
-- Root cause of "Catalog unavailable": newer Supabase projects do NOT
-- auto-expose new tables through PostgREST. The tables and RLS policies
-- exist, but the anon role was never granted privileges, so every public
-- query fails with 42501 "permission denied for table ...".
--
-- HOW TO APPLY (manual only, do not auto-run):
--   1. Open the Supabase Dashboard -> SQL Editor for project fwfohgjkbjsaoacrnmes
--   2. Paste this entire file and click Run.
-- RLS policies still apply on top of these grants (e.g. only active
-- products/categories, approved reviews, and date-windowed banners).

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_media TO anon, authenticated;
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT SELECT ON public.website_settings TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;

-- Footer newsletter signup is insert-only for the public.
GRANT INSERT ON public.newsletter_subscriptions TO anon, authenticated;
