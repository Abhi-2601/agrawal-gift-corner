import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/store/ProductCard';
import { getCategories, getProducts } from '../services/productService';
import { isSupabaseConfigured } from '../lib/supabase';
import type { CatalogProduct, Category } from '../lib/types';

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'newest';

interface FilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
}

function FilterPanel({
  search,
  onSearchChange,
  onSearchSubmit,
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="shop-search" className="label-base">Search gifts</label>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
          className="relative"
        >
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
          <input
            id="shop-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Hamper, roses, photo lamp…"
            className="input-base pl-9 pr-10"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md bg-burgundy text-white" aria-label="Search">
            <Search size={13} />
          </button>
        </form>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-secondary-text">Category</h3>
          {selectedCategory !== 'All' && (
            <button type="button" onClick={() => onCategoryChange('All')} className="text-[0.68rem] font-semibold text-burgundy hover:underline">Reset</button>
          )}
        </div>
        <div className="space-y-1">
          {['All', ...categories.map((category) => category.name)].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[0.8rem] font-medium transition-colors ${
                selectedCategory === category ? 'bg-burgundy text-white' : 'text-ink/70 hover:bg-blush/50 hover:text-burgundy'
              }`}
            >
              {category}
              {selectedCategory === category && <span className="text-[0.65rem]">•</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-secondary-text">Price range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder="Min"
            className="input-base px-2.5 py-2 text-xs"
            aria-label="Minimum price"
          />
          <span className="text-secondary-text">–</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="Max"
            className="input-base px-2.5 py-2 text-xs"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <button type="button" onClick={onClear} className="btn-secondary w-full py-2 text-xs">
        <X size={14} /> Clear filters
      </button>
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'All';
  const queryParam = searchParams.get('search') || '';

  const [search, setSearch] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [sort, setSort] = useState<SortOption>('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catalog, categoryRows] = await Promise.all([getProducts(), getCategories()]);
      setProducts(catalog);
      setCategories(categoryRows);
    } catch (loadError: any) {
      setProducts([]);
      setCategories([]);
      setError(loadError?.message || 'The catalog is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setSelectedCategory(catParam);
  }, [catParam]);

  const syncParams = (nextSearch: string, nextCategory: string) => {
    const next = new URLSearchParams(searchParams);
    if (nextSearch.trim()) next.set('search', nextSearch.trim());
    else next.delete('search');
    if (nextCategory !== 'All') next.set('cat', nextCategory);
    else next.delete('cat');
    setSearchParams(next, { replace: true });
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    syncParams(search, category);
    setMobileFilters(false);
  };

  const submitSearch = () => {
    syncParams(search, selectedCategory);
    setMobileFilters(false);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({}, { replace: true });
  };

  const filtered = useMemo(() => {
    let result = [...products];
    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(term) ||
        (product.description || '').toLowerCase().includes(term) ||
        (product.categories?.name || '').toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter((product) =>
        product.categories?.name === selectedCategory || product.category_id === selectedCategory
      );
    }
    const min = minPrice.trim() === '' ? null : Number(minPrice);
    const max = maxPrice.trim() === '' ? null : Number(maxPrice);
    if (min != null && Number.isFinite(min)) {
      result = result.filter((product) => Number(product.sale_price || product.price) >= min);
    }
    if (max != null && Number.isFinite(max)) {
      result = result.filter((product) => Number(product.sale_price || product.price) <= max);
    }
    if (sort === 'price_asc') result.sort((a, b) => Number(a.sale_price || a.price) - Number(b.sale_price || b.price));
    if (sort === 'price_desc') result.sort((a, b) => Number(b.sale_price || b.price) - Number(a.sale_price || a.price));
    if (sort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sort === 'featured') result.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return result;
  }, [products, search, selectedCategory, minPrice, maxPrice, sort]);

  const activeFilters = [
    selectedCategory !== 'All' ? selectedCategory : null,
    search.trim() ? `“${search.trim()}”` : null,
    minPrice.trim() || maxPrice.trim() ? `₹${minPrice || '0'} – ₹${maxPrice || '∞'}` : null,
  ].filter(Boolean) as string[];

  const filterProps: FilterPanelProps = {
    search,
    onSearchChange: setSearch,
    onSearchSubmit: submitSearch,
    categories,
    selectedCategory,
    onCategoryChange: chooseCategory,
    minPrice,
    maxPrice,
    onMinPriceChange: setMinPrice,
    onMaxPriceChange: setMaxPrice,
    onClear: clearFilters,
  };

  return (
    <div className="bg-ivory">
      <section className="border-b border-subtle-border bg-[#F8EDE7]">
        <div className="container-page py-9 sm:py-12">
          <nav className="flex items-center gap-2 text-[0.7rem] font-medium text-secondary-text" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burgundy">Home</Link>
            <span>/</span>
            <span className="text-ink">Shop</span>
          </nav>
          <p className="eyebrow mt-5">The gift edit</p>
          <h1 className="mt-1 max-w-2xl">Thoughtful gifts, beautifully curated</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
            Explore handcrafted hampers, flowers, and personalized keepsakes for birthdays, weddings, anniversaries, and every moment worth celebrating.
          </p>
        </div>
      </section>

      <div className="container-page py-7 sm:py-9">
        {!isSupabaseConfigured && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`.
          </div>
        )}

        <div className="grid gap-7 lg:grid-cols-[230px_1fr] lg:gap-9">
          <aside className="hidden lg:block">
            <div className="sticky top-[8.5rem] rounded-2xl border border-subtle-border bg-white p-4 shadow-[0_1px_2px_rgba(43,26,23,0.03)]">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setMobileFilters((value) => !value)} className="btn-secondary px-3 py-2 text-xs lg:hidden">
                  <Filter size={14} /> Filters
                </button>
                <p className="text-xs text-secondary-text">
                  <span className="font-bold text-ink">{filtered.length}</span> {filtered.length === 1 ? 'gift' : 'gifts'}
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-secondary-text">
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Sort by</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortOption)}
                    className="appearance-none rounded-lg border border-subtle-border bg-white py-2 pl-3 pr-8 text-xs font-semibold text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/10"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-text" />
                </div>
              </label>
            </div>

            {mobileFilters && (
              <div className="mb-5 rounded-2xl border border-subtle-border bg-white p-4 lg:hidden">
                <FilterPanel {...filterProps} />
              </div>
            )}

            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <span key={filter} className="rounded-full border border-burgundy/15 bg-[#FBEAEC] px-2.5 py-1 text-[0.68rem] font-semibold text-burgundy">
                    {filter}
                  </span>
                ))}
                <button type="button" onClick={clearFilters} className="text-[0.68rem] font-semibold text-secondary-text hover:text-burgundy">Clear all</button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
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
                <p className="font-playfair text-xl font-bold text-ink">Catalog unavailable</p>
                <p className="mx-auto mt-1 max-w-lg break-words text-xs leading-relaxed text-secondary-text">{error}</p>
                <button type="button" onClick={() => void load()} className="btn-secondary mt-4"><RefreshCw size={15} /> Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-subtle-border bg-white px-6 py-14 text-center">
                <p className="font-playfair text-xl font-bold text-ink">No gifts match those filters</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-secondary-text">Try a different search term or clear the filters to see the full collection.</p>
                <button type="button" onClick={clearFilters} className="btn-primary mt-5">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
