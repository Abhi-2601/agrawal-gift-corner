import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminOrderDetailPage() {
  const orderId = window.location.pathname.split('/').pop();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const { data: o } = await supabase.from('orders').select('*, profiles(full_name)').eq('id', orderId).single();
        setOrder(o || null);
        if (o?.id) {
          const { data: it } = await supabase.from('order_items').select('*, products(name, image)').eq('order_id', o.id);
          setItems(it || []);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-ink/70">Loading order...</div>;
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-12 text-ink/70">Order not found.</div>;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-ink/50 hover:text-dark-pink text-sm font-medium mb-6"><ArrowLeft size={16}/> Back to Orders</Link>
      <h1 className="font-playfair text-4xl text-ink mb-2">Order {order.id?.slice(0, 8)}</h1>
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#FBEAF0] space-y-3">
          <h2 className="font-playfair text-xl text-ink">Customer & Address</h2>
          <div><span className="text-xs text-ink/50">Name</span><p className="font-medium">{order.customer_name || '-'}</p></div>
          <div><span className="text-xs text-ink/50">Phone</span><p className="font-medium">{order.customer_phone || '-'}</p></div>
          <div><span className="text-xs text-ink/50">Email</span><p className="font-medium">{order.customer_email || '-'}</p></div>
          <div><span className="text-xs text-ink/50">Address</span><p className="text-sm">{[order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_pincode].filter(Boolean).join(', ')}</p></div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#FBEAF0] space-y-3">
          <h2 className="font-playfair text-xl text-ink">Order Summary</h2>
          <div><span className="text-xs text-ink/50">Status</span><span className="font-bold">{order.status || 'pending'}</span></div>
          <div><span className="text-xs text-ink/50">Payment</span><span className="font-bold">{order.payment_status || 'unpaid'}</span></div>
          <div><span className="text-xs text-ink/50">Subtotal</span><span>₹{order.subtotal || 0}</span></div>
          <div><span className="text-xs text-ink/50">Shipping</span><span>₹{order.shipping_fee || 0}</span></div>
          <div><span className="text-xs text-ink/50">Total</span><span className="font-bold text-lg">₹{order.total_amount || 0}</span></div>
          <div><span className="text-xs text-ink/50">Created</span><span className="text-sm">{order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : '-'}</span></div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg border border-[#FBEAF0]">
        <h2 className="font-playfair text-xl text-ink mb-4">Items</h2>
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.id} className="flex gap-4 items-start border-b border-[#FBEAF0]/60 pb-3 last:border-0">
              <img src={i.products?.image || ''} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#FFFDF9]" />
              <div className="flex-1">
                <div className="font-medium">{i.product_name || i.products?.name || '-'}</div>
                <div className="text-xs text-ink/60">Qty: {i.quantity} • ₹{i.price_at_time} each</div>
                {i.customization_notes && <div className="text-xs text-[#D4537E] mt-1">Customization: {i.customization_notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
