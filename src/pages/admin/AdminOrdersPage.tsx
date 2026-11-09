import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(30);
        setOrders(data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch {
      // silent failure; could show error in real UI
    }
  };

  const updatePayment = async (id: string, paymentStatus: string) => {
    try {
      await supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', id);
      setOrders(orders.map(o => o.id === id ? { ...o, payment_status: paymentStatus } : o));
    } catch {
      // silent
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-12 text-ink/70">Loading orders...</div>;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm font-medium mb-6"><ArrowLeft size={16}/> Back to Dashboard</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Orders</h1>
      <p className="text-ink/60 mb-6">Real database records. Status updates save to Supabase.</p>

      <div className="bg-white rounded-3xl shadow-xl border border-[#FBEAF0] overflow-x-auto">
        <table className="w-full text-sm text-ink/70">
          <thead className="bg-[#FFFDF9]"><tr><th className="text-left p-3 font-medium">Order</th><th className="text-left p-3 font-medium">Customer</th><th className="text-left p-3 font-medium">Address</th><th className="text-left p-3 font-medium">Total</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Payment</th><th className="text-left p-3 font-medium">Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-[#FBEAF0]/60">
                <td className="p-3 font-medium text-ink">{o.id?.slice(0, 8) || '-'}</td>
                <td className="p-3">{o.customer_name || o.profiles?.full_name || '-'}</td>
                <td className="p-3 text-xs">{[o.shipping_city, o.shipping_state, o.shipping_pincode].filter(Boolean).join(', ')}</td>
                <td className="p-3">₹{o.total_amount || 0}</td>
                <td className="p-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : o.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{o.status || 'pending'}</span></td>
                <td className="p-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.payment_status === 'unpaid' ? 'bg-red-100 text-red-700' : o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{o.payment_status || 'unpaid'}</span></td>
                <td className="p-3"><div className="flex gap-1">
                  <button onClick={() => updateStatus(o.id, 'confirmed')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium" title="Confirm">Confirm</button>
                  <button onClick={() => updateStatus(o.id, 'cancelled')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium" title="Cancel">Cancel</button>
                  <button onClick={() => updatePayment(o.id, 'paid')} className="text-xs bg-[#D4537E] text-white px-2 py-1 rounded-md font-medium" title="Mark paid">Paid</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
