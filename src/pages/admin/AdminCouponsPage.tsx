import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, RefreshCw, Search, TicketPercent, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number | null;
  max_discount_amount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  code: '',
  discount_type: 'percentage' as 'percentage' | 'fixed',
  discount_value: '',
  min_order_value: '',
  max_discount_amount: '',
  starts_at: '',
  ends_at: '',
  is_active: true,
};

function toLocalInput(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (loadError) throw loadError;
      setCoupons((data || []) as Coupon[]);
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load coupons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? coupons.filter((coupon) => coupon.code.toLowerCase().includes(term)) : coupons;
  }, [coupons, search]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const value = Number(form.discount_value);
    if (!form.code.trim() || !Number.isFinite(value) || value <= 0) {
      toast.error('Enter a coupon code and a valid discount value.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: value,
        min_order_value: form.min_order_value ? Number(form.min_order_value) : 0,
        max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };
      if (editingId) {
        const { error: updateError } = await supabase.from('coupons').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        toast.success('Coupon updated');
      } else {
        const { error: insertError } = await supabase.from('coupons').insert(payload);
        if (insertError) throw insertError;
        toast.success('Coupon created');
      }
      resetForm();
      await load();
    } catch (saveError: any) {
      toast.error(saveError?.message || 'Could not save coupon.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      min_order_value: coupon.min_order_value == null ? '' : String(coupon.min_order_value),
      max_discount_amount: coupon.max_discount_amount == null ? '' : String(coupon.max_discount_amount),
      starts_at: toLocalInput(coupon.starts_at),
      ends_at: toLocalInput(coupon.ends_at),
      is_active: coupon.is_active,
    });
  };

  const toggle = async (coupon: Coupon) => {
    const { error: updateError } = await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    setCoupons((current) => current.map((item) => item.id === coupon.id ? { ...item, is_active: !item.is_active } : item));
  };

  const remove = async (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon “${coupon.code}”?`)) return;
    const { error: deleteError } = await supabase.from('coupons').delete().eq('id', coupon.id);
    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }
    setCoupons((current) => current.filter((item) => item.id !== coupon.id));
    toast.success('Coupon deleted');
  };

  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        description="Create discount codes for campaigns and seasonal offers."
        actions={<button type="button" onClick={() => void load()} className="btn-secondary text-xs"><RefreshCw size={14} /> Refresh</button>}
      />

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading coupons…" />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <form onSubmit={save} className="admin-card h-fit p-5">
            <h2 className="font-playfair text-lg font-bold text-ink">{editingId ? 'Edit coupon' : 'New coupon'}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="coupon-code" className="admin-label">Coupon code *</label>
                <input id="coupon-code" required value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} className="admin-input font-mono uppercase" placeholder="WELCOME10" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="coupon-type" className="admin-label">Type</label>
                  <select id="coupon-type" value={form.discount_type} onChange={(event) => setForm((current) => ({ ...current, discount_type: event.target.value as 'percentage' | 'fixed' }))} className="admin-input">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="coupon-value" className="admin-label">Value *</label>
                  <input id="coupon-value" type="number" min="0" step="0.01" value={form.discount_value} onChange={(event) => setForm((current) => ({ ...current, discount_value: event.target.value }))} className="admin-input" placeholder="10" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="coupon-min" className="admin-label">Minimum order (₹)</label>
                  <input id="coupon-min" type="number" min="0" value={form.min_order_value} onChange={(event) => setForm((current) => ({ ...current, min_order_value: event.target.value }))} className="admin-input" placeholder="0" />
                </div>
                <div>
                  <label htmlFor="coupon-max" className="admin-label">Max discount (₹)</label>
                  <input id="coupon-max" type="number" min="0" value={form.max_discount_amount} onChange={(event) => setForm((current) => ({ ...current, max_discount_amount: event.target.value }))} className="admin-input" placeholder="Optional" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="coupon-start" className="admin-label">Starts</label>
                  <input id="coupon-start" type="datetime-local" value={form.starts_at} onChange={(event) => setForm((current) => ({ ...current, starts_at: event.target.value }))} className="admin-input" />
                </div>
                <div>
                  <label htmlFor="coupon-end" className="admin-label">Ends</label>
                  <input id="coupon-end" type="datetime-local" value={form.ends_at} onChange={(event) => setForm((current) => ({ ...current, ends_at: event.target.value }))} className="admin-input" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} className="h-4 w-4 accent-burgundy" />
                Active
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs"><Plus size={14} /> {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create coupon'}</button>
                {editingId && <button type="button" onClick={resetForm} className="btn-secondary text-xs">Cancel</button>}
              </div>
            </div>
          </form>

          <div className="admin-card overflow-hidden">
            <div className="border-b border-subtle-border p-4">
              <div className="relative max-w-md">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search coupons…" className="admin-input pl-9" />
              </div>
            </div>

            {coupons.length === 0 ? (
              <AdminEmpty icon={TicketPercent} title="No coupons yet" description="Create a discount code for your next campaign." />
            ) : filtered.length === 0 ? (
              <AdminEmpty title="No coupons match that search" description="Try another coupon code." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-[#FBF8F5] text-[0.68rem] uppercase tracking-[0.08em] text-secondary-text">
                    <tr><th className="px-4 py-3 font-semibold">Code</th><th className="px-4 py-3 font-semibold">Discount</th><th className="px-4 py-3 font-semibold">Minimum</th><th className="px-4 py-3 font-semibold">Window</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((coupon) => (
                      <tr key={coupon.id} className="border-t border-subtle-border/70">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-ink">{coupon.code}</td>
                        <td className="px-4 py-3 text-xs text-ink/70">{coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(Number(coupon.discount_value))}{coupon.max_discount_amount ? ` · max ${formatCurrency(Number(coupon.max_discount_amount))}` : ''}</td>
                        <td className="px-4 py-3 text-xs text-ink/70">{formatCurrency(Number(coupon.min_order_value || 0))}</td>
                        <td className="px-4 py-3 text-[0.68rem] text-secondary-text">{coupon.starts_at ? formatDate(coupon.starts_at) : 'Now'}{coupon.ends_at ? ` – ${formatDate(coupon.ends_at)}` : ' – open'}</td>
                        <td className="px-4 py-3"><button type="button" onClick={() => void toggle(coupon)}><StatusBadge status={coupon.is_active ? 'active' : 'hidden'} /></button></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button type="button" onClick={() => edit(coupon)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-burgundy/30 hover:text-burgundy" aria-label={`Edit ${coupon.code}`}><Pencil size={14} /></button>
                            <button type="button" onClick={() => void remove(coupon)} className="grid h-8 w-8 place-items-center rounded-lg border border-subtle-border text-ink/60 hover:border-red-200 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${coupon.code}`}><Trash2 size={14} /></button>
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
