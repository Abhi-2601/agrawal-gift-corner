import { create } from 'zustand';

/**
 * In-memory counter for the homepage's DEMO products.
 *
 * Deliberately NOT persisted and NOT connected to `useCartStore`: sample products
 * have no catalog ids, so they must never reach /cart or /checkout. The header
 * badge adds this count to the real cart count. Remove once the homepage reads
 * real products (then use `useCartStore.addItem` directly).
 */
interface DemoCartState {
  count: number;
  add: () => void;
}

export const useDemoCart = create<DemoCartState>((set) => ({
  count: 0,
  add: () => set((state) => ({ count: state.count + 1 })),
}));
