import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const { data } = await supabase.from('reviews').select('*, profiles(full_name)').order('created_at', { ascending: false }); setRows(data || []); } catch { setRows([]); } finally { setLoading(false); } })(); }, []);
  const approve = async (id: string) => { await supabase.from('reviews').update({ is_approved: true }).eq('id', id); setRows(rows.map(r => r.id === id ? { ...r, is_approved: true } : r)); };
  const reject = async (id: string) => { await supabase.from('reviews').update({ is_approved: false }).eq('id', id); setRows(rows.map(r => r.id === id ? { ...r, is_approved: false } : r)); };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-ink/70">Loading reviews...</div>;
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm mb-6"><ArrowLeft size={16}/> Back</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Reviews</h1>
      <p className="text-ink/60 mb-6">Moderate approved/unapproved reviews.</p>
      <div className="space-y-4">
        {rows.map(r => (
          <div key={r.id} className="bg-white rounded-3xl p-6 shadow-lg border border-[#FBEAF0] flex gap-4 items-start">
            <div className="flex-1"><div className="font-medium">{r.profiles?.full_name || 'Unknown'}</div><div className="text-xs text-ink/50">{r.product_id ? 'Product review' : 'General'}</div><div className="mt-2 text-sm">{r.comment || '-'}</div><div className="text-xs text-ink/40 mt-1">{r.rating || 0} stars • {r.is_approved ? 'Approved' : 'Pending'}</div></div>
            <div className="flex gap-2"><button onClick={() => approve(r.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold"><Check size={12}/></button><button onClick={() => reject(r.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold"><X size={12}/></button></div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-ink/50">No reviews.</p>}
      </div>
    </section>
  );
}
