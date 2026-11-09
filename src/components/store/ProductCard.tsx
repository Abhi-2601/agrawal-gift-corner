import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '../../hooks/useCartStore';
import {
  getDiscountPercent,
  getEffectivePrice,
  getProductImage,
  productCategoryName,
  toCartProduct,
} from '../../lib/catalog';
import { formatCurrency } from '../../lib/utils';
import type { CatalogProduct } from '../../lib/types';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: CatalogProduct;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const price = getEffectivePrice(product);
  const discount = getDiscountPercent(product);
  const image = getProductImage(product);
  const inStock = Number(product.stock) > 0;

  const handleAdd = () => {
    if (!inStock) return;
    addItem(toCartProduct(product), 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-subtle-border bg-white shadow-[0_1px_2px_rgba(43,26,23,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy/20 hover:shadow-[0_12px_30px_rgba(57,38,51,0.09)]">
      <div className="relative overflow-hidden bg-sand">
        <Link to={`/product/${product.id}`} className="block aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-burgundy px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm">
              {discount}% off
            </span>
          )}
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold text-burgundy shadow-sm backdrop-blur">
              <Sparkles size={11} /> Bestseller
            </span>
          )}
        </div>

        <WishlistButton productId={product.id} className="absolute right-3 top-3 h-9 w-9" />
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'gap-2 p-3.5' : 'gap-2.5 p-4'}`}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-secondary-text/80">
          {productCategoryName(product)}
        </p>
        <h3 className={`font-sans font-semibold leading-snug text-ink ${compact ? 'text-sm' : 'text-[0.95rem]'}`}>
          <Link to={`/product/${product.id}`} className="transition-colors hover:text-burgundy">
            {product.name}
          </Link>
        </h3>

        {!compact && product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-secondary-text">{product.description}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-playfair text-xl font-bold text-burgundy">{formatCurrency(price)}</span>
              {discount > 0 && (
                <span className="text-xs text-secondary-text line-through">{formatCurrency(Number(product.price))}</span>
              )}
            </div>
            <p className={`mt-1 text-[0.68rem] font-medium ${inStock ? 'text-emerald-700' : 'text-red-700'}`}>
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-secondary-text/30 ${
              added ? 'bg-emerald-700' : 'bg-burgundy hover:bg-burgundy-dark'
            }`}
          >
            {added ? <Check size={17} aria-hidden /> : <ShoppingBag size={17} aria-hidden />}
          </button>
        </div>
      </div>
    </article>
  );
}
