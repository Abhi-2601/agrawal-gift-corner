import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { session, isLoading: authLoading } = useAuth();
  const [submitted, setSubmitted] = useState(false);
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
    country: 'India',
  });

  const subtotal = items.reduce((s, item) => s + (item.product.sale_price || item.product.price) * item.quantity, 0);

  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [shippingThreshold, setShippingThreshold] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: feeData } = await supabase.from('website_settings').select('value').eq('key', 'shipping_fee').single();
        const { data: threshData } = await supabase.from('website_settings').select('value').eq('key', 'shipping_threshold').single();
        if (feeData?.value) setShippingFee(Number(feeData.value));
        if (threshData?.value) setShippingThreshold(Number(threshData.value));
      } catch {
        // Fall back gracefully to standard defaults if settings unseeded
        setShippingFee(50);
        setShippingThreshold(1000);
      }
    })();
  }, []);

  const shipping = (shippingFee !== null && shippingThreshold !== null)
    ? (subtotal >= shippingThreshold ? 0 : shippingFee)
    : (subtotal >= 1000 ? 0 : 50);

  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!session?.user) {
      setError('You must be signed in to place an order.');
      setSubmitting(false);
      return;
    }
    if (items.length === 0) {
      setError('Your shopping bag is empty.');
      setSubmitting(false);
      return;
    }

    if (!form.customerName || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      setError('Please complete all delivery fields.');
      setSubmitting(false);
      return;
    }

    const p_items = items.map(i => ({
      product_id: i.product.id,
      quantity: i.quantity,
      customization_notes: i.customization || null,
    }));

    try {
      const { data, error: rpcError } = await supabase.rpc('process_checkout', {
        p_profile_id: session.user.id,
        p_customer_name: form.customerName,
        p_customer_phone: form.phone,
        p_customer_email: form.email || session.user.email,
        p_shipping_address: form.address,
        p_shipping_city: form.city,
        p_shipping_state: form.state,
        p_shipping_pincode: form.pincode,
        p_subtotal: subtotal,
        p_shipping_fee: shipping,
        p_discount: 0,
        p_total_amount: total,
        p_items,
      });

      if (rpcError) {
        setError(rpcError.message || 'Order request could not be processed. Your bag is preserved.');
        setSubmitting(false);
        return;
      }

      if (!data) {
        setError('Order could not be created. Please verify details and retry. Your bag is preserved.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Your bag is preserved.');
      setSubmitting(false);
    }
  }, [session, items, form, subtotal, shipping, total, clearCart]);

  if (items.length === 0 && !submitted) {
    return (
      <div className="bg-ivory min-h-screen py-20">
        <div className="max-w-xl mx-auto px-4 text-center bg-warm-white rounded-3xl p-10 border border-subtle-border shadow-sm">
          <h1 className="font-playfair text-3xl text-plum font-bold mb-3">Your Bag is Empty</h1>
          <p className="text-secondary-text text-sm mb-6">Select a handcrafted gift to proceed to checkout.</p>
          <Link to="/products" className="btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-ivory min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-warm-white rounded-3xl p-8 sm:p-12 border border-subtle-border shadow-sm">
          <div className="w-16 h-16 bg-soft-blush rounded-2xl flex items-center justify-center mx-auto mb-6 text-plum">
            <Check size={32} className="text-muted-rose" />
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-plum font-bold mb-3">Order Request Received</h1>
          <p className="text-secondary-text text-base mb-6 leading-relaxed">
            Thank you for your order with <strong>Agrawal Gift Corner</strong>!
          </p>

          <div className="bg-ivory border border-subtle-border rounded-2xl p-6 text-left mb-6 space-y-3 text-xs sm:text-sm text-plum/90">
            <h2 className="font-playfair text-lg text-plum font-bold">What happens next?</h2>
            <ul className="space-y-2 list-disc list-inside text-secondary-text">
              <li>Our team directly reaches out to you on WhatsApp (<strong className="text-plum">+91 75799 51781</strong>) or phone to verify your order and customization notes.</li>
              <li>Prepaid orders only: verified payment instructions are provided upon order confirmation.</li>
              <li>Estimated delivery is 7–15 days from order confirmation.</li>
              <li>Cancellations are accepted within 24 hours of confirmation.</li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
            <Link to="/profile" className="btn-secondary">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="bg-ivory min-h-screen py-24 text-center">
        <p className="text-secondary-text text-sm">Verifying session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-ivory min-h-screen py-20">
        <div className="max-w-md mx-auto px-4 text-center bg-warm-white rounded-3xl p-10 border border-subtle-border shadow-sm">
          <h1 className="font-playfair text-3xl text-plum font-bold mb-3">Sign In to Continue</h1>
          <p className="text-secondary-text text-sm mb-6 leading-relaxed">
            Please sign in to place your order securely and track delivery.
          </p>
          <Link to="/login" className="btn-primary w-full">
            Sign In with Google
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-secondary-text hover:text-plum text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Bag
        </Link>
        <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum font-bold mb-2">
          Checkout
        </h1>
        <p className="text-secondary-text text-sm sm:text-base mb-8">
          Please provide accurate delivery details. Orders are prepaid only.
        </p>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6" noValidate>
            <div className="bg-warm-white rounded-3xl p-6 sm:p-8 shadow-sm border border-subtle-border space-y-5">
              <h2 className="font-playfair text-xl sm:text-2xl text-plum font-bold">
                Delivery Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="customerName"
                    name="customerName"
                    required
                    value={form.customerName}
                    onChange={handleChange}
                    className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                  placeholder={session.user.email || 'you@example.com'}
                />
              </div>

              <div>
                <label htmlFor="address" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                  Street Address / House No. *
                </label>
                <input
                  id="address"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                  placeholder="House/flat no, street, locality"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                    State *
                  </label>
                  <input
                    id="state"
                    name="state"
                    required
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="font-semibold text-xs sm:text-sm text-plum block mb-1.5">
                    Pincode *
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    required
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full border border-subtle-border rounded-xl px-4 py-2.5 bg-ivory text-sm text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </div>

            <div className="bg-warm-white p-5 rounded-2xl border border-subtle-border text-xs text-secondary-text flex items-start gap-3">
              <ShieldCheck size={18} className="text-champagne-gold shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-plum block">Prepaid Policy & WhatsApp Confirmation</strong>
                <p>
                  We do not offer Cash on Delivery (COD). After submitting, our team contacts you to verify customizations and provide verified payment instructions.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full btn-primary py-4 text-base ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Submitting Order Request...' : 'Submit Order Request'}
            </button>
          </form>

          {/* Bag Items & Totals */}
          <aside className="lg:col-span-5 bg-warm-white rounded-3xl p-6 sm:p-8 shadow-sm border border-subtle-border h-fit space-y-6">
            <h2 className="font-playfair text-xl sm:text-2xl text-plum font-bold">
              Items in Bag ({items.length})
            </h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-subtle-border/60">
              {items.map((i) => (
                <div key={i.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-soft-blush/30 border border-subtle-border/60">
                    <img src={i.product.image || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-plum text-sm truncate">{i.product.name}</h3>
                    <div className="text-xs text-secondary-text">
                      Qty: {i.quantity} × ₹{i.product.sale_price || i.product.price}
                    </div>
                    {i.customization && (
                      <div className="text-xs text-muted-rose mt-1 italic line-clamp-1">
                        Note: {i.customization}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-plum">
                    ₹{(i.product.sale_price || i.product.price) * i.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-subtle-border pt-4 space-y-2.5 text-sm text-secondary-text">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-plum font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-plum font-medium">
                  {shipping === 0 ? <strong className="text-emerald-700">Free</strong> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-plum border-t border-subtle-border pt-3">
                <span>Total Amount</span>
                <span className="font-playfair text-xl">₹{total}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
