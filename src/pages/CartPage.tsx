import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useShippingSettings } from '../hooks/useShippingSettings';
import { formatCurrency } from '../lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getTotalItems } = useCartStore();
  const { fee, threshold } = useShippingSettings();
  const subtotal = getSubtotal();
  const shipping = subtotal >= threshold ? 0 : fee;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, threshold - subtotal);
  const progress = threshold > 0 ? Math.min(100, (subtotal / threshold) * 100) : 100;

  if (items.length === 0) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-burgundy">
            <ShoppingBag size={28} />
          </span>
          <h1 className="mt-5 font-playfair text-3xl font-bold text-ink">Your bag is empty</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary-text">
            Start with a handcrafted hamper, a fresh bouquet, or a personalized keepsake.
          </p>
          <Link to="/products" className="btn-primary mt-6">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <div className="container-page py-7 sm:py-10">
        <nav className="flex items-center gap-1.5 text-[0.7rem] font-medium text-secondary-text" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-burgundy">Home</Link>
          <ChevronRight size={12} />
          <span className="text-ink">Shopping bag</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Almost there</p>
            <h1 className="mt-1">Your shopping bag</h1>
          </div>
          <p className="text-sm text-secondary-text">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_340px] lg:gap-9">
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-subtle-border bg-white p-4 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-5">
                <div className="flex gap-4">
                  <Link to={`/product/${item.product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:h-28 sm:w-28">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-playfair text-lg font-bold leading-snug text-ink sm:text-xl">
                          <Link to={`/product/${item.product.id}`} className="hover:text-burgundy">{item.product.name}</Link>
                        </h2>
                        <p className="mt-1 text-xs text-secondary-text">
                          {formatCurrency(item.product.sale_price || item.product.price)} each
                          {item.product.sku ? ` · ${item.product.sku}` : ''}
                        </p>
                      </div>
                      <p className="shrink-0 font-playfair text-lg font-bold text-burgundy">
                        {formatCurrency((item.product.sale_price || item.product.price) * item.quantity)}
                      </p>
                    </div>

                    {item.customization && (
                      <div className="mt-3 rounded-lg border border-subtle-border bg-[#FBF8F5] p-2.5 text-xs leading-relaxed text-ink/70">
                        <span className="font-semibold text-burgundy">Personalization: </span>{item.customization}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex h-9 items-center rounded-lg border border-subtle-border bg-white">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-9 w-9 place-items-center text-ink hover:bg-blush/60" aria-label="Decrease quantity">
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-ink">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-9 w-9 place-items-center text-ink hover:bg-blush/60" aria-label="Increase quantity">
                          <Plus size={13} />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text transition-colors hover:text-red-700">
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <Link to="/products" className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-secondary-text hover:text-burgundy">
              <ArrowRight size={15} className="rotate-180" /> Continue shopping
            </Link>
          </div>

          <aside className="h-fit rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.04)] sm:p-6 lg:sticky lg:top-[8.5rem]">
            <h2 className="font-playfair text-xl font-bold text-ink">Order summary</h2>

            <div className="mt-4 rounded-lg bg-[#FBF6F2] p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                <Truck size={15} className="text-burgundy" />
                {remainingForFreeShipping > 0 ? `Add ${formatCurrency(remainingForFreeShipping)} for free delivery` : 'Free delivery unlocked'}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-burgundy/10">
                <div className="h-full rounded-full bg-burgundy transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-sm">
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

            <Link to="/checkout" className="btn-primary mt-5 w-full py-3">
              Proceed to checkout <ArrowRight size={16} />
            </Link>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-subtle-border p-3 text-[0.7rem] leading-relaxed text-secondary-text">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-burgundy" />
              <p>Prepaid orders only. Our team confirms personalization and shares secure payment instructions on WhatsApp.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
