import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, RefreshCw } from 'lucide-react';
import ProductCard from '../components/store/ProductCard';
import { useAuthStore } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { getProducts } from '../services/productService';
import type { CatalogProduct } from '../lib/types';

export default function WishlistPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { ids, loading: wishlistLoading } = useWishlist(user?.id);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const all = await getProducts();
      setProducts(all.filter((product) => ids.includes(product.id)));
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wishlistLoading) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, wishlistLoading, ids.join(',')]);

  if (isLoading) {
    return <div className="container-page py-20 text-center text-sm text-secondary-text">Loading your wishlist…</div>;
  }

  if (!user) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-burgundy">
            <Heart size={24} />
          </span>
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Save the gifts you love</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary-text">Sign in to create a wishlist and keep your favourite gifts in one place.</p>
          <Link to="/login" className="btn-primary mt-5 w-full">Sign in with Google</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <div className="container-page py-7 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Saved for later</p>
            <h1 className="mt-1">Your wishlist</h1>
            <p className="mt-1 text-sm text-secondary-text">{ids.length} saved {ids.length === 1 ? 'gift' : 'gifts'}</p>
          </div>
          <Link to="/products" className="btn-secondary text-xs">Continue shopping</Link>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-subtle-border bg-white">
                  <div className="aspect-[4/3] bg-sand" />
                  <div className="space-y-2 p-4"><div className="h-3 w-1/2 rounded bg-sand" /><div className="h-4 w-4/5 rounded bg-sand" /></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-subtle-border bg-white p-8 text-center">
              <p className="text-sm text-secondary-text">{error}</p>
              <button type="button" onClick={() => void load()} className="btn-secondary mt-4"><RefreshCw size={15} /> Retry</button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-subtle-border bg-white px-6 py-14 text-center">
              <Heart size={30} className="mx-auto text-burgundy/50" />
              <h2 className="mt-3 font-playfair text-xl font-bold text-ink">Your wishlist is empty</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-secondary-text">Tap the heart on any gift to save it here for later.</p>
              <Link to="/products" className="btn-primary mt-5">Discover gifts</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
