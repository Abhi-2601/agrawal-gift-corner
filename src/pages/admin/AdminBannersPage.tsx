import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminBannersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', link_url: '', image_url: '', start_date: '', end_date: '', position: 'home_top', is_active: true });
  const [msg, setMsg] = useState('');

  const refresh = async () => { try { const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false }); setRows(data || []); } catch { setMsg('Load error'); } };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    try {
      await supabase.from('banners').insert({ title: form.title, link_url: form.link_url || null, image_url: form.image_url || null, position: form.position || 'home_top', start_date: form.start_date || null, end_date: form.end_date || null, is_active: form.is_active });
      setMsg('Banner created');
      setForm({ title: '', link_url: '', image_url: '', start_date: '', end_date: '', position: 'home_top', is_active: true });
      refresh();
    } catch (e: any) { setMsg('Error: ' + e.message); }
  };

  const toggle = async (b: any) => { await supabase.from('banners').update({ is_active: !b.is_active }).eq('id', b.id); refresh(); };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm mb-6"><ArrowLeft size={16}/> Back</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Banners</h1>
      <p className="text-ink/60 mb-6">Active banners rendered on homepage.</p>
      {msg && <div className="bg-[#FFF6F8] border border-[#FBEAF0] rounded-xl p-3 text-sm mb-4">{msg}</div>}
      <form onSubmit={e => { e.preventDefault(); save(); }} className="bg-white rounded-3xl p-6 shadow-lg border border-[#FBEAF0] mb-8 space-y-4">
        <h2 className="font-playfair text-xl">New Banner</h2>
        <div className="grid md:grid-cols-2 gap-4"><input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" /><input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" /></div>
        <div className="grid md:grid-cols-2 gap-4"><input placeholder="Link URL" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        <button className="bg-[#D4537E] text-white px-6 py-2 rounded-xl font-medium">Create</button>
      </form>
      <div className="grid md:grid-cols-3 gap-4">
        {rows.map(b => (
          <div key={b.id} className="bg-white rounded-3xl p-4 shadow-lg border border-[#FBEAF0]">
            <img src={b.image_url || ''} alt={b.title || ''} className="w-full h-32 object-cover rounded-xl mb-3" />
            <h3 className="font-playfair text-lg">{b.title}</h3>
            <div className="text-xs text-ink/60 mb-2">Link: {b.link_url || '-'}</div>
            <button onClick={() => toggle(b)} className={`text-xs font-bold px-2 py-1 rounded-full ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.is_active ? 'Active' : 'Hidden'}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
