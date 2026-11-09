import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, RefreshCw, Search, Tag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { getAdminCategories } from '../../services/productService';
import type { Category } from '../../lib/types';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await getAdminCategories());
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? categories.filter((category) => category.name.toLowerCase().includes(term)) : categories;
  }, [categories, search]);

  const resetForm = () => {
    setName('');
    setIsActive(true);
    setEditingId(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({ name: name.trim(), is_active: isActive })
          .eq('id', editingId);
        if (updateError) throw updateError;
        toast.success('Category updated');
      } else {
        const { error: insertError } = await supabase.from('categories').insert({
          name: name.trim(),
          slug: slugify(name) || `category-${Date.now()}`,
          is_active: isActive,
        });
        if (insertError) throw insertError;
        toast.success('Category created');
      }
      resetForm();
      await load();
    } catch (saveError: any) {
      toast.error(saveError?.message || 'Could not save category.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setIsActive(category.is_active !== false);
  };

  const toggle = async (category: Category) => {
    const { error: updateError } = await supabase
      .from('categories')
      .update({ is_active: category.is_active === false })
      .eq('id', category.id);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    setCategories((current) => current.map((item) => item.id === category.id ? { ...item, is_active: category.is_active === false } : item));
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`Delete “${category.name}”? Products in this category will become uncategorized.`)) return;
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', category.id);
    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }
    setCategories((current) => current.filter((item) => item.id !== category.id));
    toast.success('Category deleted');
  };

  return (
    <div>
      <AdminPageHeader title="Categories" description="Organize your catalog into clear, browsable collections." />

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading categories…" />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
          <form onSubmit={save} className="admin-card h-fit p-5">
            <h2 className="font-playfair text-lg font-bold text-ink">{editingId ? 'Edit category' : 'New category'}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="category-name" className="admin-label">Category name *</label>
                <input id="category-name" required value={name} onChange={(event) => setName(event.target.value)} className="admin-input" placeholder="e.g. Gift Hampers" />
              </div>
              <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 accent-burgundy" />
                Visible in storefront
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs"><Plus size={14} /> {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create category'}</button>
                {editingId && <button type="button" onClick={resetForm} className="btn-secondary text-xs">Cancel</button>}
              </div>
            </div>
          </form>

          <div className="admin-card overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-subtle-border p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories…" className="admin-input pl-9" />
              </div>
              <button type="button" onClick={() => void load()} className="btn-secondary px-3 py-2 text-xs"><RefreshCw size={14} /> Refresh</button>
            </div>

            {categories.length === 0 ? (
              <AdminEmpty icon={Tag} title="No categories yet" description="Create a category to organize your products." />
            ) : filtered.length === 0 ? (
              <AdminEmpty title="No matching categories" description="Try a different search term." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-[#FBF8F5] text-[0.68rem] uppercase tracking-[0.08em] text-secondary-text">
                    <tr><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">Slug</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((category) => (
                      <tr key={category.id} className="border-t border-subtle-border/70">
                        <td className="px-4 py-3 font-semibold text-ink">{category.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-secondary-text">{category.slug}</td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => void toggle(category)}><StatusBadge status={category.is_active === false ? 'hidden' : 'active'} /></button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button type="button" onClick={() => edit(category)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-burgundy/30 hover:text-burgundy" aria-label={`Edit ${category.name}`}><Pencil size={14} /></button>
                            <button type="button" onClick={() => void remove(category)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-red-200 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${category.name}`}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
