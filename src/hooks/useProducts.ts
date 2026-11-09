import { useEffect, useState } from 'react';
import { getProducts, getCategories, getActiveBanners, getWebsiteSetting } from '../services/productService';

export function useProducts(filters?: { category?: string; search?: string; featured?: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts(filters).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [filters?.category, filters?.search, filters?.featured]);

  return { data, loading, error };
}

export function useCategories() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { getCategories().then(setData).catch(() => setData([])); }, []);
  return { data };
}

export function useBanners() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { getActiveBanners().then(setData).catch(() => setData([])); }, []);
  return { data };
}

export function useSetting(key: string) {
  const [value, setValue] = useState<any>(null);
  useEffect(() => { getWebsiteSetting(key).then(setValue).catch(() => setValue(null)); }, [key]);
  return { value };
}
