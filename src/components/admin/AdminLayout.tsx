import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Gift,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  TicketPercent,
  Users,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Banners', to: '/admin/banners', icon: Image },
  { label: 'Coupons', to: '/admin/coupons', icon: TicketPercent },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, isAdmin, isLoading, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ivory">
        <div className="flex items-center gap-3 text-sm text-secondary-text">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-burgundy/20 border-t-burgundy" />
          Checking admin access…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-ivory px-4">
        <div className="w-full max-w-md rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-burgundy">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Admin access required</h1>
          <p className="mt-2 text-sm text-secondary-text">
            This account is not on the admin allowlist. If you believe this is a mistake, ask the store owner to verify your admin email in Supabase.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-secondary">Back to store</Link>
            <button type="button" onClick={() => void signOut()} className="btn-primary">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/admin/products?q=${encodeURIComponent(term)}` : '/admin/products');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-subtle-border px-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-burgundy text-white">
          <Gift size={18} />
        </span>
        <div className="leading-none">
          <p className="font-brand text-[0.95rem] font-semibold tracking-[0.12em] text-burgundy">AGRAWAL</p>
          <p className="mt-1 font-brand text-[0.48rem] tracking-[0.24em] text-secondary-text">GIFT CORNER</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-ink/60 hover:bg-blush lg:hidden"
          aria-label="Close admin menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'text-ink/70 hover:bg-blush/60 hover:text-burgundy'
              }`
            }
          >
            <Icon size={17} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-subtle-border p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-blush/60 hover:text-burgundy"
        >
          <Store size={17} aria-hidden /> View storefront
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EF]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-subtle-border bg-white lg:block">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative h-full w-[280px] max-w-[85vw] bg-white shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-subtle-border bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-subtle-border text-ink/70 lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu size={19} />
            </button>

            <form onSubmit={handleSearch} className="relative hidden w-full max-w-md sm:block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products in admin…"
                className="h-10 w-full rounded-lg border border-subtle-border bg-[#FBF8F5] pl-9 pr-3 text-sm text-ink placeholder:text-secondary-text/60 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/10"
              />
            </form>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link to="/" className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-ink/60 hover:bg-blush/60 hover:text-burgundy sm:block">
                View store
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-subtle-border bg-white py-1 pl-1 pr-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-burgundy text-sm font-bold text-white">{initials}</span>
                <span className="hidden max-w-[9rem] truncate text-xs font-semibold text-ink sm:block">{displayName}</span>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-700"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
