import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductFormPanel from '../../components/admin/ProductFormPanel';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatusBadge } from '../../components/admin/AdminUI';
import { getProductImage } from '../../lib/catalog';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { getAdminCategories, getAdminProducts } from '../../services/productService';
import type { CatalogProduct, Category } from '../../lib/types';

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productRows, categoryRows] = await Promise.all([getAdminProducts(), getAdminCategories()]);
      setProducts(productRows);
      setCategories(categoryRows);
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    if (searchParams.get('new') === '1') {
      setEditingProduct(null);
      setFormOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      if (term && !product.name.toLowerCase().includes(term) && !(product.sku || '').toLowerCase().includes(term)) return false;
      if (categoryFilter !== 'all' && product.category_id !== categoryFilter) return false;
      if (statusFilter === 'active' && !product.is_active) return false;
      if (statusFilter === 'hidden' && product.is_active) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const toggleActive = async (product: CatalogProduct) => {
    const { error: updateError } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, is_active: !item.is_active } : item));
    toast.success(product.is_active ? 'Product hidden' : 'Product published');
  };

  const removeProduct = async (product: CatalogProduct) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }
    setProducts((current) => current.filter((item) => item.id !== product.id));
    toast.success('Product deleted');
  };

  const openNew = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: CatalogProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Add, edit, publish, and manage your gift catalog."
        actions={<button type="button" onClick={openNew} className="btn-primary text-xs"><Plus size={15} /> Add product</button>}
      />

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading products…" />
      ) : (
        <>
          <div className="admin-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or SKU…" className="admin-input pl-9" />
            </div>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="admin-input sm:w-44">
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-input sm:w-36">
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
            <button type="button" onClick={() => void load()} className="btn-secondary px-3 py-2 text-xs"><RefreshCw size={14} /> Refresh</button>
          </div>

          {products.length === 0 ? (
            <AdminEmpty
              icon={Package}
              title="No products yet"
              description="Add your first gift to start building the storefront catalog."
              action={<button type="button" onClick={openNew} className="btn-primary text-xs"><Plus size={15} /> Add product</button>}
            />
          ) : filtered.length === 0 ? (
            <AdminEmpty title="No products match those filters" description="Try a different search term or reset the filters." />
          ) : (
            <div className="admin-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-[#FBF8F5] text-[0.68rem] uppercase tracking-[0.08em] text-secondary-text">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => (
                      <tr key={product.id} className="border-t border-subtle-border/70 align-middle">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                              <img src={getProductImage(product)} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <Link to={`/product/${product.id}`} target="_blank" rel="noreferrer" className="line-clamp-1 font-semibold text-ink hover:text-burgundy">{product.name}</Link>
                              <p className="mt-0.5 text-[0.68rem] text-secondary-text">{product.sku || 'No SKU'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-secondary-text">{product.categories?.name || '—'}</td>
                        <td className="px-4 py-3 font-semibold text-ink">{formatCurrency(Number(product.sale_price || product.price))}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className={Number(product.stock) <= 3 ? 'font-semibold text-amber-700' : 'text-ink/70'}>{product.stock}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => void toggleActive(product)} title="Toggle visibility">
                            <StatusBadge status={product.is_active ? 'active' : 'hidden'} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button type="button" onClick={() => openEdit(product)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-burgundy/30 hover:text-burgundy" aria-label={`Edit ${product.name}`}>
                              <Pencil size={14} />
                            </button>
                            <button type="button" onClick={() => void removeProduct(product)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-red-200 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${product.name}`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-subtle-border px-4 py-3 text-[0.68rem] text-secondary-text">
                Showing {filtered.length} of {products.length} products
              </div>
            </div>
          )}
        </>
      )}

      <ProductFormPanel
        open={formOpen}
        product={editingProduct}
        categories={categories}
        onClose={() => { setFormOpen(false); setEditingProduct(null); }}
        onSaved={() => void load()}
      />
    </div>
  );
}
