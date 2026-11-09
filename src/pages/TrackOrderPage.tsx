import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Loader2, PackageSearch, Search } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate } from '../lib/utils';

export default function TrackOrderPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    (async () => {
      const { data, error: loadError } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      if (loadError) setError(loadError.message);
      else setOrders(data || []);
      setLoadingOrders(false);
    })();
  }, [user]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const term = query.trim().toLowerCase().replace(/^#/, '');
    if (!term) {
      setError('Enter your order reference.');
      return;
    }
    const match = orders.find((order) => order.id.toLowerCase() === term || order.id.toLowerCase().startsWith(term));
    if (!match) {
      setError('No matching order was found on this account. Check the reference and try again.');
      return;
    }
    navigate(`/orders/${match.id}`);
  };

  if (isLoading) {
    return <div className="container-page py-20 text-center text-sm text-secondary-text">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-burgundy">
            <PackageSearch size={24} />
          </span>
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Track your order</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary-text">Sign in to see your orders and follow their progress.</p>
          <Link to="/login" className="btn-primary mt-5 w-full">Sign in with Google</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <div className="container-page py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="eyebrow">Order tracking</p>
            <h1 className="mt-1">Where is my gift?</h1>
            <p className="mt-2 text-sm text-secondary-text">Enter the order reference from your confirmation, or choose a recent order below.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-subtle-border bg-white p-5 shadow-sm sm:p-6">
            <label htmlFor="order-ref" className="label-base">Order reference</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
                <input id="order-ref" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. #A1B2C3D4" className="input-base pl-9" />
              </div>
              <button type="submit" className="btn-primary">Track order <ArrowRight size={15} /></button>
            </div>
            {error && <p className="mt-2 flex items-start gap-1.5 text-xs text-red-700"><AlertCircle size={13} className="mt-0.5 shrink-0" /> {error}</p>}
          </form>

          <div className="mt-6">
            <h2 className="font-playfair text-xl font-bold text-ink">Recent orders</h2>
            {loadingOrders ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-secondary-text"><Loader2 size={15} className="animate-spin" /> Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-subtle-border bg-white p-6 text-center text-sm text-secondary-text">
                No orders found. <Link to="/products" className="font-semibold text-burgundy hover:underline">Start shopping</Link>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {orders.map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-subtle-border bg-white p-4 transition-colors hover:border-burgundy/25 hover:bg-[#FBF8F5]">
                    <div>
                      <p className="text-sm font-semibold text-ink">#{order.id.slice(0, 8)}</p>
                      <p className="mt-0.5 text-[0.68rem] text-secondary-text">{formatDate(order.created_at)} · {formatCurrency(Number(order.total_amount))}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#FBF6F2] px-2.5 py-1 text-[0.65rem] font-semibold capitalize text-ink/70">{order.status}</span>
                      <ArrowRight size={14} className="text-secondary-text" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
