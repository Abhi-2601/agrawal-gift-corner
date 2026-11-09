import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getTotalItems } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="bg-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum font-bold mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-secondary-text text-sm sm:text-base mb-8">
          Review your handcrafted items and personalizations before proceeding.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-warm-white rounded-3xl border border-subtle-border p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-soft-blush flex items-center justify-center text-plum mx-auto mb-4">
              <ShoppingBag size={28} className="text-muted-rose" />
            </div>
            <h2 className="font-playfair text-2xl text-plum font-bold mb-2">Your Bag is Empty</h2>
            <p className="text-secondary-text text-sm mb-6 leading-relaxed">
              Explore our collection of curated hampers, gift boxes, and customizable keepsakes.
            </p>
            <Link to="/products" className="btn-primary gap-2">
              Browse Collection <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-warm-white rounded-3xl p-5 sm:p-6 shadow-sm border border-subtle-border flex flex-col sm:flex-row gap-5 items-start"
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-soft-blush/30 border border-subtle-border/60"
                  >
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <h3 className="font-playfair text-lg sm:text-xl text-plum font-bold hover:text-muted-rose transition-colors leading-snug">
                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                      </h3>
                      <div className="font-playfair font-bold text-lg text-plum sm:text-right shrink-0">
                        ₹{(item.product.sale_price || item.product.price) * item.quantity}
                      </div>
                    </div>

                    <div className="text-xs text-secondary-text">
                      Unit Price: ₹{item.product.sale_price || item.product.price}
                      {item.product.sku && ` • SKU: ${item.product.sku}`}
                    </div>

                    {item.customization && (
                      <div className="text-xs bg-ivory border border-subtle-border rounded-xl p-3 text-plum leading-relaxed">
                        <strong className="text-muted-rose block mb-0.5 font-semibold">Customization Note:</strong>
                        {item.customization}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-subtle-border rounded-xl bg-ivory overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 hover:bg-soft-blush text-plum font-bold transition text-sm"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 font-semibold text-plum text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 hover:bg-soft-blush text-plum font-bold transition text-sm"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium inline-flex items-center gap-1 transition"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4 bg-warm-white rounded-3xl p-6 sm:p-8 shadow-sm border border-subtle-border h-fit space-y-6">
              <h2 className="font-playfair text-2xl text-plum font-bold">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-secondary-text">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="text-plum font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-plum font-medium">
                    {shipping === 0 ? <strong className="text-emerald-700">Free</strong> : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-subtle-border pt-3 flex justify-between text-lg font-bold text-plum">
                  <span>Estimated Total</span>
                  <span className="font-playfair text-xl">₹{total}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full btn-primary py-3.5 text-center text-sm shadow-sm"
              >
                Proceed to Checkout
              </Link>

              <div className="p-3.5 bg-ivory rounded-2xl border border-subtle-border text-xs text-secondary-text space-y-1.5">
                <div className="flex items-center gap-1.5 text-plum font-semibold">
                  <ShieldCheck size={15} className="text-champagne-gold" />
                  Prepaid Orders Only
                </div>
                <p className="leading-relaxed">
                  Our team contacts you to verify customization and payment instructions before processing. No Cash on Delivery.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
