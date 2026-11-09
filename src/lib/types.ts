export interface ProductMedia {
  id?: string;
  product_id?: string;
  media_url: string;
  media_type?: 'image' | 'video';
  is_primary?: boolean;
  sort_order?: number;
}

/** Shape returned by the Supabase catalog queries. */
export interface CatalogProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  sku: string | null;
  stock: number;
  category_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  categories?: { name: string } | null;
  product_media?: ProductMedia[];
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string | null;
    is_approved?: boolean;
    created_at: string;
    profile_id?: string;
    profiles?: { full_name: string | null } | null;
  }>;
}

/** Normalized shape used by the persisted cart. */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku?: string;
  sale_price?: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  image_url?: string | null;
  description?: string | null;
  parentId?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  sku?: string;
  sale_price?: number;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Profile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address?: Address;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  position?: string;
  is_active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
}
