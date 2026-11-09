import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Package, MapPin, LogOut, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function AccountPage() {
  const { session, user, isAdmin, signOut, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingData(true);
      try {
        const [profileRes, ordersRes, addressesRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          supabase.from("orders").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
          supabase.from("addresses").select("*").eq("profile_id", user.id).order("is_default", { ascending: false }),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (ordersRes.data) setOrders(ordersRes.data);
        if (addressesRes.data) setAddresses(addressesRes.data);
      } catch (e) {
        console.error("Error loading account data:", e);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [user]);

  if (authLoading) {
    return (
      <section className="bg-ivory min-h-screen py-16 text-center">
        <p className="text-plum/70 font-poppins">Loading account...</p>
      </section>
    );
  }

  if (!session || !user) {
    return (
      <section className="bg-ivory min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center bg-warm-white rounded-3xl p-10 border border-subtle-border shadow-xl">
          <div className="w-14 h-14 rounded-full bg-soft-blush flex items-center justify-center text-plum mx-auto mb-4">
            <User size={24} />
          </div>
          <h1 className="font-playfair text-3xl text-plum mb-3">Sign In Required</h1>
          <p className="text-secondary-text text-sm mb-6 leading-relaxed">
            Please sign in to view your profile, order history, and saved delivery addresses.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center bg-plum text-ivory px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-plum/90 transition shadow-lg shadow-plum/20 w-full"
          >
            Sign In with Google
          </Link>
        </div>
      </section>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Valued Customer";
  const displayEmail = user.email || "";

  return (
    <section className="bg-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-plum/50">My Profile</span>
            <h1 className="font-playfair text-3xl sm:text-4xl text-plum font-bold mt-1">
              Account Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 bg-champagne-gold text-plum font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-champagne-gold/90 transition shadow-md"
              >
                <Shield size={16} /> Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 bg-warm-white border border-subtle-border text-plum hover:text-red-700 font-medium px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="bg-warm-white rounded-3xl p-6 sm:p-8 shadow-xl border border-subtle-border h-fit space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-soft-blush border border-subtle-border flex items-center justify-center text-plum font-playfair text-2xl font-bold shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="font-playfair text-xl text-plum font-bold truncate">{displayName}</h2>
                <p className="text-xs text-secondary-text truncate">{displayEmail}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase bg-champagne-gold/20 text-plum border border-champagne-gold/40">
                    Administrator
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-subtle-border space-y-3 text-sm text-plum/80">
              <div className="flex justify-between">
                <span className="text-secondary-text text-xs">Phone</span>
                <span className="font-medium">{profile?.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text text-xs">Total Orders</span>
                <span className="font-bold">{orders.length}</span>
              </div>
            </div>
          </div>

          {/* Orders & Addresses Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Orders Section */}
            <div className="bg-warm-white rounded-3xl p-6 sm:p-8 shadow-xl border border-subtle-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-plum">
                  <Package size={20} className="text-champagne-gold" />
                  <h2 className="font-playfair text-2xl font-bold">My Orders</h2>
                </div>
                <span className="text-xs font-medium text-secondary-text">{orders.length} placed</span>
              </div>

              {loadingData ? (
                <p className="text-sm text-secondary-text py-4">Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 bg-ivory rounded-2xl border border-subtle-border">
                  <p className="text-secondary-text text-sm mb-3">You have not placed any orders yet.</p>
                  <Link
                    to="/products"
                    className="inline-block text-xs font-bold text-plum bg-champagne-gold px-5 py-2.5 rounded-xl hover:bg-champagne-gold/90 transition shadow-sm"
                  >
                    Explore Handcrafted Gifts
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-subtle-border/60">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="py-4 flex items-center justify-between hover:bg-soft-blush/30 px-3 rounded-2xl transition group"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-plum group-hover:text-muted-rose transition-colors text-sm">
                          Order #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-secondary-text">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • ₹{order.total_amount}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-full capitalize ${
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                        <ChevronRight size={16} className="text-plum/40 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Addresses Section */}
            <div className="bg-warm-white rounded-3xl p-6 sm:p-8 shadow-xl border border-subtle-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-plum">
                  <MapPin size={20} className="text-champagne-gold" />
                  <h2 className="font-playfair text-2xl font-bold">Saved Addresses</h2>
                </div>
              </div>

              {addresses.length === 0 ? (
                <p className="text-xs text-secondary-text">
                  Addresses used during checkout will automatically save here for future orders.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-ivory rounded-2xl p-4 border border-subtle-border text-xs text-plum/80 space-y-1">
                      <div className="font-bold text-plum flex items-center justify-between">
                        <span>{addr.label}</span>
                        {addr.is_default && (
                          <span className="text-[0.65rem] bg-soft-blush px-2 py-0.5 rounded-full text-plum">Default</span>
                        )}
                      </div>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
