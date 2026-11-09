import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, ShoppingCart, Star } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { SampleProduct } from '../../lib/homeData';

function Rating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span aria-hidden className="flex items-center gap-px">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-block h-[13px] w-[13px]">
              <Star size={13} strokeWidth={1.5} className="absolute inset-0 text-star/60" />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={13} strokeWidth={1.5} className="fill-star text-star" />
              </span>
            </span>
          );
        })}
      </span>
      <span aria-hidden className="text-[0.75rem] text-[#6b5d58]">
        ({count})
      </span>
      <span className="sr-only">
        Rated {value} out of 5 from {count} reviews
      </span>
    </div>
  );
}

interface ProductCardProps {
  product: SampleProduct;
  wished: boolean;
  onToggleWish: (id: string) => void;
  onAdd: (product: SampleProduct) => void;
}

export default function ProductCard({ product, wished, onToggleWish, onAdd }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_3px_14px_rgba(90,40,30,0.09)]">
      <div className="relative">
        <Link to={product.to} className="block aspect-[6/5] overflow-hidden bg-blush" tabIndex={-1} aria-hidden>
          <img src={product.image} alt="" width={330} height={276} loading="lazy" className="h-full w-full object-cover" />
        </Link>
        <button
          type="button"
          onClick={() => onToggleWish(product.id)}
          aria-pressed={wished}
          aria-label={`Save ${product.name} to wishlist`}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-[#2b1f1c] shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy sm:h-8 sm:w-8"
        >
          <Heart size={17} aria-hidden className={wished ? 'fill-burgundy text-burgundy' : ''} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="font-sans text-[0.8125rem] font-semibold leading-snug tracking-normal text-[#2b1f1c] lg:text-[0.75rem] xl:text-[0.875rem]">
          <Link to={product.to} className="hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy">
            {product.name}
          </Link>
        </h3>

        <Rating value={product.rating} count={product.reviews} />

        <p className="flex items-baseline gap-2">
          <span className="text-[1.0625rem] font-extrabold text-burgundy sm:text-[1.125rem]">{formatCurrency(product.price)}</span>
          <s className="text-[0.75rem] text-[#8a7d78]">
            <span className="sr-only">Original price </span>
            {formatCurrency(product.mrp)}
          </s>
        </p>

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-[0.8125rem] font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 ${
            added ? 'bg-[#2f6b3f]' : 'bg-burgundy hover:bg-burgundy-dark active:bg-burgundy-deep'
          }`}
        >
          {added ? <Check size={16} aria-hidden /> : <ShoppingCart size={16} aria-hidden />}
          {added ? 'Added' : 'Add to Cart'}
        </button>
        <span role="status" className="sr-only">
          {added ? `${product.name} added to cart` : ''}
        </span>
      </div>
    </article>
  );
}
