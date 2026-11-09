import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, Users, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ products: 0, orders: 0, reviews: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, o, r, c] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', true),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
        ]);
        setCounts({
          products: p.count ?? 0,
          orders: o.count ?? 0,
          reviews: r.count ?? 0,
          customers: c.count ?? 0,
        });
      } catch {
        // leave at 0; don't fake
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair text-4xl text-ink mb-2">Admin Dashboard</h1>
      <p className="text-ink/60 mb-8">Manage products, orders, reviews, and settings.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Products', icon: Package, count: counts.products, link: '/admin/products' },
          { label: 'Orders', icon: ClipboardList, count: counts.orders, link: '/admin/orders' },
          { label: 'Reviews', icon: ShieldCheck, count: counts.reviews, link: '/admin/reviews' },
          { label: 'Customers', icon: Users, count: counts.customers, link: '/admin/customers' },
        ].map(s => (
          <Link key={s.label} to={s.link} className="bg-white rounded-3xl p-6 shadow-lg border border-[#FBEAF0] hover:border-[#D4537E] transition group">
            <div className="flex items-center justify-between mb-4"><s.icon size={28} className="text-[#D4537E]"/><span className="font-playfair text-3xl text-ink">{loading ? '-' : s.count}</span></div>
            <h3 className="font-playfair text-xl text-ink group-hover:text-dark-pink transition">{s.label}</h3>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#D4537E] to-[#993556] rounded-3xl p-8 text-white shadow-xl shadow-pink-900/20">
          <h3 className="font-playfair text-2xl mb-2">Quick Actions</h3>
          <div className="space-y-2 text-sm text-white/90">
            <Link to="/admin/products" className="block hover:underline">Manage Products</Link>
            <Link to="/admin/orders" className="block hover:underline">View New Orders</Link>
            <Link to="/admin/reviews" className="block hover:underline">Moderate Reviews</Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#FBEAF0] md:col-span-2">
          <h3 className="font-playfair text-2xl text-ink mb-4">Recent Orders (Live)</h3>
          <RealOrdersTable />
        </div>
      </div>
    </section>
  );
}

function RealOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('orders').select('id, customer_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(6);
        setOrders(data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-sm text-ink/60">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-sm text-ink/60">No orders yet.</p>;

  return (
    <table className="w-full text-sm text-ink/70">
      <thead><tr className="border-b border-[#FBEAF0]"><th className="text-left py-2 font-medium">Order ID</th><th className="text-left py-2 font-medium">Customer</th><th className="text-left py-2 font-medium">Total</th><th className="text-left py-2 font-medium">Status</th><th className="text-left py-2 font-medium">Created</th></tr></thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id} className="border-b border-[#FBEAF0]/60"><td className="py-2 font-medium text-ink">{o.id?.slice(0, 8) || '-'}</td><td>{o.customer_name || '-'}</td><td>₹{o.total_amount || 0}</td><td><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : o.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{o.status || '-'}</span></td><td className="text-xs">{o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN') : '-'}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
