import heroImage from '../assets/home/hero.webp';
import type { CatalogProduct, Product, ProductMedia } from './types';

export const FALLBACK_PRODUCT_IMAGE = heroImage;

export function getPrimaryMedia(product: Partial<CatalogProduct> | null | undefined): ProductMedia | undefined {
  const media = product?.product_media;
  if (!media || media.length === 0) return undefined;
  return media.find((item) => item.is_primary) ?? media[0];
}

export function getProductImage(product: Partial<CatalogProduct> | null | undefined): string {
  return getPrimaryMedia(product)?.media_url || FALLBACK_PRODUCT_IMAGE;
}

export function getEffectivePrice(product: Pick<CatalogProduct, 'price' | 'sale_price'>): number {
  const price = Number(product.price) || 0;
  const salePrice = product.sale_price == null ? null : Number(product.sale_price);
  return salePrice != null && salePrice > 0 && salePrice < price ? salePrice : price;
}

export function getDiscountPercent(product: Pick<CatalogProduct, 'price' | 'sale_price'>): number {
  const price = Number(product.price) || 0;
  const salePrice = product.sale_price == null ? null : Number(product.sale_price);
  if (!salePrice || salePrice <= 0 || salePrice >= price || price <= 0) return 0;
  return Math.round((1 - salePrice / price) * 100);
}

export function toCartProduct(product: CatalogProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.id,
    description: product.description ?? '',
    price: Number(product.price) || 0,
    sale_price: product.sale_price == null ? undefined : Number(product.sale_price),
    image: getProductImage(product),
    categoryId: product.category_id ?? '',
    tags: [],
    stock: Number(product.stock) || 0,
    rating: 5,
    reviewCount: 0,
    isFeatured: Boolean(product.is_featured),
    isNew: false,
    createdAt: product.created_at ?? new Date().toISOString(),
    sku: product.sku ?? '',
  };
}

export function productCategoryName(product: CatalogProduct): string {
  return product.categories?.name || 'Handcrafted gift';
}
