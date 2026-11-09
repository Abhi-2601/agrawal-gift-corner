import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardList,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Star,
  TicketPercent,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AdminError, AdminLoading, AdminPageHeader, StatCard, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';

interface DashboardCounts {
  products: number;
  orders: number;
  pendingReviews: number;
  customers: number;
}

interface RecentOrder {
  id: string;
  customer_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({ products: 0, orders: 0, pendingReviews: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, customer_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(100),
      ]);
      const firstError = results.map((result) => result.error).find(Boolean);
      if (firstError) throw firstError;

      const [products, orders, reviews, customers, recent] = results;
      setCounts({
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        pendingReviews: reviews.count ?? 0,
        customers: customers.count ?? 0,
      });
      setRecentOrders((recent.data || []) as RecentOrder[]);
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const lastSevenDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      count: 0,
    };
  });
  recentOrders.forEach((order) => {
    const day = lastSevenDays.find((item) => item.key === order.created_at?.slice(0, 10));
    if (day) day.count += 1;
  });
  const maxCount = Math.max(1, ...lastSevenDays.map((day) => day.count));

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="A quick view of your store, orders, and customer activity."
        actions={
          <Link to="/admin/products?new=1" className="btn-primary text-xs"><Plus size={15} /> Add product</Link>
        }
      />

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading dashboard…" />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Products" value={counts.products} icon={Package} tone="burgundy" hint="In your catalog" />
            <StatCard label="Orders" value={counts.orders} icon={ShoppingBag} tone="amber" hint="All time" />
            <StatCard label="Pending reviews" value={counts.pendingReviews} icon={Star} tone="green" hint="Awaiting moderation" />
            <StatCard label="Customers" value={counts.customers} icon={Users} tone="blue" hint="Registered profiles" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="admin-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-ink">Orders overview</h2>
                  <p className="mt-0.5 text-xs text-secondary-text">Orders received in the last 7 days</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-700">
                  <TrendingUp size={12} /> Live
                </span>
              </div>

              <div className="mt-6 flex h-44 items-end gap-2 sm:gap-4">
                {lastSevenDays.map((day) => (
                  <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-burgundy to-[#B64B5B] transition-all"
                        style={{ height: `${Math.max(6, (day.count / maxCount) * 100)}%` }}
                        title={`${day.count} orders`}
                      />
                    </div>
                    <span className="text-[0.65rem] font-medium text-secondary-text">{day.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-card p-5">
              <h2 className="font-playfair text-xl font-bold text-ink">Quick actions</h2>
              <div className="mt-3 space-y-2">
                <Link to="/admin/products?new=1" className="flex items-center gap-3 rounded-lg border border-subtle-border p-3 text-sm font-semibold text-ink/75 transition-colors hover:border-burgundy/25 hover:bg-[#FBF8F5] hover:text-burgundy">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FBEAEC] text-burgundy"><Plus size={16} /></span>
                  Add a product
                  <ArrowRight size={14} className="ml-auto text-secondary-text" />
                </Link>
                <Link to="/admin/orders" className="flex items-center gap-3 rounded-lg border border-subtle-border p-3 text-sm font-semibold text-ink/75 transition-colors hover:border-burgundy/25 hover:bg-[#FBF8F5] hover:text-burgundy">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700"><ClipboardList size={16} /></span>
                  Manage orders
                  <ArrowRight size={14} className="ml-auto text-secondary-text" />
                </Link>
                <Link to="/admin/coupons" className="flex items-center gap-3 rounded-lg border border-subtle-border p-3 text-sm font-semibold text-ink/75 transition-colors hover:border-burgundy/25 hover:bg-[#FBF8F5] hover:text-burgundy">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><TicketPercent size={16} /></span>
                  Create a coupon
                  <ArrowRight size={14} className="ml-auto text-secondary-text" />
                </Link>
                <Link to="/admin/settings" className="flex items-center gap-3 rounded-lg border border-subtle-border p-3 text-sm font-semibold text-ink/75 transition-colors hover:border-burgundy/25 hover:bg-[#FBF8F5] hover:text-burgundy">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-sky-700"><Settings size={16} /></span>
                  Store settings
                  <ArrowRight size={14} className="ml-auto text-secondary-text" />
                </Link>
              </div>
            </section>
          </div>

          <section className="admin-card mt-4 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-subtle-border px-5 py-4">
              <div>
                <h2 className="font-playfair text-xl font-bold text-ink">Recent orders</h2>
                <p className="mt-0.5 text-xs text-secondary-text">Latest activity from your storefront</p>
              </div>
              <Link to="/admin/orders" className="text-xs font-semibold text-burgundy hover:underline">View all</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-secondary-text">No orders yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-[#FBF8F5] text-[0.68rem] uppercase tracking-[0.08em] text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Order</th>
                      <th className="px-5 py-3 font-semibold">Customer</th>
                      <th className="px-5 py-3 font-semibold">Total</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="border-t border-subtle-border/70">
                        <td className="px-5 py-3 font-mono text-xs font-semibold text-ink">
                          <Link to={`/admin/orders/${order.id}`} className="hover:text-burgundy">#{order.id.slice(0, 8)}</Link>
                        </td>
                        <td className="px-5 py-3 text-ink/75">{order.customer_name || '—'}</td>
                        <td className="px-5 py-3 font-semibold text-ink">{formatCurrency(Number(order.total_amount))}</td>
                        <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                        <td className="px-5 py-3 text-xs text-secondary-text">{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
