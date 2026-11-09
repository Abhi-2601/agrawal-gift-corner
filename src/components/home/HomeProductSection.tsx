import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import type { CatalogProduct } from '../../lib/types';
import ProductCard from '../store/ProductCard';

interface HomeProductSectionProps {
  products: CatalogProduct[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function HomeProductSection({ products, loading, error, onRetry }: HomeProductSectionProps) {
  return (
    <section className="container-page py-10 sm:py-12" aria-labelledby="bestsellers-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow inline-flex items-center gap-1.5"><Sparkles size={13} /> Customer favourites</p>
          <h2 id="bestsellers-title" className="mt-1">Best-selling gifts</h2>
        </div>
        <Link to="/products" className="hidden items-center gap-1.5 text-sm font-semibold text-burgundy hover:underline sm:inline-flex">
          View all <ArrowRight size={15} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-subtle-border bg-white">
              <div className="aspect-[4/3] bg-sand" />
              <div className="space-y-2 p-4">
                <div className="h-2.5 w-1/2 rounded bg-sand" />
                <div className="h-4 w-4/5 rounded bg-sand" />
                <div className="h-5 w-1/3 rounded bg-sand" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-subtle-border bg-white p-8 text-center">
          <p className="text-sm font-semibold text-ink">The collection could not be loaded.</p>
          <p className="mx-auto mt-1 max-w-lg break-words text-xs leading-relaxed text-secondary-text">{error}</p>
          <button type="button" onClick={onRetry} className="btn-secondary mt-4">
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-subtle-border bg-white px-6 py-12 text-center">
          <p className="font-playfair text-xl font-bold text-ink">Our next collection is being curated</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-secondary-text">New handcrafted gifts are on their way. Explore the full collection or check back soon.</p>
          <Link to="/products" className="btn-primary mt-5">Explore all gifts</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-center sm:hidden">
        <Link to="/products" className="btn-secondary">View all gifts <ArrowRight size={15} /></Link>
      </div>
    </section>
  );
}
