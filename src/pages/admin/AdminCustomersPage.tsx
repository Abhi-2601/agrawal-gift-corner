import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Search, UserRound, Users } from 'lucide-react';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatCard } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';

interface CustomerRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResult, orderResult] = await Promise.all([
        supabase.from('profiles').select('id, full_name, phone, created_at').order('created_at', { ascending: false }),
        supabase.from('orders').select('profile_id, total_amount'),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (orderResult.error) throw orderResult.error;

      const stats = new Map<string, { count: number; total: number }>();
      (orderResult.data || []).forEach((order) => {
        if (!order.profile_id) return;
        const current = stats.get(order.profile_id) || { count: 0, total: 0 };
        stats.set(order.profile_id, {
          count: current.count + 1,
          total: current.total + Number(order.total_amount || 0),
        });
      });

      setCustomers((profileResult.data || []).map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        created_at: profile.created_at,
        orderCount: stats.get(profile.id)?.count || 0,
        totalSpent: stats.get(profile.id)?.total || 0,
      })));
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((customer) =>
      (customer.full_name || '').toLowerCase().includes(term) ||
      (customer.phone || '').toLowerCase().includes(term) ||
      customer.id.toLowerCase().includes(term)
    );
  }, [customers, search]);

  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const repeatCustomers = customers.filter((customer) => customer.orderCount > 1).length;

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Registered customer profiles and their order history."
        actions={<button type="button" onClick={() => void load()} className="btn-secondary text-xs"><RefreshCw size={14} /> Refresh</button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Customers" value={customers.length} icon={Users} tone="burgundy" />
        <StatCard label="Repeat customers" value={repeatCustomers} icon={UserRound} tone="green" />
        <StatCard label="Lifetime value" value={formatCurrency(totalSpent)} icon={Users} tone="amber" />
      </div>

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading customers…" />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="border-b border-subtle-border p-4">
            <div className="relative max-w-md">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, phone, or ID…" className="admin-input pl-9" />
            </div>
          </div>

          {customers.length === 0 ? (
            <AdminEmpty icon={Users} title="No customers yet" description="Customer profiles appear here after sign-in." />
          ) : filtered.length === 0 ? (
            <AdminEmpty title="No customers match that search" description="Try a different name or phone number." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#FBF8F5] text-[0.68rem] uppercase tracking-[0.08em] text-secondary-text">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Orders</th>
                    <th className="px-4 py-3 font-semibold">Total spent</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 text-right font-semibold">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="border-t border-subtle-border/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FBEAEC] text-xs font-bold text-burgundy">
                            {(customer.full_name || 'C').charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-ink">{customer.full_name || 'Customer'}</p>
                            <p className="mt-0.5 font-mono text-[0.65rem] text-secondary-text">{customer.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink/70">{customer.phone || '—'}</td>
                      <td className="px-4 py-3 text-xs text-ink/70">{customer.orderCount}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{formatCurrency(customer.totalSpent)}</td>
                      <td className="px-4 py-3 text-xs text-secondary-text">{formatDate(customer.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/admin/orders?q=${encodeURIComponent(customer.phone || customer.full_name || customer.id)}`} className="text-xs font-semibold text-burgundy hover:underline">View orders</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
