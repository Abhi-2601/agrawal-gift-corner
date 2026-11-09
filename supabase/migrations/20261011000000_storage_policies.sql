-- Storage bucket creation (idempotent, requires service role / superuser)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('product-images', 'product-images', true),
  ('banners', 'banners', true),
  ('avatars', 'avatars', false),
  ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Secure Storage policies: public read only for intentionally public assets
-- Admin/all control restricted via public.is_admin()

-- 1. Product Images (Public bucket)
CREATE POLICY "Public can read product images" ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can manage product images" ON storage.objects FOR ALL
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- 2. Banners (Public bucket)
CREATE POLICY "Public can read banners" ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Admins can manage banners" ON storage.objects FOR ALL
  USING (bucket_id = 'banners' AND public.is_admin())
  WITH CHECK (bucket_id = 'banners' AND public.is_admin());

-- 3. Logos (Public bucket)
CREATE POLICY "Public can read logos" ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Admins can manage logos" ON storage.objects FOR ALL
  USING (bucket_id = 'logos' AND public.is_admin())
  WITH CHECK (bucket_id = 'logos' AND public.is_admin());

-- 4. Avatars (Private bucket: user can read/upload their own avatar, admins can manage all)
CREATE POLICY "Users can read own avatar" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars' AND (
      auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND (
      auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND (
      auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

CREATE POLICY "Admins can manage all avatars" ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND public.is_admin())
  WITH CHECK (bucket_id = 'avatars' AND public.is_admin());
