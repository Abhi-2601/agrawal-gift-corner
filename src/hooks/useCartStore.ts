import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '../lib/types';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customization?: string; // Max 500 chars
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, customization?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, customization) => {
        if (customization && customization.length > 500) {
          toast.error("Customization cannot exceed 500 characters");
          return;
        }

        set((state) => {
          // Check if item already exists (same product AND same customization)
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.customization === customization
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            toast.success(`Updated quantity for ${product.name}`);
            return { items: newItems };
          }

          // Add new item
          toast.success(`Added ${product.name} to cart`);
          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                product,
                quantity,
                customization,
              },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        toast.success("Item removed from cart");
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      updateCustomization: (id, customization) => {
        if (customization.length > 500) {
          toast.error("Customization cannot exceed 500 characters");
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, customization } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.product.sale_price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'agrawal-gift-corner-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
