import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { getPrimaryMedia } from '../../lib/catalog';
import type { CatalogProduct, Category } from '../../lib/types';
import ImageUpload from './ImageUpload';

interface ProductFormPanelProps {
  open: boolean;
  product: CatalogProduct | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM = {
  name: '',
  sku: '',
  price: '',
  sale_price: '',
  stock: '0',
  category_id: '',
  description: '',
  is_active: true,
  is_featured: false,
};

export default function ProductFormPanel({ open, product, categories, onClose, onSaved }: ProductFormPanelProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        price: String(product.price ?? ''),
        sale_price: product.sale_price == null ? '' : String(product.sale_price),
        stock: String(product.stock ?? 0),
        category_id: product.category_id || '',
        description: product.description || '',
        is_active: product.is_active !== false,
        is_featured: Boolean(product.is_featured),
      });
      setImageUrl(getPrimaryMedia(product)?.media_url || '');
    } else {
      setForm(EMPTY_FORM);
      setImageUrl('');
    }
  }, [open, product]);

  if (!open) return null;

  const update = (key: keyof typeof EMPTY_FORM, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const price = Number(form.price);
    const salePrice = form.sale_price.trim() === '' ? null : Number(form.sale_price);
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid price.');
      return;
    }
    if (salePrice != null && (!Number.isFinite(salePrice) || salePrice < 0 || salePrice >= price)) {
      setError('Sale price must be a positive number lower than the regular price.');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setError('Stock must be zero or greater.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim() || null,
        price,
        sale_price: salePrice,
        stock,
        category_id: form.category_id || null,
        description: form.description.trim() || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
      };

      let productId = product?.id;
      if (productId) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', productId);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').single();
        if (insertError) throw insertError;
        productId = data.id;
      }

      if (productId) {
        const existing = getPrimaryMedia(product);
        if (imageUrl) {
          if (existing?.id) {
            const { error: mediaError } = await supabase
              .from('product_media')
              .update({ media_url: imageUrl, media_type: 'image', is_primary: true })
              .eq('id', existing.id);
            if (mediaError) throw mediaError;
          } else {
            const { error: mediaError } = await supabase.from('product_media').insert({
              product_id: productId,
              media_url: imageUrl,
              media_type: 'image',
              is_primary: true,
              sort_order: 0,
            });
            if (mediaError) throw mediaError;
          }
        } else if (existing?.id) {
          const { error: mediaError } = await supabase
            .from('product_media')
            .delete()
            .eq('id', existing.id);
          if (mediaError) throw mediaError;
        }
      }

      toast.success(product ? 'Product updated' : 'Product created');
      onSaved();
      onClose();
    } catch (saveError: any) {
      setError(saveError?.message || 'Could not save the product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close product form"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col bg-[#FBF8F5] shadow-2xl">
        <div className="flex items-center justify-between border-b border-subtle-border bg-white px-5 py-4">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-burgundy">Catalog</p>
            <h2 className="font-playfair text-xl font-bold text-ink">{product ? 'Edit product' : 'Add product'}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-ink/60 hover:bg-blush" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800" role="alert">
                {error}
              </div>
            )}

            <ImageUpload value={imageUrl} onChange={setImageUrl} bucket="product-images" label="Product image" />

            <div>
              <label htmlFor="product-name" className="admin-label">Product name *</label>
              <input id="product-name" value={form.name} onChange={(event) => update('name', event.target.value)} className="admin-input" placeholder="e.g. Royal Anniversary Hamper" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="product-sku" className="admin-label">SKU</label>
                <input id="product-sku" value={form.sku} onChange={(event) => update('sku', event.target.value)} className="admin-input" placeholder="Optional" />
              </div>
              <div>
                <label htmlFor="product-category" className="admin-label">Category</label>
                <select id="product-category" value={form.category_id} onChange={(event) => update('category_id', event.target.value)} className="admin-input">
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="product-price" className="admin-label">Price (₹) *</label>
                <input id="product-price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => update('price', event.target.value)} className="admin-input" placeholder="0" />
              </div>
              <div>
                <label htmlFor="product-sale" className="admin-label">Sale price (₹)</label>
                <input id="product-sale" type="number" min="0" step="0.01" value={form.sale_price} onChange={(event) => update('sale_price', event.target.value)} className="admin-input" placeholder="Optional" />
              </div>
              <div>
                <label htmlFor="product-stock" className="admin-label">Stock *</label>
                <input id="product-stock" type="number" min="0" step="1" value={form.stock} onChange={(event) => update('stock', event.target.value)} className="admin-input" placeholder="0" />
              </div>
            </div>

            <div>
              <label htmlFor="product-description" className="admin-label">Description</label>
              <textarea id="product-description" rows={5} value={form.description} onChange={(event) => update('description', event.target.value)} className="admin-input resize-y" placeholder="Describe the gift, contents, and personalization options." />
            </div>

            <div className="grid gap-3 rounded-xl border border-subtle-border bg-white p-4 sm:grid-cols-2">
              <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <input type="checkbox" checked={form.is_active} onChange={(event) => update('is_active', event.target.checked)} className="h-4 w-4 accent-burgundy" />
                Visible in storefront
              </label>
              <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <input type="checkbox" checked={form.is_featured} onChange={(event) => update('is_featured', event.target.checked)} className="h-4 w-4 accent-burgundy" />
                Feature as bestseller
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-subtle-border bg-white px-5 py-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary min-w-[130px]">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
