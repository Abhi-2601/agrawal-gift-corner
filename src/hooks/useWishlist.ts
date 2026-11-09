import { useEffect } from 'react';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface WishlistState {
  ids: string[];
  loading: boolean;
  loadedFor: string | null;
  load: (userId: string) => Promise<void>;
  toggle: (userId: string, productId: string) => Promise<boolean>;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  loading: false,
  loadedFor: null,

  load: async (userId) => {
    if (!userId) {
      set({ ids: [], loadedFor: null, loading: false });
      return;
    }
    if (get().loadedFor === userId) return;

    set({ loading: true });
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('profile_id', userId);

    if (error) {
      set({ loading: false, loadedFor: userId, ids: [] });
      return;
    }

    set({
      loading: false,
      loadedFor: userId,
      ids: (data || []).map((row) => row.product_id).filter(Boolean),
    });
  },

  toggle: async (userId, productId) => {
    if (!userId) {
      toast.error('Sign in to save gifts to your wishlist.');
      return false;
    }

    const existing = get().ids.includes(productId);

    if (existing) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('profile_id', userId)
        .eq('product_id', productId);
      if (error) {
        toast.error(error.message || 'Could not remove this item.');
        return false;
      }
      set({ ids: get().ids.filter((id) => id !== productId) });
      toast.success('Removed from wishlist');
      return false;
    }

    const { error } = await supabase
      .from('wishlists')
      .insert({ profile_id: userId, product_id: productId });
    if (error) {
      toast.error(error.message || 'Could not save this item.');
      return false;
    }
    set({ ids: [...get().ids, productId] });
    toast.success('Saved to wishlist');
    return true;
  },

  clear: () => set({ ids: [], loadedFor: null, loading: false }),
}));

export function useWishlist(userId: string | null | undefined) {
  const ids = useWishlistStore((state) => state.ids);
  const loading = useWishlistStore((state) => state.loading);
  const load = useWishlistStore((state) => state.load);
  const toggle = useWishlistStore((state) => state.toggle);
  const clear = useWishlistStore((state) => state.clear);

  useEffect(() => {
    if (userId) {
      void load(userId);
    } else {
      clear();
    }
  }, [userId, load, clear]);

  return {
    ids,
    loading,
    isWished: (productId: string) => ids.includes(productId),
    toggle: (productId: string) => toggle(userId ?? '', productId),
  };
}
