import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminError, AdminLoading, AdminPageHeader, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .eq('id', id)
        .maybeSingle();
      if (orderError) throw orderError;
      if (!orderData) {
        setError('Order not found.');
        return;
      }
      const { data: itemData, error: itemError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);
      if (itemError) throw itemError;
      setOrder(orderData);
      setItems(itemData || []);
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load order.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = async (field: 'status' | 'payment_status', value: string) => {
    if (!id) return;
    setUpdating(true);
    const { error: updateError } = await supabase.from('orders').update({ [field]: value }).eq('id', id);
    if (updateError) {
      toast.error(updateError.message);
    } else {
      setOrder((current: any) => ({ ...current, [field]: value }));
      toast.success('Order updated');
    }
    setUpdating(false);
  };

  if (loading) return <AdminLoading label="Loading order…" />;
  if (error || !order) return <AdminError message={error || 'Order not found.'} onRetry={() => void load()} />;

  return (
    <div>
      <Link to="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-text hover:text-burgundy">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <AdminPageHeader
        title={`Order #${order.id.slice(0, 8)}`}
        description={`Placed ${formatDate(order.created_at)} · ${order.customer_name || order.profiles?.full_name || 'Customer'}`}
        actions={<button type="button" onClick={() => void load()} className="btn-secondary text-xs"><RefreshCw size={14} /> Refresh</button>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <section className="admin-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-playfair text-lg font-bold text-ink">Items</h2>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={order.status} />
                <StatusBadge status={order.payment_status} />
              </div>
            </div>

            <div className="mt-4 divide-y divide-subtle-border">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.product_name}</p>
                    <p className="mt-0.5 text-xs text-secondary-text">Qty {item.quantity} × {formatCurrency(Number(item.price_at_time))}{item.product_sku ? ` · ${item.product_sku}` : ''}</p>
                    {item.customization_notes && (
                      <div className="mt-2 rounded-lg bg-[#FBF6F2] p-2.5 text-xs leading-relaxed text-ink/70">
                        <span className="font-semibold text-burgundy">Personalization: </span>{item.customization_notes}
                      </div>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-ink">{formatCurrency(Number(item.price_at_time) * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="ml-auto mt-4 max-w-xs space-y-2 border-t border-subtle-border pt-4 text-sm">
              <div className="flex justify-between text-secondary-text"><span>Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span></div>
              <div className="flex justify-between text-secondary-text"><span>Shipping</span><span>{Number(order.shipping_fee) === 0 ? 'Free' : formatCurrency(Number(order.shipping_fee))}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−{formatCurrency(Number(order.discount))}</span></div>}
              <div className="flex justify-between border-t border-subtle-border pt-2 text-base font-bold text-ink"><span>Total</span><span className="font-playfair text-xl text-burgundy">{formatCurrency(Number(order.total_amount))}</span></div>
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="font-playfair text-lg font-bold text-ink">Delivery details</h2>
            <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-burgundy" /><div><p className="font-semibold text-ink">{order.customer_name}</p><p className="mt-0.5 text-xs leading-relaxed text-secondary-text">{order.shipping_address}<br />{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p></div></div>
              <div className="space-y-2 text-xs text-secondary-text">
                <p className="flex items-center gap-2"><Phone size={14} className="text-burgundy" /> {order.customer_phone || '—'}</p>
                <p className="flex items-center gap-2"><Mail size={14} className="text-burgundy" /> {order.customer_email || '—'}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="admin-card p-5">
            <h2 className="font-playfair text-lg font-bold text-ink">Update order</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="order-status" className="admin-label">Fulfilment status</label>
                <select id="order-status" value={order.status || 'pending'} disabled={updating} onChange={(event) => void update('status', event.target.value)} className="admin-input capitalize">
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="payment-status" className="admin-label">Payment status</label>
                <select id="payment-status" value={order.payment_status || 'unpaid'} disabled={updating} onChange={(event) => void update('payment_status', event.target.value)} className="admin-input capitalize">
                  {PAYMENT_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <p className="text-[0.68rem] leading-relaxed text-secondary-text">Changes are saved directly to Supabase. The customer sees the updated status in their account.</p>
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="font-playfair text-lg font-bold text-ink">Customer</h2>
            <p className="mt-2 text-sm font-semibold text-ink">{order.customer_name || order.profiles?.full_name || '—'}</p>
            <p className="mt-1 text-xs text-secondary-text">{order.customer_phone || 'No phone'}</p>
            <p className="text-xs text-secondary-text">{order.customer_email || 'No email'}</p>
            <Link to={`/admin/orders?q=${encodeURIComponent(order.customer_phone || order.customer_email || '')}`} className="mt-3 inline-flex text-xs font-semibold text-burgundy hover:underline">Find other orders</Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
