import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({ shipping_fee: '', shipping_threshold: '', whatsapp: '', delivery_note: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('website_settings').select('*');
      const map: any = {};
      (data || []).forEach((s: any) => { map[s.key] = s.value; });
      setSettings({ shipping_fee: map.shipping_fee ?? '', shipping_threshold: map.shipping_threshold ?? '', whatsapp: map.whatsapp ?? '', delivery_note: map.delivery_note ?? '' });
    })();
  }, []);

  const save = async (key: string, value: any) => {
    try {
      await supabase.from('website_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      setMsg(key + ' updated');
    } catch (e: any) { setMsg('Error: ' + e.message); }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm mb-6"><ArrowLeft size={16}/> Back</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Website Settings</h1>
      <p className="text-ink/60 mb-6">Real database values — no hardcoded rules.</p>
      {msg && <div className="bg-[#FFF6F8] border border-[#FBEAF0] rounded-xl p-3 text-sm mb-4">{msg}</div>}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#FBEAF0] space-y-6">
        <div><label className="font-medium text-sm">Shipping Fee (₹)</label><input type="number" value={settings.shipping_fee} onChange={e => setSettings({ ...settings, shipping_fee: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 mt-1 bg-[#FFFDF9]" /><button onClick={() => save('shipping_fee', Number(settings.shipping_fee))} className="mt-2 text-xs bg-[#D4537E] text-white px-3 py-1 rounded-md">Save</button></div>
        <div><label className="font-medium text-sm">Free Shipping Threshold (₹)</label><input type="number" value={settings.shipping_threshold} onChange={e => setSettings({ ...settings, shipping_threshold: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 mt-1 bg-[#FFFDF9]" /><button onClick={() => save('shipping_threshold', Number(settings.shipping_threshold))} className="mt-2 text-xs bg-[#D4537E] text-white px-3 py-1 rounded-md">Save</button></div>
        <div><label className="font-medium text-sm">WhatsApp / Phone</label><input value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 mt-1 bg-[#FFFDF9]" /><button onClick={() => save('whatsapp', settings.whatsapp)} className="mt-2 text-xs bg-[#D4537E] text-white px-3 py-1 rounded-md">Save</button></div>
      </div>
    </section>
  );
}
