import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fwfohgjkbjsaoacrnmes.supabase.co';
// NOTE: never fall back to a fake key — an invalid key produces confusing
// auth errors. Missing config is reported explicitly via isSupabaseConfigured.
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-anon-key';

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_anon_key_here';

export const supabase = createClient(supabaseUrl, supabaseKey);

