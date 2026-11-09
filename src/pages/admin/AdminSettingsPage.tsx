import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { MessageCircle, Save, Settings, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminError, AdminLoading, AdminPageHeader } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';

interface SettingsForm {
  shipping_fee: string;
  shipping_threshold: string;
  whatsapp: string;
  delivery_note: string;
}

const DEFAULTS: SettingsForm = {
  shipping_fee: '50',
  shipping_threshold: '1000',
  whatsapp: '+91 75799 51781',
  delivery_note: '',
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await supabase.from('website_settings').select('*');
      if (loadError) throw loadError;
      const map: Record<string, any> = {};
      (data || []).forEach((row) => { map[row.key] = row.value; });
      setForm({
        shipping_fee: String(map.shipping_fee ?? DEFAULTS.shipping_fee),
        shipping_threshold: String(map.shipping_threshold ?? DEFAULTS.shipping_threshold),
        whatsapp: String(map.whatsapp ?? DEFAULTS.whatsapp),
        delivery_note: String(map.delivery_note ?? ''),
      });
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const rows: Array<{ key: string; value: string | number; description: string; updated_at: string }> = [
        { key: 'shipping_fee', value: Number(form.shipping_fee) || 0, description: 'Standard shipping fee in INR', updated_at: new Date().toISOString() },
        { key: 'shipping_threshold', value: Number(form.shipping_threshold) || 0, description: 'Free shipping threshold in INR', updated_at: new Date().toISOString() },
        { key: 'whatsapp', value: form.whatsapp.trim(), description: 'Store customer service WhatsApp contact', updated_at: new Date().toISOString() },
        { key: 'delivery_note', value: form.delivery_note.trim(), description: 'Delivery note shown to customers', updated_at: new Date().toISOString() },
      ];
      for (const row of rows) {
        const { error: upsertError } = await supabase.from('website_settings').upsert(row, { onConflict: 'key' });
        if (upsertError) throw upsertError;
      }
      toast.success('Settings saved');
    } catch (saveError: any) {
      toast.error(saveError?.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Settings" description="Store-level shipping, contact, and delivery information." />

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading settings…" />
      ) : (
        <form onSubmit={save} className="max-w-3xl space-y-4">
          <section className="admin-card p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FBEAEC] text-burgundy"><Truck size={17} /></span>
              <div>
                <h2 className="font-playfair text-lg font-bold text-ink">Shipping</h2>
                <p className="text-[0.68rem] text-secondary-text">Used by cart and checkout totals.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="shipping-fee" className="admin-label">Standard shipping fee (₹)</label>
                <input id="shipping-fee" type="number" min="0" value={form.shipping_fee} onChange={(event) => setForm((current) => ({ ...current, shipping_fee: event.target.value }))} className="admin-input" />
              </div>
              <div>
                <label htmlFor="shipping-threshold" className="admin-label">Free shipping above (₹)</label>
                <input id="shipping-threshold" type="number" min="0" value={form.shipping_threshold} onChange={(event) => setForm((current) => ({ ...current, shipping_threshold: event.target.value }))} className="admin-input" />
              </div>
            </div>
          </section>

          <section className="admin-card p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FBEAEC] text-burgundy"><MessageCircle size={17} /></span>
              <div>
                <h2 className="font-playfair text-lg font-bold text-ink">Contact & delivery note</h2>
                <p className="text-[0.68rem] text-secondary-text">Customer-facing contact details and order guidance.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="whatsapp" className="admin-label">WhatsApp / phone</label>
                <input id="whatsapp" value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} className="admin-input" placeholder="+91 75799 51781" />
              </div>
              <div>
                <label htmlFor="delivery-note" className="admin-label">Delivery note</label>
                <textarea id="delivery-note" rows={4} value={form.delivery_note} onChange={(event) => setForm((current) => ({ ...current, delivery_note: event.target.value }))} className="admin-input resize-y" placeholder="e.g. Delivery in 7–15 days after confirmation." />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary"><Save size={15} /> {saving ? 'Saving…' : 'Save settings'}</button>
          </div>

          <p className="flex items-center gap-1.5 text-[0.68rem] text-secondary-text"><Settings size={13} /> These values are read directly from Supabase `website_settings`.</p>
        </form>
      )}
    </div>
  );
}
