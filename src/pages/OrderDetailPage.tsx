import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, AlertCircle, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: orderData, error: orderErr } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (orderErr) throw orderErr;
        if (!orderData) {
          setError("Order not found or access denied.");
          return;
        }

        setOrder(orderData);

        const { data: itemsData, error: itemsErr } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", id);

        if (itemsErr) throw itemsErr;
        setItems(itemsData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <section className="bg-ivory min-h-screen py-16 text-center">
        <p className="text-plum/70 font-poppins">Loading order details...</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="bg-ivory min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-warm-white rounded-3xl p-10 border border-subtle-border shadow-xl">
          <AlertCircle size={40} className="mx-auto text-muted-rose mb-4" />
          <h1 className="font-playfair text-3xl text-plum mb-3">Order Not Found</h1>
          <p className="text-secondary-text mb-6">{error || "We could not find the requested order."}</p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-plum text-ivory px-6 py-3 rounded-full text-sm font-medium hover:bg-plum/90 transition shadow-md"
          >
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-plum/60 hover:text-plum text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* Order Header */}
        <div className="bg-warm-white rounded-3xl p-8 sm:p-10 shadow-xl border border-subtle-border mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle-border/60 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-plum/50">Order Reference</span>
              <h1 className="font-playfair text-3xl sm:text-4xl text-plum font-bold mt-1">
                #{order.id.slice(0, 8)}
              </h1>
              <p className="text-secondary-text text-xs mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${
                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                Status: {order.status}
              </span>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Payment: {order.payment_status}
              </span>
            </div>
          </div>

          {/* Status Tracker & Delivery Notice */}
          <div className="bg-soft-blush/60 rounded-2xl p-5 border border-subtle-border mb-8 space-y-2">
            <div className="flex items-center gap-2 text-plum font-medium text-sm">
              <Clock size={16} className="text-muted-rose" />
              <span>Estimated Delivery: 7 to 15 days from order confirmation</span>
            </div>
            <p className="text-xs text-plum/70 leading-relaxed">
              Agrawal Gift Corner orders are prepaid only. Our team contacts you directly to confirm customization details and provide verified payment instructions.
            </p>
          </div>

          {/* Ordered Items List with Customization Notes */}
          <h2 className="font-playfair text-2xl text-plum mb-4">Items Ordered</h2>
          <div className="divide-y divide-subtle-border/60 mb-6">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-playfair text-lg text-plum font-bold">{item.product_name}</h3>
                  <div className="text-xs text-secondary-text">
                    Quantity: {item.quantity} × ₹{item.price_at_time}
                  </div>
                  {item.customization_notes ? (
                    <div className="mt-2 text-xs bg-warm-white border border-subtle-border rounded-xl p-3 text-plum max-w-lg">
                      <strong className="text-muted-rose font-semibold block mb-0.5">Customization Notes:</strong>
                      {item.customization_notes}
                    </div>
                  ) : (
                    <div className="text-xs text-secondary-text/60 italic">No customization notes provided</div>
                  )}
                </div>
                <div className="font-playfair font-bold text-lg text-plum sm:text-right shrink-0">
                  ₹{Number(item.price_at_time) * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-subtle-border pt-6 space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-secondary-text">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Shipping Fee</span>
              <span>{Number(order.shipping_fee) === 0 ? "Free" : `₹${order.shipping_fee}`}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-playfair font-bold text-xl text-plum pt-2 border-t border-subtle-border">
              <span>Total Amount</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Contact Support */}
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-warm-white rounded-3xl p-6 sm:p-8 shadow-xl border border-subtle-border space-y-3">
            <h2 className="font-playfair text-xl text-plum">Delivery Destination</h2>
            <div className="text-sm space-y-1 text-plum/80">
              <p className="font-bold text-plum">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
              <p className="text-xs text-secondary-text pt-1">Phone: {order.customer_phone}</p>
              <p className="text-xs text-secondary-text">Email: {order.customer_email}</p>
            </div>
          </div>

          <div className="bg-warm-white rounded-3xl p-6 sm:p-8 shadow-xl border border-subtle-border space-y-4">
            <h2 className="font-playfair text-xl text-plum">Need Assistance?</h2>
            <p className="text-sm text-secondary-text leading-relaxed">
              Have a question about your order #{order.id.slice(0, 8)} or wish to modify customization within 24 hours?
            </p>
            <a
              href={`https://wa.me/917579951781?text=${encodeURIComponent(`Hi Agrawal Gift Corner, I have a query regarding my order #${order.id.slice(0, 8)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-2xl text-sm font-medium hover:bg-[#1EBE5D] transition shadow-md w-full justify-center"
            >
              <MessageCircle size={18} /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
