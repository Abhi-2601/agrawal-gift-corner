import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-secondary-text">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'burgundy',
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'burgundy' | 'amber' | 'green' | 'blue';
  hint?: string;
}) {
  const tones = {
    burgundy: 'bg-[#FBEAEC] text-burgundy',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-sky-50 text-sky-700',
  };

  return (
    <div className="admin-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-text">{label}</p>
          <p className="mt-2 font-playfair text-3xl font-bold leading-none text-ink">{value}</p>
          {hint && <p className="mt-2 text-[0.7rem] text-secondary-text">{hint}</p>}
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={20} aria-hidden />
        </span>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status?: string | null }) {
  const value = (status || 'pending').toLowerCase();
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    unpaid: 'bg-red-50 text-red-700 ring-red-200',
    confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    in_production: 'bg-sky-50 text-sky-700 ring-sky-200',
    processing: 'bg-sky-50 text-sky-700 ring-sky-200',
    shipped: 'bg-violet-50 text-violet-700 ring-violet-200',
    delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    cancelled: 'bg-red-50 text-red-700 ring-red-200',
    refunded: 'bg-slate-50 text-slate-700 ring-slate-200',
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    hidden: 'bg-slate-50 text-slate-600 ring-slate-200',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    pending_review: 'bg-amber-50 text-amber-700 ring-amber-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold capitalize ring-1 ring-inset ${styles[value] || styles.hidden}`}>
      {value.replace(/_/g, ' ')}
    </span>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-subtle-border bg-white px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-blush text-burgundy">
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="mt-4 font-playfair text-xl font-bold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-secondary-text">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-subtle-border bg-white py-16 text-sm text-secondary-text">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-burgundy/20 border-t-burgundy" />
      {label}
    </div>
  );
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 break-words text-xs leading-relaxed">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800">
          Retry
        </button>
      )}
    </div>
  );
}
