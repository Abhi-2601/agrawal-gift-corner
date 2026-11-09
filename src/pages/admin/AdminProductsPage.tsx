import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getProducts, getCategories } from '../../services/productService';

export default function AdminProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ name: '', sku: '', price: '', sale_price: '', stock: 0, category_id: '', description: '', is_active: true, is_featured: false });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setItems(prods || []);
        setCategories(cats || []);
      } catch (e: any) {
        setMsg('Failed to load products: ' + (e?.message || 'DB error'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ name: p.name || '', sku: p.sku || '', price: p.price || '', sale_price: p.sale_price || '', stock: p.stock ?? 0, category_id: p.category_id || '', description: p.description || '', is_active: p.is_active !== false, is_featured: p.is_featured || false });
    setMsg('');
  };

  const save = async () => {
    setMsg('Saving...');
    try {
      if (editId) {
        const { error } = await supabase.from('products').update({
          name: form.name, sku: form.sku, price: Number(form.price), sale_price: form.sale_price ? Number(form.sale_price) : null, stock: Number(form.stock), category_id: form.category_id || null, description: form.description, is_active: form.is_active, is_featured: form.is_featured
        }).eq('id', editId);
        if (error) throw error;
        setMsg('Updated');
      } else {
        const { data: newProd, error: insErr } = await supabase.from('products').insert({
          name: form.name, sku: form.sku || null, price: Number(form.price), sale_price: form.sale_price ? Number(form.sale_price) : null, stock: Number(form.stock), category_id: form.category_id || null, description: form.description || null, is_active: form.is_active, is_featured: form.is_featured
        }).select().single();
        if (insErr) throw insErr;
        setItems([...items, newProd]);
        setMsg('Created');
        setForm({ name: '', sku: '', price: '', sale_price: '', stock: 0, category_id: '', description: '', is_active: true, is_featured: false });
      }
      // Refresh list
      const refreshed = await getProducts();
      setItems(refreshed || []);
      setEditId(null);
    } catch (e: any) {
      setMsg('Error: ' + (e?.message || 'save failed'));
    }
  };

  const toggleActive = async (p: any) => {
    try {
      await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
      setItems(items.map(i => i.id === p.id ? { ...i, is_active: !p.is_active } : i));
    } catch (e: any) {
      setMsg('Update failed');
    }
  };

  const handleDelete = async (p: any) => {
    if (!window.confirm('Delete product ' + (p.name || p.id) + '?')) return;
    try {
      await supabase.from('products').delete().eq('id', p.id);
      setItems(items.filter(i => i.id !== p.id));
      setMsg('Deleted');
    } catch (e: any) {
      setMsg('Delete failed');
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-12 text-ink/70">Loading products...</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm font-medium mb-6"><ArrowLeft size={16}/> Back to Admin</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Products</h1>
      <p className="text-ink/60 mb-6">Real database records. Changes save to Supabase.</p>
      {msg && <div className="bg-[#FFF6F8] border border-[#FBEAF0] rounded-xl p-3 text-sm text-ink mb-4">{msg}</div>}

      <form onSubmit={e => { e.preventDefault(); save(); }} className="bg-white rounded-3xl p-6 shadow-lg border border-[#FBEAF0] mb-8 space-y-4">
        <h2 className="font-playfair text-xl text-ink">{editId ? 'Edit Product' : 'Add Product'}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" />
          <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" />
          <input type="number" required placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input type="number" placeholder="Sale price (optional)" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" />
          <input type="number" required placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]" />
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9]">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-[#FBEAF0] rounded-xl px-4 py-2 bg-[#FFFDF9] h-24" />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-[#D4537E] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#993556]">{editId ? 'Save Changes' : 'Create'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', sku: '', price: '', sale_price: '', stock: 0, category_id: '', description: '', is_active: true, is_featured: false }); }} className="bg-ink/10 text-ink px-6 py-2 rounded-xl font-medium">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-3xl shadow-xl border border-[#FBEAF0] overflow-x-auto">
        <table className="w-full text-sm text-ink/70">
          <thead className="bg-[#FFFDF9]"><tr><th className="text-left py-3 px-4 font-medium">Name</th><th className="text-left py-3 px-4 font-medium">SKU</th><th className="text-left py-3 px-4 font-medium">Price</th><th className="text-left py-3 px-4 font-medium">Stock</th><th className="text-left py-3 px-4 font-medium">Category</th><th className="text-left py-3 px-4 font-medium">Status</th><th className="text-left py-3 px-4 font-medium">Actions</th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-b border-[#FBEAF0]/60">
                <td className="py-3 px-4 font-medium">{p.name}</td>
                <td className="py-3 px-4 text-xs">{p.sku || '-'}</td>
                <td className="py-3 px-4">₹{p.sale_price || p.price}</td>
                <td className="py-3 px-4">{p.stock}</td>
                <td className="py-3 px-4 text-xs">{p.categories?.name || '-'}</td>
                <td className="py-3 px-4"><button onClick={() => toggleActive(p)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.is_active ? 'Active' : 'Hidden'}</button></td>
                <td className="py-3 px-4 flex gap-2"><button onClick={() => openEdit(p)} className="text-xs bg-[#D4537E] text-white px-2 py-1 rounded-md">Edit</button><button onClick={() => handleDelete(p)} className="text-xs bg-ink/10 text-ink px-2 py-1 rounded-md"><Trash2 size={12}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
