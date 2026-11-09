# Applying Migrations — Manual Steps

The migration file is at:
`supabase/migrations/20261010000000_init_schema.sql`

DO NOT execute automatically.

Steps:
1. Open https://fwfohgjkbjsaoacrnmes.supabase.co/project/default/editor
2. Paste entire SQL content from the file above
3. Click Run — this creates 14 tables, 35 RLS policies, indexes, admin allowlist, and the `process_checkout()` atomic function
4. After execution, create Storage buckets (Dashboard → Storage): `product-images`, `banners`, `logos`, `avatars`
5. Set bucket policies (public read for product-images/banners/logos/avatars; admin write)

Verified in file: UUID PKs, FK constraints, CHECK constraints, RLS on all tables, admin allowlist with both emails (`abhishekagrawal2601@gmail.com`, `dimpyagrawal16@gmail.com`), atomic stock check via `FOR UPDATE` in `process_checkout`.
