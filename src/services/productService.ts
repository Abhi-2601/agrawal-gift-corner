import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Banner, CatalogProduct, Category } from '../lib/types';

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
    );
  }
}

function toCatalogError(error: any, resource: string): Error {
  const code = error?.code ? String(error.code) : '';
  const message = error?.message ? String(error.message) : 'Unknown error';
  if (code === '42501' || /permission denied/i.test(message)) {
    return new Error(
      `${resource} unavailable: the database is denying public read access ` +
      `(permission denied for the anon role). Apply ` +
      `supabase/migrations/20261012000000_public_read_grants.sql in the Supabase SQL editor.`
    );
  }
  return new Error(`${resource} unavailable: ${message}`);
}

const catalogSelect = '*, categories(name), product_media(*)';

export async function getProducts(filters?: { category?: string; search?: string; featured?: boolean }) {
  assertConfigured();
  let query = supabase
    .from('products')
    .select(catalogSelect)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (filters?.category) query = query.eq('category_id', filters.category);
  if (filters?.featured) query = query.eq('is_featured', true);
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw toCatalogError(error, 'Product catalog');
  return (data || []) as unknown as CatalogProduct[];
}

export async function getAdminProducts() {
  assertConfigured();
  const { data, error } = await supabase
    .from('products')
    .select(catalogSelect)
    .order('created_at', { ascending: false });
  if (error) throw toCatalogError(error, 'Product catalog');
  return (data || []) as unknown as CatalogProduct[];
}

export async function getProductById(id: string) {
  assertConfigured();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name), product_media(*), reviews(*, profiles(full_name))')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  if (error) {
    if ((error as any).code === 'PGRST116') return null;
    throw toCatalogError(error, 'Product details');
  }
  return data as unknown as CatalogProduct;
}

export async function getCategories() {
  assertConfigured();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw toCatalogError(error, 'Categories');
  return (data || []) as Category[];
}

export async function getAdminCategories() {
  assertConfigured();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw toCatalogError(error, 'Categories');
  return (data || []) as Category[];
}

export async function getActiveBanners() {
  assertConfigured();
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw toCatalogError(error, 'Banners');
  const now = Date.now();
  return ((data || []) as Banner[]).filter((banner) => {
    if (banner.start_date && new Date(banner.start_date).getTime() > now) return false;
    if (banner.end_date && new Date(banner.end_date).getTime() < now) return false;
    return true;
  });
}

export async function getAdminBanners() {
  assertConfigured();
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw toCatalogError(error, 'Banners');
  return (data || []) as Banner[];
}

export async function getApprovedReviews(productId?: string) {
  assertConfigured();
  let query = supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('is_approved', true);
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  if (error) throw toCatalogError(error, 'Reviews');
  return (data || []) as any[];
}

export async function getWebsiteSetting(key: string) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('website_settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error) return null;
  return data?.value;
}
