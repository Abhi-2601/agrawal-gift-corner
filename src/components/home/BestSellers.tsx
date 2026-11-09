import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useDemoCart } from '../../hooks/useDemoCart';
import type { SampleProduct } from '../../lib/homeData';
import ProductCard from './ProductCard';

interface BestSellersProps {
  /** DEMO data until the catalog is connected. */
  products: SampleProduct[];
}

export default function BestSellers({ products }: BestSellersProps) {
  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(new Set());
  const addDemoItem = useDemoCart((s) => s.add);

  const toggleWish = (id: string) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section aria-labelledby="best-selling-title" className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fbe9dc] sm:h-11 sm:w-11">
            <Star size={22} className="fill-star text-star" />
          </span>
          <div>
            <h2 id="best-selling-title" className="font-playfair text-[1.5rem] font-bold leading-tight tracking-[-0.01em] text-[#2b1a14] sm:text-[1.75rem]">
              Best Selling Gifts
            </h2>
            <p className="text-[0.8125rem] text-[#5f524d]">Customer favourites, handpicked for you</p>
          </div>
        </div>
        <Link
          to="/products"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md py-2 text-[0.8125rem] font-semibold text-burgundy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
        >
          View All <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {products.map((product, i) => (
          // An odd last card on phones is centered at single-card width instead of stretching.
          <li
            key={product.id}
            className={i === products.length - 1 && products.length % 2 === 1 ? 'col-span-2 mx-auto w-[calc(50%-0.375rem)] sm:col-span-1 sm:mx-0 sm:w-auto' : ''}
          >
            <ProductCard product={product} wished={wishlist.has(product.id)} onToggleWish={toggleWish} onAdd={addDemoItem} />
          </li>
        ))}
      </ul>
    </section>
  );
}
