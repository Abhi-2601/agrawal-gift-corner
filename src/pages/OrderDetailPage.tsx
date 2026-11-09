import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate } from '../lib/utils';

const STEPS = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (orderError) throw orderError;
        if (!orderData) {
          if (active) setError('Order not found or access denied.');
          return;
        }
        const { data: itemData, error: itemError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);
        if (itemError) throw itemError;
        if (!active) return;
        setOrder(orderData);
        setItems(itemData || []);
      } catch (loadError: any) {
        if (active) setError(loadError?.message || 'Could not load order details.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="container-page py-20 text-center text-sm text-secondary-text">Loading order details…</div>;
  }

  if (error || !order) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <XCircle size={32} className="mx-auto text-burgundy" />
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Order not found</h1>
          <p className="mt-2 text-sm text-secondary-text">{error || 'We could not find this order.'}</p>
          <Link to="/profile" className="btn-primary mt-5">Back to my orders</Link>
        </div>
      </div>
    );
  }

  const currentStep = STEPS.indexOf(order.status);
  const cancelled = order.status === 'cancelled';

  return (
    <div className="bg-ivory">
      <div className="container-page py-7 sm:py-10">
        <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-text hover:text-burgundy">
          <ArrowLeft size={15} /> Back to my orders
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Order reference</p>
            <h1 className="mt-1">#{order.id.slice(0, 8)}</h1>
            <p className="mt-1 text-sm text-secondary-text">Placed {formatDate(order.created_at)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-bold capitalize text-ink/70 ring-1 ring-subtle-border">{order.status?.replace(/_/g, ' ')}</span>
            <span className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold capitalize ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{order.payment_status || 'unpaid'}</span>
          </div>
        </div>

        {cancelled ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <XCircle size={18} className="mt-0.5 shrink-0" />
            <p>This order was cancelled. If you need help, contact us on WhatsApp with your order reference.</p>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-subtle-border bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-1">
              {STEPS.map((step, index) => {
                const done = index <= currentStep;
                return (
                  <div key={step} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`grid h-8 w-8 place-items-center rounded-full ${done ? 'bg-burgundy text-white' : 'bg-sand text-secondary-text'}`}>
                        {index === 0 ? <Package size={15} /> : index === 3 ? <Truck size={15} /> : index === 4 ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                      </span>
                      <span className={`hidden text-[0.62rem] font-semibold capitalize sm:block ${done ? 'text-burgundy' : 'text-secondary-text'}`}>{step.replace(/_/g, ' ')}</span>
                    </div>
                    {index < STEPS.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${index < currentStep ? 'bg-burgundy' : 'bg-sand'}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
              <h2 className="font-playfair text-xl font-bold text-ink">Items ordered</h2>
              <div className="mt-4 divide-y divide-subtle-border">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.product_name}</p>
                      <p className="mt-1 text-xs text-secondary-text">Qty {item.quantity} × {formatCurrency(Number(item.price_at_time))}</p>
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
            </section>

            <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
              <h2 className="font-playfair text-xl font-bold text-ink">Delivery address</h2>
              <div className="mt-3 flex items-start gap-3 text-sm text-secondary-text">
                <MapPin size={17} className="mt-0.5 shrink-0 text-burgundy" />
                <div>
                  <p className="font-semibold text-ink">{order.customer_name}</p>
                  <p className="mt-0.5">{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
                  <p className="mt-1 text-xs">{order.customer_phone}{order.customer_email ? ` · ${order.customer_email}` : ''}</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)]">
              <h2 className="font-playfair text-lg font-bold text-ink">Order summary</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-secondary-text"><span>Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span></div>
                <div className="flex justify-between text-secondary-text"><span>Delivery</span><span>{Number(order.shipping_fee) === 0 ? 'Free' : formatCurrency(Number(order.shipping_fee))}</span></div>
                {Number(order.discount) > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−{formatCurrency(Number(order.discount))}</span></div>}
                <div className="flex justify-between border-t border-subtle-border pt-3 text-base font-bold text-ink"><span>Total</span><span className="font-playfair text-xl text-burgundy">{formatCurrency(Number(order.total_amount))}</span></div>
              </div>
            </section>

            <section className="rounded-2xl border border-subtle-border bg-[#FBF6F2] p-5">
              <h2 className="font-playfair text-lg font-bold text-ink">Need help?</h2>
              <p className="mt-1 text-xs leading-relaxed text-secondary-text">Questions about your order or personalization? Message our team on WhatsApp.</p>
              <a
                href={`https://wa.me/917579951781?text=${encodeURIComponent(`Hi Agrawal Gift Corner, I have a question about order #${order.id.slice(0, 8)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 w-full text-xs"
              >
                <MessageCircle size={15} /> WhatsApp support
              </a>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
