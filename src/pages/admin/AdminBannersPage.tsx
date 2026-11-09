import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Image, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/admin/ImageUpload';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';
import { getAdminBanners } from '../../services/productService';
import type { Banner } from '../../lib/types';

const EMPTY_FORM = {
  title: '',
  link_url: '',
  image_url: '',
  position: 'home_top',
  start_date: '',
  end_date: '',
  is_active: true,
};

function toLocalInput(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBanners(await getAdminBanners());
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load banners.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.image_url) {
      toast.error('Add a title and image before saving.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        link_url: form.link_url.trim() || null,
        image_url: form.image_url,
        position: form.position,
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        is_active: form.is_active,
      };
      if (editingId) {
        const { error: updateError } = await supabase.from('banners').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        toast.success('Banner updated');
      } else {
        const { error: insertError } = await supabase.from('banners').insert(payload);
        if (insertError) throw insertError;
        toast.success('Banner created');
      }
      resetForm();
      await load();
    } catch (saveError: any) {
      toast.error(saveError?.message || 'Could not save banner.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title || '',
      link_url: banner.link_url || '',
      image_url: banner.image_url,
      position: banner.position || 'home_top',
      start_date: toLocalInput(banner.start_date),
      end_date: toLocalInput(banner.end_date),
      is_active: banner.is_active !== false,
    });
  };

  const toggle = async (banner: Banner) => {
    const { error: updateError } = await supabase.from('banners').update({ is_active: banner.is_active === false }).eq('id', banner.id);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    setBanners((current) => current.map((item) => item.id === banner.id ? { ...item, is_active: banner.is_active === false } : item));
  };

  const remove = async (banner: Banner) => {
    if (!window.confirm(`Delete “${banner.title || 'this banner'}”?`)) return;
    const { error: deleteError } = await supabase.from('banners').delete().eq('id', banner.id);
    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }
    setBanners((current) => current.filter((item) => item.id !== banner.id));
    toast.success('Banner deleted');
  };

  return (
    <div>
      <AdminPageHeader
        title="Banners"
        description="Manage the promotional banners shown on the storefront."
        actions={<button type="button" onClick={() => void load()} className="btn-secondary text-xs"><RefreshCw size={14} /> Refresh</button>}
      />

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading banners…" />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <form onSubmit={save} className="admin-card h-fit p-5">
            <h2 className="font-playfair text-lg font-bold text-ink">{editingId ? 'Edit banner' : 'New banner'}</h2>
            <div className="mt-4 space-y-4">
              <ImageUpload value={form.image_url} onChange={(url) => setForm((current) => ({ ...current, image_url: url }))} bucket="banners" label="Banner image *" aspect="banner" />
              <div>
                <label htmlFor="banner-title" className="admin-label">Title *</label>
                <input id="banner-title" required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="admin-input" placeholder="e.g. The festive edit" />
              </div>
              <div>
                <label htmlFor="banner-link" className="admin-label">Link URL</label>
                <input id="banner-link" value={form.link_url} onChange={(event) => setForm((current) => ({ ...current, link_url: event.target.value }))} className="admin-input" placeholder="/products?cat=Festive" />
              </div>
              <div>
                <label htmlFor="banner-position" className="admin-label">Position</label>
                <select id="banner-position" value={form.position} onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))} className="admin-input">
                  <option value="home_top">Homepage top</option>
                  <option value="home_middle">Homepage middle</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="banner-start" className="admin-label">Starts</label>
                  <input id="banner-start" type="datetime-local" value={form.start_date} onChange={(event) => setForm((current) => ({ ...current, start_date: event.target.value }))} className="admin-input" />
                </div>
                <div>
                  <label htmlFor="banner-end" className="admin-label">Ends</label>
                  <input id="banner-end" type="datetime-local" value={form.end_date} onChange={(event) => setForm((current) => ({ ...current, end_date: event.target.value }))} className="admin-input" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} className="h-4 w-4 accent-burgundy" />
                Active
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs"><Plus size={14} /> {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create banner'}</button>
                {editingId && <button type="button" onClick={resetForm} className="btn-secondary text-xs">Cancel</button>}
              </div>
            </div>
          </form>

          <div>
            {banners.length === 0 ? (
              <AdminEmpty icon={Image} title="No banners yet" description="Create a promotional banner to feature on the homepage." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {banners.map((banner) => (
                  <article key={banner.id} className="admin-card overflow-hidden">
                    <div className="aspect-[16/7] bg-sand">
                      {banner.image_url ? <img src={banner.image_url} alt={banner.title || ''} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-secondary-text"><Image size={24} /></div>}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-playfair text-lg font-bold text-ink">{banner.title || 'Untitled banner'}</h3>
                          <p className="mt-0.5 text-[0.68rem] text-secondary-text">{banner.position?.replace(/_/g, ' ')}</p>
                        </div>
                        <StatusBadge status={banner.is_active === false ? 'hidden' : 'active'} />
                      </div>
                      <p className="mt-2 line-clamp-1 text-xs text-secondary-text">{banner.link_url || 'No link'}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] text-secondary-text">
                        {banner.start_date && <span>From {formatDate(banner.start_date)}</span>}
                        {banner.end_date && <span>To {formatDate(banner.end_date)}</span>}
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        <button type="button" onClick={() => edit(banner)} className="btn-secondary flex-1 py-2 text-[0.68rem]"><Pencil size={13} /> Edit</button>
                        <button type="button" onClick={() => void toggle(banner)} className="btn-secondary px-3 py-2 text-[0.68rem]">{banner.is_active === false ? 'Show' : 'Hide'}</button>
                        <button type="button" onClick={() => void remove(banner)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-red-200 hover:bg-red-50 hover:text-red-700" aria-label="Delete banner"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
