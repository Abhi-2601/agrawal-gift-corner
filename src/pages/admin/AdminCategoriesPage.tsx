import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', is_active: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { refresh(); }, []);
  const refresh = async () => { try { const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false }); setItems(data || []); } catch { setMsg('Load error'); } };

  const save = async () => {
    try {
      if (editingId) {
        await supabase.from('categories').update({ name: form.name, is_active: form.is_active }).eq('id', editingId);
        setMsg('Updated');
      } else {
        const generatedSlug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await supabase.from('categories').insert({ name: form.name, slug: generatedSlug || `cat-${Date.now()}`, is_active: form.is_active });
        setMsg('Created');
      }
      setForm({ name: '', is_active: true });
      setEditingId(null);
      refresh();
    } catch (e: any) { setMsg('Error: ' + e.message); }
  };

  const toggle = async (c: any) => { await supabase.from('categories').update({ is_active: !c.is_active }).eq('id', c.id); refresh(); };
  const remove = async (c: any) => { if (!window.confirm('Remove ' + c.name + '?')) return; await supabase.from('categories').delete().eq('id', c.id); refresh(); };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm mb-6"><ArrowLeft size={16}/> Back</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Categories</h1>
      <p className="text-ink/60 mb-6">Database-backed. No placeholders.</p>
      {msg && <div className="bg-[#FFF6F8] border border-[#FBEAF0] rounded-xl p-3 text-sm mb-4">{msg}</div>}
      <form onSubmit={e => { e.preventDefault(); save(); }} className="bg-white rounded-3xl p-6 shadow-lg border border-[#FBEAF0] mb-8 space-y-4">
        <h2 className="font-playfair text-xl">{editingId ? 'Edit' : 'New Category'}</h2>
        <input required placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        <div className="flex gap-3"><button className="bg-[#D4537E] text-white px-6 py-2 rounded-xl font-medium">{editingId ? 'Save' : 'Create'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', is_active: true }); }} className="bg-ink/10 px-6 py-2 rounded-xl">Cancel</button>}</div>
      </form>
      <div className="bg-white rounded-3xl shadow-xl border border-[#FBEAF0] overflow-x-auto">
        <table className="w-full text-sm text-ink/70"><thead className="bg-[#FFFDF9]"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead><tbody>
          {items.map(c => <tr key={c.id} className="border-b border-[#FBEAF0]/60"><td className="p-3 font-medium">{c.name}</td><td><button onClick={() => toggle(c)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.is_active ? 'Active' : 'Hidden'}</button></td><td className="p-3"><button onClick={() => { setEditingId(c.id); setForm({ name: c.name, is_active: c.is_active }); }} className="text-xs bg-[#D4537E] text-white px-2 py-1 rounded-md mr-1">Edit</button><button onClick={() => remove(c)} className="text-xs bg-ink/10 px-2 py-1 rounded-md"><Trash2 size={12}/></button></td></tr>)}
        </tbody></table>
      </div>
    </section>
  );
}
