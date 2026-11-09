import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, PackageSearch, Search, ShoppingCart, User, X } from 'lucide-react';
import { useCartStore } from '../../hooks/useCartStore';
import { useDemoCart } from '../../hooks/useDemoCart';
import { NAV_ITEMS } from '../../lib/homeData';
import type { NavItem } from '../../lib/homeData';
import BrandLogo from './BrandLogo';

export interface HeaderProps {
  onCartClick?: () => void;
  onAccountClick?: () => void;
}

const navText = 'text-[0.8125rem] font-semibold tracking-[0.01em]';

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  className?: string;
}

function SearchForm({ value, onChange, onSubmit, placeholder, className = '' }: SearchFormProps) {
  const inputId = useId();
  return (
    <form role="search" onSubmit={onSubmit} className={`flex h-11 overflow-hidden rounded-lg border border-[#e6d9d3] bg-[#fcfbf9] focus-within:border-burgundy focus-within:ring-2 focus-within:ring-burgundy/20 ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search gifts, hampers, flowers and personalized items
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-4 text-[0.8125rem] text-ink placeholder:text-[#9a8d88] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid w-12 shrink-0 place-items-center bg-burgundy-light text-white transition-colors hover:bg-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      >
        <Search size={19} aria-hidden />
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop navigation                                                  */
/* ------------------------------------------------------------------ */

function isCurrent(item: NavItem, pathname: string, search: string) {
  const here = pathname + search;
  if (item.to) return item.to === '/' ? pathname === '/' : here === item.to;
  return Boolean(item.children?.some((child) => child.to === here));
}

function DesktopNavItem({ item, pathname, search }: { item: NavItem; pathname: string; search: string }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const current = isCurrent(item, pathname, search);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!itemRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!item.children) {
    const isHome = item.to === '/';
    return (
      <li>
        <Link
          to={item.to ?? '/'}
          aria-current={current ? 'page' : undefined}
          className={`${navText} inline-flex h-9 items-center rounded-full px-4 transition-colors ${
            current && isHome
              ? 'bg-burgundy text-white'
              : current
                ? 'text-burgundy'
                : 'text-[#2b1f1c] hover:text-burgundy'
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
      // Hover-open for mouse only; touch/keyboard use the button so a tap never double-toggles.
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`${navText} inline-flex h-9 items-center gap-1 rounded-full px-3 transition-colors hover:text-burgundy ${
          current || open ? 'text-burgundy' : 'text-[#2b1f1c]'
        }`}
      >
        {item.label}
        <ChevronDown size={14} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={menuId} className="absolute left-0 top-full z-50 pt-2">
          <ul className="min-w-[13rem] rounded-xl border border-[#efe3dd] bg-white p-1.5 shadow-[0_12px_32px_rgba(90,40,30,0.14)]">
            {item.children.map((child) => (
              <li key={child.label}>
                <Link
                  to={child.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-[0.8125rem] font-medium text-[#2b1f1c] transition-colors hover:bg-blush hover:text-burgundy"
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

/* ------------------------------------------------------------------ */
/* Mobile navigation                                                   */
/* ------------------------------------------------------------------ */

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rowClass =
    'flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-[0.9375rem] font-semibold text-[#2b1f1c] transition-colors hover:bg-blush hover:text-burgundy';

  if (!item.children) {
    return (
      <li>
        <Link to={item.to ?? '/'} onClick={onNavigate} className={rowClass}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)} className={rowClass}>
        {item.label}
        <ChevronDown size={18} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul id={panelId} className="mb-1 ml-3 border-l border-[#ead9d2] pl-2">
          {item.children.map((child) => (
            <li key={child.label}>
              <Link
                to={child.to}
                onClick={onNavigate}
                className="flex min-h-11 items-center rounded-lg px-3 text-[0.875rem] font-medium text-[#4a3b36] hover:bg-blush hover:text-burgundy"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export default function Header(_props?: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const realCount = useCartStore((s) => s.getTotalItems());
  const demoCount = useDemoCart((s) => s.count);
  const totalItems = realCount + demoCount;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setMobileOpen(false);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const closeMobile = () => setMobileOpen(false);

  const iconLink =
    'group flex items-center justify-center gap-2 rounded-lg px-2 py-1 text-[#2b1f1c] transition-colors hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy';
  const iconLabel = 'hidden text-[0.8125rem] font-medium lg:block';

  return (
    <header className="sticky top-0 z-50 border-b border-[#efe3dd] bg-[#fcf7f4]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-2 sm:gap-4 lg:h-[76px] lg:gap-8">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="-ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#2b1f1c] transition-colors hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy lg:hidden"
          >
            {mobileOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>

          <BrandLogo />

          <SearchForm
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search for gifts, hampers, flowers, personalized items..."
            className="mx-auto hidden w-full max-w-[34rem] flex-1 md:flex"
          />

          <div className="ml-auto flex items-center gap-0.5 sm:gap-2 md:ml-0 lg:gap-3">
            <Link to="/profile" className={`${iconLink} hidden sm:flex`}>
              <PackageSearch size={24} strokeWidth={1.6} aria-hidden />
              <span className={iconLabel}>Track Order</span>
              <span className="sr-only lg:hidden">Track Order</span>
            </Link>
            <Link to="/profile" className={`${iconLink} hidden sm:flex`}>
              <User size={24} strokeWidth={1.6} aria-hidden />
              <span className={iconLabel}>Account</span>
              <span className="sr-only lg:hidden">Account</span>
            </Link>
            <Link to="/cart" className={`${iconLink} min-h-11 min-w-11`}>
              <span className="relative">
                <ShoppingCart size={24} strokeWidth={1.6} aria-hidden />
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-burgundy px-1 text-[0.625rem] font-bold leading-none text-white"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              </span>
              <span className={iconLabel}>Cart</span>
              <span className="sr-only lg:hidden">Cart</span>
              <span className="sr-only">
                , {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile search row */}
        <SearchForm value={query} onChange={setQuery} onSubmit={handleSearch} placeholder="Search gifts, hampers, flowers..." className="mb-3 md:hidden" />
      </div>

      {/* Desktop category navigation */}
      <nav aria-label="Primary" className="hidden border-t border-[#efe3dd] bg-[#f8f3f1] lg:block">
        <ul className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-1.5">
          {NAV_ITEMS.map((item) => (
            <DesktopNavItem key={item.label} item={item} pathname={location.pathname} search={location.search} />
          ))}
        </ul>
      </nav>

      {/* Mobile / tablet drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-8.5rem)] overflow-y-auto border-t border-[#efe3dd] bg-[#fcf7f4] lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-[1280px] px-4 py-2 sm:px-6">
            <ul>
              {NAV_ITEMS.map((item) => (
                <MobileNavItem key={item.label} item={item} onNavigate={closeMobile} />
              ))}
            </ul>
            <ul className="mt-2 flex gap-2 border-t border-[#efe3dd] pt-3 sm:hidden">
              <li className="flex-1">
                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#e6d9d3] text-[0.875rem] font-semibold text-[#2b1f1c]"
                >
                  <PackageSearch size={18} aria-hidden /> Track Order
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#e6d9d3] text-[0.875rem] font-semibold text-[#2b1f1c]"
                >
                  <User size={18} aria-hidden /> Account
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
