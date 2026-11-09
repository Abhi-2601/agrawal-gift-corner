import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import { useCartStore } from '../hooks/useCartStore';
import { useShippingSettings } from '../hooks/useShippingSettings';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const session = useAuthStore((state) => state.session);
  const authLoading = useAuthStore((state) => state.isLoading);
  const { fee, threshold } = useShippingSettings();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const subtotal = items.reduce((sum, item) => sum + (item.product.sale_price || item.product.price) * item.quantity, 0);
  const shipping = subtotal >= threshold ? 0 : fee;
  const total = subtotal + shipping;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!session?.user) {
      setError('You must be signed in to place an order.');
      return;
    }
    if (items.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }
    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setError('Please complete all delivery fields.');
      return;
    }

    setSubmitting(true);
    try {
      const pItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        customization_notes: item.customization || null,
      }));

      const { data, error: rpcError } = await supabase.rpc('process_checkout', {
        p_profile_id: session.user.id,
        p_customer_name: form.customerName.trim(),
        p_customer_phone: form.phone.trim(),
        p_customer_email: form.email.trim() || session.user.email,
        p_shipping_address: form.address.trim(),
        p_shipping_city: form.city.trim(),
        p_shipping_state: form.state.trim(),
        p_shipping_pincode: form.pincode.trim(),
        p_subtotal: subtotal,
        p_shipping_fee: shipping,
        p_discount: 0,
        p_total_amount: total,
        p_items: pItems,
      });

      if (rpcError) {
        setError(rpcError.message || 'Order request could not be processed. Your bag is preserved.');
        return;
      }
      if (!data) {
        setError('Order could not be created. Please verify details and retry. Your bag is preserved.');
        return;
      }

      setOrderId(String(data));
      setSubmitted(true);
      clearCart();
    } catch (submitError: any) {
      setError(submitError?.message || 'An unexpected error occurred. Your bag is preserved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <Check size={30} />
          </span>
          <h1 className="mt-5 font-playfair text-3xl font-bold text-ink">Order request received</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary-text">
            Thank you for choosing Agrawal Gift Corner. Our team will contact you on WhatsApp to verify the personalization and share payment instructions.
          </p>
          {orderId && (
            <div className="mt-5 rounded-lg border border-subtle-border bg-[#FBF6F2] px-4 py-3 text-sm">
              <span className="text-secondary-text">Order reference</span>
              <p className="mt-0.5 font-mono text-xs font-semibold text-ink">#{orderId.slice(0, 8)}</p>
            </div>
          )}
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            {orderId && <Link to={`/orders/${orderId}`} className="btn-primary">View order</Link>}
            <Link to="/products" className="btn-secondary">Continue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div className="container-page py-20 text-center text-sm text-secondary-text">Checking your session…</div>;
  }

  if (!session?.user) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-burgundy">
            <LockKeyhole size={24} />
          </span>
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Sign in to continue</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary-text">Sign in securely to place your order and track delivery updates.</p>
          <Link to="/login" className="btn-primary mt-5 w-full">Sign in with Google</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <h1 className="font-playfair text-2xl font-bold text-ink">Your bag is empty</h1>
          <p className="mt-2 text-sm text-secondary-text">Add a gift before proceeding to checkout.</p>
          <Link to="/products" className="btn-primary mt-5">Explore gifts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <div className="container-page py-7 sm:py-10">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-text hover:text-burgundy">
          <ArrowLeft size={15} /> Back to bag
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Secure checkout</p>
            <h1 className="mt-1">Delivery details</h1>
          </div>
          <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-secondary-text">
            <span className="flex items-center gap-1 text-burgundy"><span className="grid h-5 w-5 place-items-center rounded-full bg-burgundy text-white">1</span> Bag</span>
            <ChevronRight size={12} />
            <span className="flex items-center gap-1 text-burgundy"><span className="grid h-5 w-5 place-items-center rounded-full bg-burgundy text-white">2</span> Details</span>
            <ChevronRight size={12} />
            <span className="flex items-center gap-1"><span className="grid h-5 w-5 place-items-center rounded-full bg-sand text-ink/60">3</span> Confirm</span>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-7 lg:grid-cols-[1fr_360px] lg:gap-9">
          <div className="space-y-5">
            <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
              <h2 className="font-playfair text-xl font-bold text-ink">Contact</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="customerName" className="label-base">Full name *</label>
                  <input id="customerName" name="customerName" required value={form.customerName} onChange={handleChange} className="input-base" placeholder="Your name" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="phone" className="label-base">WhatsApp number *</label>
                  <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className="input-base" placeholder="+91 98765 43210" autoComplete="tel" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="label-base">Email address</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input-base" placeholder={session.user.email || 'you@example.com'} autoComplete="email" />
              </div>
            </section>

            <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
              <h2 className="font-playfair text-xl font-bold text-ink">Delivery address</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="address" className="label-base">Street address *</label>
                  <input id="address" name="address" required value={form.address} onChange={handleChange} className="input-base" placeholder="House / flat number, street, locality" autoComplete="street-address" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="label-base">City *</label>
                    <input id="city" name="city" required value={form.city} onChange={handleChange} className="input-base" placeholder="City" autoComplete="address-level2" />
                  </div>
                  <div>
                    <label htmlFor="state" className="label-base">State *</label>
                    <input id="state" name="state" required value={form.state} onChange={handleChange} className="input-base" placeholder="State" autoComplete="address-level1" />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="label-base">Pincode *</label>
                    <input id="pincode" name="pincode" required value={form.pincode} onChange={handleChange} className="input-base" placeholder="281403" autoComplete="postal-code" />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex items-start gap-3 rounded-xl border border-subtle-border bg-[#FBF6F2] p-4 text-xs leading-relaxed text-secondary-text">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-burgundy" />
              <p>Prepaid orders only. After you submit this request, our team will verify the personalization and share secure payment instructions on WhatsApp. No cash on delivery.</p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.04)] sm:p-6 lg:sticky lg:top-[8.5rem]">
            <h2 className="font-playfair text-xl font-bold text-ink">Your order</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                    <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{item.product.name}</p>
                    <p className="mt-0.5 text-[0.68rem] text-secondary-text">Qty {item.quantity} × {formatCurrency(item.product.sale_price || item.product.price)}</p>
                    {item.customization && <p className="mt-0.5 line-clamp-1 text-[0.65rem] text-burgundy">Note: {item.customization}</p>}
                  </div>
                  <p className="text-xs font-semibold text-ink">{formatCurrency((item.product.sale_price || item.product.price) * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 border-t border-subtle-border pt-4 text-sm">
              <div className="flex justify-between text-secondary-text"><span>Subtotal</span><span className="font-medium text-ink">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-secondary-text">
                <span>Delivery</span>
                <span className="font-medium text-ink">{shipping === 0 ? <span className="text-emerald-700">Free</span> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-subtle-border pt-3 text-base font-bold text-ink">
                <span>Total</span>
                <span className="font-playfair text-xl text-burgundy">{formatCurrency(total)}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full py-3">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
              {submitting ? 'Submitting request…' : 'Submit order request'}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.68rem] text-secondary-text">
              <Truck size={13} /> Estimated delivery 7–15 days after confirmation
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}
