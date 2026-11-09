import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuth';
import { useCartStore } from '../../hooks/useCartStore';
import { useWishlist } from '../../hooks/useWishlist';
import { NAV_ITEMS } from '../../lib/homeData';
import type { NavItem } from '../../lib/homeData';
import BrandLogo from './BrandLogo';

const navText = 'text-[0.8rem] font-semibold tracking-[0.01em]';

function isCurrent(item: NavItem, pathname: string, search: string) {
  const here = pathname + search;
  if (item.to) return item.to === '/' ? pathname === '/' : here === item.to;
  return Boolean(item.children?.some((child) => child.to === here));
}

function SearchForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  className?: string;
}) {
  const inputId = useId();
  return (
    <form role="search" onSubmit={onSubmit} className={`flex h-10 overflow-hidden rounded-lg border border-subtle-border bg-[#FBF8F5] focus-within:border-burgundy focus-within:ring-2 focus-within:ring-burgundy/10 ${className}`}>
      <label htmlFor={inputId} className="sr-only">Search gifts, hampers, flowers and personalized items</label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-3.5 text-[0.8rem] text-ink placeholder:text-secondary-text/60 focus:outline-none"
      />
      <button type="submit" aria-label="Search" className="grid w-11 shrink-0 place-items-center bg-burgundy text-white transition-colors hover:bg-burgundy-dark">
        <Search size={17} aria-hidden />
      </button>
    </form>
  );
}

function DesktopNavItem({ item, pathname, search }: { item: NavItem; pathname: string; search: string }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const current = isCurrent(item, pathname, search);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!itemRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!item.children) {
    return (
      <li>
        <Link
          to={item.to ?? '/'}
          aria-current={current ? 'page' : undefined}
          className={`${navText} inline-flex h-9 items-center rounded-md px-3 transition-colors ${
            current ? 'bg-blush/70 text-burgundy' : 'text-ink/75 hover:text-burgundy'
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={itemRef}
      className="relative"
      onPointerEnter={(event) => event.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={`${navText} inline-flex h-9 items-center gap-1 rounded-md px-3 transition-colors ${
          current || open ? 'text-burgundy' : 'text-ink/75 hover:text-burgundy'
        }`}
      >
        {item.label}
        <ChevronDown size={13} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={menuId} className="absolute left-0 top-full z-50 pt-2">
          <ul className="min-w-[13rem] rounded-xl border border-subtle-border bg-white p-1.5 shadow-[0_14px_36px_rgba(57,38,51,0.12)]">
            {item.children.map((child) => (
              <li key={child.label}>
                <Link
                  to={child.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-[0.8rem] font-medium text-ink/80 transition-colors hover:bg-blush/60 hover:text-burgundy"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rowClass = 'flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold text-ink/80 transition-colors hover:bg-blush/60 hover:text-burgundy';

  if (!item.children) {
    return (
      <li>
        <Link to={item.to ?? '/'} onClick={onNavigate} className={rowClass}>{item.label}</Link>
      </li>
    );
  }

  return (
    <li>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={rowClass}>
        {item.label}
        <ChevronDown size={17} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul id={panelId} className="mb-1 ml-3 border-l border-subtle-border pl-2">
          {item.children.map((child) => (
            <li key={child.label}>
              <Link to={child.to} onClick={onNavigate} className="flex min-h-10 items-center rounded-lg px-3 text-[0.82rem] font-medium text-ink/70 hover:bg-blush/60 hover:text-burgundy">
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const accountRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const signOut = useAuthStore((state) => state.signOut);
  const { ids: wishlistIds } = useWishlist(user?.id);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [accountOpen]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setMobileOpen(false);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const closeMobile = () => setMobileOpen(false);
  const iconLink = 'group relative grid h-10 w-10 place-items-center rounded-lg text-ink/70 transition-colors hover:bg-blush/60 hover:text-burgundy';
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="sticky top-0 z-50 border-b border-subtle-border bg-[#FFFCF8]/95 backdrop-blur">
      <div className="container-page">
        <div className="flex h-[68px] items-center gap-2 sm:gap-4 lg:gap-6">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="-ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink/70 hover:bg-blush/60 lg:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <BrandLogo />

          <SearchForm
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search for gifts, hampers, flowers…"
            className="mx-auto hidden w-full max-w-[30rem] flex-1 md:flex"
          />

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <Link to="/track-order" className={`${iconLink} hidden sm:grid`} aria-label="Track order" title="Track order">
              <PackageSearch size={20} strokeWidth={1.7} />
            </Link>

            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className={iconLink}
              >
                <User size={20} strokeWidth={1.7} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-subtle-border bg-white shadow-[0_16px_40px_rgba(57,38,51,0.14)]">
                  <div className="border-b border-subtle-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{user ? displayName : 'Welcome'}</p>
                    <p className="truncate text-xs text-secondary-text">{user?.email || 'Sign in to manage your gifts'}</p>
                  </div>
                  <div className="p-1.5">
                    {user ? (
                      <>
                        <Link to="/profile" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink/75 hover:bg-blush/60 hover:text-burgundy">My account</Link>
                        <Link to="/wishlist" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink/75 hover:bg-blush/60 hover:text-burgundy">Wishlist</Link>
                        <Link to="/track-order" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink/75 hover:bg-blush/60 hover:text-burgundy">Track order</Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-burgundy hover:bg-blush/60">
                            <ShieldCheck size={15} /> Admin dashboard
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => { setAccountOpen(false); void signOut(); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink/70 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut size={15} /> Sign out
                        </button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setAccountOpen(false)} className="btn-primary m-1 w-[calc(100%-0.5rem)]">
                        Sign in with Google
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/wishlist" className={iconLink} aria-label="Wishlist" title="Wishlist">
              <Heart size={20} strokeWidth={1.7} />
              {wishlistIds.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[0.58rem] font-bold leading-none text-white">
                  {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className={iconLink} aria-label={`Cart, ${cartCount} items`} title="Cart">
              <ShoppingCart size={20} strokeWidth={1.7} />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[0.58rem] font-bold leading-none text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </Link>
          </div>
        </div>

        <SearchForm
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          placeholder="Search gifts, hampers, flowers…"
          className="mb-3 md:hidden"
        />
      </div>

      <nav aria-label="Primary" className="hidden border-t border-subtle-border bg-[#FBF6F2] lg:block">
        <ul className="container-page flex items-center justify-between py-1.5">
          {NAV_ITEMS.map((item) => (
            <DesktopNavItem key={item.label} item={item} pathname={location.pathname} search={location.search} />
          ))}
        </ul>
      </nav>

      {mobileOpen && (
        <div id="mobile-nav" className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto border-t border-subtle-border bg-[#FFFCF8] lg:hidden">
          <nav aria-label="Mobile" className="container-page py-2">
            <ul>
              {NAV_ITEMS.map((item) => (
                <MobileNavItem key={item.label} item={item} onNavigate={closeMobile} />
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-subtle-border pt-3">
              <Link to="/track-order" onClick={closeMobile} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-subtle-border text-sm font-semibold text-ink/75">
                <PackageSearch size={17} /> Track order
              </Link>
              <Link to="/wishlist" onClick={closeMobile} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-subtle-border text-sm font-semibold text-ink/75">
                <Heart size={17} /> Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
