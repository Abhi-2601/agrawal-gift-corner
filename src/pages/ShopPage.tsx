import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingBag, AlertCircle, Filter } from "lucide-react";
import { useCartStore } from '../hooks/useCartStore';
import { getProducts, getCategories } from '../services/productService';
import { isSupabaseConfigured } from '../lib/supabase';

// Demo preview data is strictly opt-in via VITE_DEMO_MODE=true and is
// clearly labeled as a preview — it is never shown silently.
const DEMO_FALLBACK_ENABLED = import.meta.env.VITE_DEMO_MODE === 'true';

export default function ShopPage() {
  const addItem = useCartStore((s) => s.addItem);
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const queryParam = searchParams.get('search');

  const [search, setSearch] = useState(queryParam || '');
  const [sort, setSort] = useState<'price_asc'|'price_desc'|'newest'>('newest');
  const [categoryFilter, setCategoryFilter] = useState(catParam || 'All');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDemoPreview, setIsDemoPreview] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      if (DEMO_FALLBACK_ENABLED) {
        const { DEMO_PRODUCTS, DEMO_CATEGORIES } = await import('../lib/demoData');
        setProducts(DEMO_PRODUCTS);
        setCategories(['All', ...DEMO_CATEGORIES.map((c: any) => c.name)]);
        setIsDemoPreview(true);
      } else {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prods || []);
        const catNames = Array.from(new Set((cats || []).map((c: any) => c.name).filter(Boolean)));
        setCategories(['All', ...catNames]);
        setIsDemoPreview(false);
      }
    } catch (err: any) {
      // Honest error state: never substitute fake products for a failed catalog.
      setProducts([]);
      setCategories(['All']);
      setIsDemoPreview(false);
      setLoadError(err?.message || 'Catalog is currently unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (catParam) setCategoryFilter(catParam);
    if (queryParam) setSearch(queryParam);
  }, [catParam, queryParam]);

  const filtered = useMemo(() => {
    let res = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') {
      res = res.filter(p => {
        const catName = p.categories?.name || p.category || (p.tags && p.tags.includes(categoryFilter.toLowerCase().replace(/\s+/g, '-')));
        return catName === categoryFilter || p.category_id === categoryFilter;
      });
    }
    if (sort === 'price_asc') {
      res.sort((a,b) => (a.sale_price || a.price || 0) - (b.sale_price || b.price || 0));
    }
    if (sort === 'price_desc') {
      res.sort((a,b) => (b.sale_price || b.price || 0) - (a.sale_price || a.price || 0));
    }
    if (sort === 'newest') {
      res.sort((a,b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }
    return res;
  }, [products, search, sort, categoryFilter]);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-subtle-border bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-rose block mb-2">
              Artisanal Handcrafted Gifting
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum font-bold tracking-tight mb-3">
              Our Curated Collection
            </h1>
            <p className="text-secondary-text text-base sm:text-lg leading-relaxed font-normal">
              Explore thoughtful gift boxes, celebration hampers, and customizable keepsakes designed with care for birthdays, weddings, anniversaries, and milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {isDemoPreview && (
          <div className="mb-8 p-4 rounded-2xl bg-soft-blush border border-muted-rose/30 text-xs sm:text-sm text-plum">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="text-muted-rose shrink-0" />
              <span>Preview mode: showing sample products for design review. Live catalog loads when demo mode is off.</span>
            </div>
          </div>
        )}

        {loadError && (
          <div className="mb-8 p-5 rounded-2xl bg-warm-white border border-subtle-border shadow-sm" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-muted-rose shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h2 className="font-playfair text-lg text-plum font-bold mb-1">Catalog Unavailable</h2>
                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed break-words">
                  {loadError}
                </p>
                {!isSupabaseConfigured && (
                  <p className="text-xs text-secondary-text mt-2">
                    The app is missing its Supabase connection details (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env.local).
                  </p>
                )}
                <button
                  onClick={fetchCatalog}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-plum text-ivory text-xs font-semibold hover:bg-[#2b1d27] transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            {/* Search Box */}
            <div className="bg-warm-white rounded-2xl p-5 border border-subtle-border shadow-sm">
              <label htmlFor="shop-search" className="text-sm font-bold text-plum block mb-2.5">
                Search Gifts
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text/60" size={17} />
                <input
                  id="shop-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="E.g., Hamper, Box..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-subtle-border bg-ivory text-sm text-plum placeholder:text-secondary-text/60 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-warm-white rounded-2xl p-5 border border-subtle-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-plum">Categories</h3>
                {categoryFilter !== 'All' && (
                  <button
                    onClick={() => setCategoryFilter('All')}
                    className="text-xs text-muted-rose hover:underline font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition text-left flex items-center justify-between ${
                      c === categoryFilter
                        ? 'bg-plum text-ivory font-semibold shadow-sm'
                        : 'bg-ivory/60 hover:bg-soft-blush text-plum border border-subtle-border/60'
                    }`}
                  >
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 min-w-0">
            {/* Sort & Results Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-warm-white p-4 rounded-2xl border border-subtle-border shadow-sm">
              <span className="text-sm font-medium text-secondary-text">
                Showing <strong className="text-plum">{filtered.length}</strong> {filtered.length === 1 ? 'gift' : 'gifts'}
              </span>

              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={16} className="text-secondary-text" />
                <label htmlFor="sort-select" className="text-xs text-secondary-text font-medium hidden sm:inline">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="bg-ivory border border-subtle-border rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-plum focus:outline-none focus:ring-2 focus:ring-champagne-gold cursor-pointer"
                >
                  <option value="newest">Featured / Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-warm-white rounded-3xl p-4 border border-subtle-border animate-pulse space-y-4">
                    <div className="aspect-[4/3] bg-soft-blush/60 rounded-2xl" />
                    <div className="h-4 bg-soft-blush/80 rounded w-2/3" />
                    <div className="h-4 bg-soft-blush/60 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="text-center py-20 bg-warm-white rounded-3xl border border-subtle-border p-8">
                <div className="w-14 h-14 rounded-2xl bg-soft-blush flex items-center justify-center text-plum mx-auto mb-4">
                  <Filter size={24} />
                </div>
                <h2 className="font-playfair text-2xl text-plum font-bold mb-2">Catalog Unavailable</h2>
                <p className="text-secondary-text text-sm mb-6 max-w-sm mx-auto break-words">
                  {loadError}
                </p>
                <button onClick={fetchCatalog} className="btn-primary">
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-warm-white rounded-3xl border border-subtle-border p-8">
                <div className="w-14 h-14 rounded-2xl bg-soft-blush flex items-center justify-center text-plum mx-auto mb-4">
                  <Filter size={24} />
                </div>
                <h2 className="font-playfair text-2xl text-plum font-bold mb-2">No Matching Gifts Found</h2>
                <p className="text-secondary-text text-sm mb-6 max-w-sm mx-auto">
                  We couldn't find any items matching your current filters. Try searching with a different keyword or resetting filters.
                </p>
                <button
                  onClick={() => { setSearch(''); setCategoryFilter('All'); }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => {
                  const effectivePrice = p.sale_price && p.sale_price < p.price ? p.sale_price : p.price;
                  const hasDiscount = p.sale_price && p.sale_price < p.price;
                  const discountPct = hasDiscount ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
                  const imgUrl = p.image_url || p.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80';

                  return (
                    <article
                      key={p.id}
                      className="bg-warm-white rounded-3xl overflow-hidden border border-subtle-border shadow-sm hover:shadow-md hover:border-muted-rose/40 transition-all duration-300 flex flex-col group"
                    >
                      {/* Product Image Link */}
                      <Link to={`/product/${p.id}`} className="block relative overflow-hidden aspect-[4/3] bg-soft-blush/30">
                        <img
                          src={imgUrl}
                          alt={p.name}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-plum text-ivory text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {discountPct}% OFF
                          </span>
                        )}
                        {(p.stock === 0 || p.is_active === false) && (
                          <span className="absolute top-3 right-3 bg-secondary-text/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-secondary-text mb-1.5">
                            <span className="uppercase tracking-wider">{p.categories?.name || p.category || 'Handcrafted'}</span>
                            <div className="flex items-center gap-1 text-champagne-gold">
                              <Star size={13} fill="currentColor" />
                              <span className="text-secondary-text font-medium">{p.rating || '5.0'}</span>
                            </div>
                          </div>

                          <h2 className="font-playfair text-lg text-plum font-bold line-clamp-2 leading-snug mb-2 group-hover:text-muted-rose transition-colors">
                            <Link to={`/product/${p.id}`}>{p.name}</Link>
                          </h2>

                          <p className="text-secondary-text text-xs line-clamp-2 leading-relaxed mb-4">
                            {p.description}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-3 border-t border-subtle-border/60">
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="font-playfair font-bold text-xl text-plum">
                              ₹{effectivePrice}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-secondary-text line-through font-medium">
                                ₹{p.price}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if ((p.stock ?? 1) > 0 && p.is_active !== false) {
                                addItem(p, 1);
                              } else {
                                alert('This product is currently unavailable.');
                              }
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 bg-soft-blush text-plum font-semibold py-2.5 px-4 rounded-xl hover:bg-plum hover:text-ivory transition-colors text-xs active:scale-[0.99]"
                          >
                            <ShoppingBag size={15} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
