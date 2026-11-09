import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Shield,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate } from '../lib/utils';

type Tab = 'overview' | 'orders' | 'addresses' | 'wishlist';

const TABS: Array<{ id: Tab; label: string; icon: typeof User }> = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
];

export default function AccountPage() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signOut = useAuthStore((state) => state.signOut);
  const { ids: wishlistIds } = useWishlist(user?.id);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoadingData(true);
    (async () => {
      try {
        const [profileResult, ordersResult, addressesResult] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
          supabase.from('orders').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }),
          supabase.from('addresses').select('*').eq('profile_id', user.id).order('is_default', { ascending: false }),
        ]);
        if (!active) return;
        if (profileResult.data) {
          setProfile(profileResult.data);
          setName(profileResult.data.full_name || '');
          setPhone(profileResult.data.phone || '');
        }
        setOrders(ordersResult.data || []);
        setAddresses(addressesResult.data || []);
      } catch (loadError: any) {
        if (active) setError(loadError?.message || 'Could not load account details.');
      } finally {
        if (active) setLoadingData(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (isLoading) {
    return <div className="container-page py-20 text-center text-sm text-secondary-text">Loading your account…</div>;
  }

  if (!session || !user) {
    return (
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-burgundy">
            <User size={24} />
          </span>
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Sign in required</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary-text">Sign in to view your profile, orders, saved addresses, and wishlist.</p>
          <Link to="/login" className="btn-primary mt-5 w-full">Sign in with Google</Link>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Valued customer';
  const displayEmail = user.email || '';

  const saveProfile = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() || null, phone: phone.trim() || null })
        .eq('id', user.id);
      if (updateError) throw updateError;
      setProfile((current: any) => ({ ...current, full_name: name.trim() || null, phone: phone.trim() || null }));
      setEditing(false);
      setMessage('Profile updated.');
    } catch (updateError: any) {
      setError(updateError?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-ivory">
      <div className="container-page py-7 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">My account</p>
            <h1 className="mt-1">Welcome back, {displayName.split(' ')[0]}</h1>
            <p className="mt-1 text-sm text-secondary-text">{displayEmail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Link to="/admin" className="btn-secondary text-xs"><Shield size={15} /> Admin dashboard</Link>
            )}
            <button type="button" onClick={() => void signOut()} className="btn-secondary text-xs"><LogOut size={15} /> Sign out</button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
          <aside className="h-fit rounded-2xl border border-subtle-border bg-white p-4 shadow-[0_1px_2px_rgba(43,26,23,0.03)]">
            <div className="flex items-center gap-3 border-b border-subtle-border pb-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-burgundy font-playfair text-xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                <p className="truncate text-[0.68rem] text-secondary-text">{displayEmail}</p>
              </div>
            </div>
            <nav className="mt-3 space-y-1" aria-label="Account sections">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    activeTab === id ? 'bg-burgundy text-white' : 'text-ink/70 hover:bg-blush/60 hover:text-burgundy'
                  }`}
                >
                  <Icon size={16} /> {label}
                  {id === 'wishlist' && wishlistIds.length > 0 && (
                    <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[0.6rem] ${activeTab === id ? 'bg-white/20' : 'bg-blush text-burgundy'}`}>{wishlistIds.length}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <main className="min-w-0">
            {loadingData ? (
              <div className="rounded-2xl border border-subtle-border bg-white p-8 text-center text-sm text-secondary-text">Loading your details…</div>
            ) : activeTab === 'overview' ? (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-subtle-border bg-white p-4"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-secondary-text">Orders</p><p className="mt-1 font-playfair text-2xl font-bold text-ink">{orders.length}</p></div>
                  <div className="rounded-xl border border-subtle-border bg-white p-4"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-secondary-text">Wishlist</p><p className="mt-1 font-playfair text-2xl font-bold text-ink">{wishlistIds.length}</p></div>
                  <div className="rounded-xl border border-subtle-border bg-white p-4"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-secondary-text">Addresses</p><p className="mt-1 font-playfair text-2xl font-bold text-ink">{addresses.length}</p></div>
                </div>

                <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-playfair text-xl font-bold text-ink">Profile details</h2>
                    {!editing && <button type="button" onClick={() => setEditing(true)} className="btn-secondary px-3 py-2 text-xs"><Pencil size={14} /> Edit</button>}
                  </div>
                  {editing ? (
                    <div className="mt-4 space-y-4">
                      <div><label htmlFor="account-name" className="label-base">Full name</label><input id="account-name" value={name} onChange={(event) => setName(event.target.value)} className="input-base" /></div>
                      <div><label htmlFor="account-phone" className="label-base">Phone / WhatsApp</label><input id="account-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="input-base" placeholder="+91 98765 43210" /></div>
                      {error && <p className="text-xs text-red-700">{error}</p>}
                      <div className="flex gap-2">
                        <button type="button" onClick={() => void saveProfile()} disabled={saving} className="btn-primary">{saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}{saving ? 'Saving…' : 'Save changes'}</button>
                        <button type="button" onClick={() => { setEditing(false); setError(''); }} className="btn-secondary">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                      <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-secondary-text">Name</p><p className="mt-1 font-medium text-ink">{displayName}</p></div>
                      <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-secondary-text">Email</p><p className="mt-1 font-medium text-ink">{displayEmail}</p></div>
                      <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-secondary-text">Phone</p><p className="mt-1 font-medium text-ink">{profile?.phone || 'Not set'}</p></div>
                      <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-secondary-text">Member since</p><p className="mt-1 font-medium text-ink">{profile?.created_at ? formatDate(profile.created_at) : '—'}</p></div>
                    </div>
                  )}
                  {message && <p className="mt-3 text-xs text-emerald-700">{message}</p>}
                </section>

                <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-playfair text-xl font-bold text-ink">Recent orders</h2>
                    <button type="button" onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-burgundy hover:underline">View all</button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="mt-4 rounded-lg border border-dashed border-subtle-border p-6 text-center">
                      <p className="text-sm text-secondary-text">No orders yet.</p>
                      <Link to="/products" className="btn-primary mt-3 text-xs"><ShoppingBag size={14} /> Start shopping</Link>
                    </div>
                  ) : (
                    <div className="mt-3 divide-y divide-subtle-border">
                      {orders.slice(0, 3).map((order) => (
                        <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-burgundy">
                          <div>
                            <p className="font-semibold text-ink">#{order.id.slice(0, 8)}</p>
                            <p className="mt-0.5 text-[0.68rem] text-secondary-text">{formatDate(order.created_at)} · {formatCurrency(Number(order.total_amount))}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#FBF6F2] px-2 py-1 text-[0.65rem] font-semibold capitalize text-ink/70">{order.status}</span>
                            <ChevronRight size={14} className="text-secondary-text" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            ) : activeTab === 'orders' ? (
              <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
                <h2 className="font-playfair text-xl font-bold text-ink">My orders</h2>
                {orders.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-subtle-border p-8 text-center">
                    <Package size={28} className="mx-auto text-burgundy/60" />
                    <p className="mt-2 text-sm text-secondary-text">You have not placed an order yet.</p>
                    <Link to="/products" className="btn-primary mt-4 text-xs">Explore gifts</Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {orders.map((order) => (
                      <Link key={order.id} to={`/orders/${order.id}`} className="block rounded-xl border border-subtle-border p-4 transition-colors hover:border-burgundy/25 hover:bg-[#FBF8F5]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-ink">Order #{order.id.slice(0, 8)}</p>
                            <p className="mt-0.5 text-[0.68rem] text-secondary-text">Placed {formatDate(order.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-ink">{formatCurrency(Number(order.total_amount))}</span>
                            <span className="rounded-full bg-[#FBF6F2] px-2.5 py-1 text-[0.65rem] font-semibold capitalize text-ink/70">{order.status}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ) : activeTab === 'addresses' ? (
              <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
                <h2 className="font-playfair text-xl font-bold text-ink">Saved addresses</h2>
                {addresses.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-subtle-border p-8 text-center">
                    <MapPin size={28} className="mx-auto text-burgundy/60" />
                    <p className="mt-2 text-sm text-secondary-text">Addresses used during checkout will appear here.</p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {addresses.map((address) => (
                      <div key={address.id} className="rounded-xl border border-subtle-border p-4 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-ink">{address.label || 'Delivery address'}</p>
                          {address.is_default && <span className="rounded-full bg-blush px-2 py-0.5 text-[0.6rem] font-bold text-burgundy">Default</span>}
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-secondary-text">{address.street}</p>
                        <p className="text-xs text-secondary-text">{address.city}, {address.state} — {address.pincode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-playfair text-xl font-bold text-ink">Wishlist</h2>
                  <Link to="/wishlist" className="btn-secondary text-xs">Open wishlist <ChevronRight size={14} /></Link>
                </div>
                <div className="mt-4 rounded-xl border border-dashed border-subtle-border p-8 text-center">
                  <Heart size={28} className="mx-auto text-burgundy/60" />
                  <p className="mt-2 text-sm text-secondary-text">
                    {wishlistIds.length > 0 ? `${wishlistIds.length} saved ${wishlistIds.length === 1 ? 'gift' : 'gifts'}.` : 'Save gifts you love and find them here later.'}
                  </p>
                  <Link to="/wishlist" className="btn-primary mt-4 text-xs">View saved gifts</Link>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
