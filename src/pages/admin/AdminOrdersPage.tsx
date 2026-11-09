import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Clock, IndianRupee, RefreshCw, Search, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatCard, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded'];

export default function AdminOrdersPage() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      if (loadError) throw loadError;
      setOrders(data || []);
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && order.payment_status !== paymentFilter) return false;
      if (!term) return true;
      return (
        order.id.toLowerCase().includes(term) ||
        (order.customer_name || '').toLowerCase().includes(term) ||
        (order.customer_phone || '').toLowerCase().includes(term) ||
        (order.customer_email || '').toLowerCase().includes(term)
      );
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const updateOrder = async (id: string, field: 'status' | 'payment_status', value: string) => {
    setUpdatingId(id);
    const { error: updateError } = await supabase.from('orders').update({ [field]: value }).eq('id', id);
    if (updateError) {
      toast.error(updateError.message);
    } else {
      setOrders((current) => current.map((order) => order.id === id ? { ...order, [field]: value } : order));
      toast.success('Order updated');
    }
    setUpdatingId(null);
  };

  const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const pending = orders.filter((order) => order.status === 'pending').length;

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Review new orders, update fulfilment status, and record payments."
        actions={<button type="button" onClick={() => void load()} className="btn-secondary text-xs"><RefreshCw size={14} /> Refresh</button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total orders" value={orders.length} icon={ShoppingBag} tone="burgundy" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Order value" value={formatCurrency(revenue)} icon={IndianRupee} tone="green" />
      </div>

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading orders…" />
      ) : (
        <>
          <div className="admin-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, phone…" className="admin-input pl-9" />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-input sm:w-40">
              <option value="all">All status</option>
              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
            </select>
            <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="admin-input sm:w-36">
              <option value="all">All payments</option>
              {PAYMENT_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {orders.length === 0 ? (
            <AdminEmpty icon={ShoppingBag} title="No orders yet" description="New storefront orders will appear here." />
          ) : filtered.length === 0 ? (
            <AdminEmpty title="No orders match those filters" description="Try a different search term or reset the filters." />
          ) : (
            <div className="admin-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-[#FBF8F5] text-[0.68rem] uppercase tracking-[0.08em] text-secondary-text">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Total</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Payment</th>
                      <th className="px-4 py-3 text-right font-semibold">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => (
                      <tr key={order.id} className="border-t border-subtle-border/70">
                        <td className="px-4 py-3">
                          <Link to={`/admin/orders/${order.id}`} className="font-mono text-xs font-semibold text-ink hover:text-burgundy">#{order.id.slice(0, 8)}</Link>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-ink">{order.customer_name || order.profiles?.full_name || '—'}</p>
                          <p className="mt-0.5 text-[0.68rem] text-secondary-text">{order.customer_phone || order.customer_email || ''}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-secondary-text">{formatDate(order.created_at)}</td>
                        <td className="px-4 py-3 font-semibold text-ink">{formatCurrency(Number(order.total_amount))}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status || 'pending'}
                            disabled={updatingId === order.id}
                            onChange={(event) => void updateOrder(order.id, 'status', event.target.value)}
                            className="rounded-md border border-subtle-border bg-white px-2 py-1 text-[0.68rem] font-semibold capitalize text-ink focus:border-burgundy focus:outline-none"
                          >
                            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
                          </select>
                          <div className="mt-1"><StatusBadge status={order.status} /></div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.payment_status || 'unpaid'}
                            disabled={updatingId === order.id}
                            onChange={(event) => void updateOrder(order.id, 'payment_status', event.target.value)}
                            className="rounded-md border border-subtle-border bg-white px-2 py-1 text-[0.68rem] font-semibold capitalize text-ink focus:border-burgundy focus:outline-none"
                          >
                            {PAYMENT_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                          <div className="mt-1"><StatusBadge status={order.payment_status} /></div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy hover:underline">Open <ChevronRight size={13} /></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-subtle-border px-4 py-3 text-[0.68rem] text-secondary-text">Showing {filtered.length} of {orders.length} orders</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
