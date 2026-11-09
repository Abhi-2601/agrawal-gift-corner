-- Migration: 20261010000000_init_schema.sql
-- Description: Initial schema for Agrawal Gift Corner e-commerce application

-- Extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN ALLOWLIST
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role safely without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(check_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE email = COALESCE(check_email, auth.jwt() ->> 'email')
  );
$$;

-- Policies for admin_allowlist
CREATE POLICY "Admins can read admin_allowlist"
    ON public.admin_allowlist FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Service role can manage admin_allowlist"
    ON public.admin_allowlist FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insert initial admins
INSERT INTO public.admin_allowlist (email, role)
VALUES
    ('abhishekagrawal2601@gmail.com', 'admin'),
    ('dimpyagrawal16@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
    ON public.addresses FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own addresses"
    ON public.addresses FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own addresses"
    ON public.addresses FOR DELETE
    USING (auth.uid() = profile_id);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    sale_price NUMERIC CHECK (sale_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
    ON public.products FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. PRODUCT MEDIA
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product media is viewable by everyone"
    ON public.product_media FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage product media"
    ON public.product_media FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    position TEXT NOT NULL CHECK (position IN ('home_top', 'home_middle')) DEFAULT 'home_top',
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active banners are viewable by everyone"
    ON public.banners FOR SELECT
    USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()) OR public.is_admin());

CREATE POLICY "Admins can manage banners"
    ON public.banners FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8. WEBSITE SETTINGS
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Website settings viewable by everyone"
    ON public.website_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage settings"
    ON public.website_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Insert default settings
INSERT INTO public.website_settings (key, value, description) VALUES
('business_details', '{"name": "Agrawal Gift Corner", "location": "Mathura, Uttar Pradesh, India", "currency": "INR", "whatsapp": "+91 7579951781", "email": "agrawalgiftcorner@gmail.com"}', 'Core business details'),
('shipping_settings', '{"free_shipping_threshold": 1000, "standard_fee": 50}', 'Shipping configuration'),
('shipping_fee', '50'::jsonb, 'Standard shipping fee in INR'),
('shipping_threshold', '1000'::jsonb, 'Threshold for free shipping in INR'),
('whatsapp', '"+91 75799 51781"'::jsonb, 'Store customer service WhatsApp contact')
ON CONFLICT (key) DO NOTHING;

-- 9. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Customer snapshot at time of order for guest/safekeeping
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    -- Delivery snapshot
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,

    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_status TEXT NOT NULL CHECK (payment_status IN ('unpaid', 'paid', 'refunded')) DEFAULT 'unpaid',

    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = profile_id OR public.is_admin());

CREATE POLICY "Admins can manage orders"
    ON public.orders FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Note: inserting orders will be handled via a secure database function below.

-- 10. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,

    -- Snapshot to preserve historical record
    product_name TEXT NOT NULL,
    product_sku TEXT,
    price_at_time NUMERIC NOT NULL,
    quantity INTEGER NOT NULL,
    customization_notes TEXT, -- Max 500 chars limit handled at application layer

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items through order"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = public.order_items.order_id
            AND (profile_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Admins can manage order items"
    ON public.order_items FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 11. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, profile_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (is_approved = true OR auth.uid() = profile_id OR public.is_admin());

CREATE POLICY "Users can insert own review"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own review"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own review"
    ON public.reviews FOR DELETE
    USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage reviews"
    ON public.reviews FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 12. WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
    ON public.wishlists FOR ALL
    USING (auth.uid() = profile_id);

-- ATOMIC CHECKOUT FUNCTION
-- Secure function creating the order and items with row locking, stock decrement,
-- customization note preservation, and server-side calculation verification.
CREATE OR REPLACE FUNCTION process_checkout(
    p_profile_id UUID,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_shipping_address TEXT,
    p_shipping_city TEXT,
    p_shipping_state TEXT,
    p_shipping_pincode TEXT,
    p_subtotal NUMERIC,
    p_shipping_fee NUMERIC,
    p_discount NUMERIC,
    p_total_amount NUMERIC,
    p_items JSONB -- Array of items: [{product_id, quantity, customization_notes}]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_order_id UUID;
    item RECORD;
    v_product_id UUID;
    v_qty INTEGER;
    v_notes TEXT;
    v_product_record RECORD;
    v_actual_item_price NUMERIC;
    v_computed_subtotal NUMERIC := 0;
    v_computed_shipping NUMERIC := 0;
    v_computed_total NUMERIC := 0;
    v_free_shipping_threshold NUMERIC := 1000;
    v_standard_shipping_fee NUMERIC := 50;
    v_setting_row RECORD;
BEGIN
    -- 1. Security check: Caller must be authenticated and order for their own profile
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required to place an order';
    END IF;

    IF auth.uid() <> p_profile_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: profile ID does not match authenticated user';
    END IF;

    -- Validate required contact and address details
    IF p_customer_name IS NULL OR length(trim(p_customer_name)) = 0 THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;
    IF p_customer_phone IS NULL OR length(trim(p_customer_phone)) = 0 THEN
        RAISE EXCEPTION 'Customer phone number is required';
    END IF;
    IF p_shipping_address IS NULL OR length(trim(p_shipping_address)) = 0 THEN
        RAISE EXCEPTION 'Shipping address is required';
    END IF;
    IF p_shipping_city IS NULL OR length(trim(p_shipping_city)) = 0 THEN
        RAISE EXCEPTION 'Shipping city is required';
    END IF;
    IF p_shipping_state IS NULL OR length(trim(p_shipping_state)) = 0 THEN
        RAISE EXCEPTION 'Shipping state is required';
    END IF;
    IF p_shipping_pincode IS NULL OR length(trim(p_shipping_pincode)) = 0 THEN
        RAISE EXCEPTION 'Shipping pincode is required';
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cart is empty. Order must contain at least one item';
    END IF;

    -- 2. Fetch shipping rules from website_settings if configured
    SELECT * INTO v_setting_row FROM public.website_settings WHERE key = 'shipping_fee';
    IF FOUND AND v_setting_row.value IS NOT NULL THEN
        v_standard_shipping_fee := (v_setting_row.value #>> '{}')::NUMERIC;
    END IF;

    SELECT * INTO v_setting_row FROM public.website_settings WHERE key = 'shipping_threshold';
    IF FOUND AND v_setting_row.value IS NOT NULL THEN
        v_free_shipping_threshold := (v_setting_row.value #>> '{}')::NUMERIC;
    END IF;

    -- 3. Loop through JSON items: verify stock, row-lock products, and compute subtotal server-side
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (item.value->>'product_id')::UUID;
        v_qty := (item.value->>'quantity')::INTEGER;

        IF v_qty IS NULL OR v_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid quantity % for product %', v_qty, v_product_id;
        END IF;

        -- Row lock to prevent concurrent overselling
        SELECT * INTO v_product_record
        FROM public.products
        WHERE id = v_product_id AND is_active = true
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % is not available or inactive', v_product_id;
        END IF;

        IF v_product_record.stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for % (Requested: %, Available: %)',
                v_product_record.name, v_qty, v_product_record.stock;
        END IF;

        IF v_product_record.sale_price IS NOT NULL AND v_product_record.sale_price > 0 THEN
            v_actual_item_price := v_product_record.sale_price;
        ELSE
            v_actual_item_price := v_product_record.price;
        END IF;

        v_computed_subtotal := v_computed_subtotal + (v_actual_item_price * v_qty);
    END LOOP;

    -- Compute shipping and total server-side
    IF v_computed_subtotal >= v_free_shipping_threshold THEN
        v_computed_shipping := 0;
    ELSE
        v_computed_shipping := v_standard_shipping_fee;
    END IF;

    v_computed_total := v_computed_subtotal + v_computed_shipping;

    -- 4. Create order snapshot with prepaid-only default states
    INSERT INTO public.orders (
        profile_id, customer_name, customer_phone, customer_email,
        shipping_address, shipping_city, shipping_state, shipping_pincode,
        status, payment_status,
        subtotal, shipping_fee, discount, total_amount
    )
    VALUES (
        p_profile_id, trim(p_customer_name), trim(p_customer_phone), trim(p_customer_email),
        trim(p_shipping_address), trim(p_shipping_city), trim(p_shipping_state), trim(p_shipping_pincode),
        'pending', 'unpaid',
        v_computed_subtotal, v_computed_shipping, 0, v_computed_total
    ) RETURNING id INTO new_order_id;

    -- 5. Decrement stock and insert order items with customization notes
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (item.value->>'product_id')::UUID;
        v_qty := (item.value->>'quantity')::INTEGER;
        v_notes := NULLIF(trim(item.value->>'customization_notes'), '');

        -- Re-fetch locked row
        SELECT * INTO v_product_record
        FROM public.products
        WHERE id = v_product_id;

        IF v_product_record.sale_price IS NOT NULL AND v_product_record.sale_price > 0 THEN
            v_actual_item_price := v_product_record.sale_price;
        ELSE
            v_actual_item_price := v_product_record.price;
        END IF;

        -- Safely decrement stock
        UPDATE public.products
        SET stock = stock - v_qty
        WHERE id = v_product_id;

        -- Insert order item with historical price and customization notes preserved
        INSERT INTO public.order_items (
            order_id, product_id, product_name, product_sku,
            price_at_time, quantity, customization_notes
        ) VALUES (
            new_order_id, v_product_id, v_product_record.name, v_product_record.sku,
            v_actual_item_price, v_qty, v_notes
        );
    END LOOP;

    RETURN new_order_id;
END;
$$;

------------------------------------------------------------
-- ADDITIONAL TABLES / POLICIES
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY newsletter_public_insert ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY newsletter_admin_read ON public.newsletter_subscriptions FOR SELECT USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed')),
    discount_value NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    min_order_value NUMERIC(12,2) DEFAULT 0.00,
    max_discount_amount NUMERIC(12,2),
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY coupons_public_select ON public.coupons FOR SELECT USING (is_active = TRUE);
CREATE POLICY coupons_admin_all ON public.coupons FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
