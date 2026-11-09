import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, MessageSquare, RefreshCw, Search, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminEmpty, AdminError, AdminLoading, AdminPageHeader, StatusBadge } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';

type ReviewFilter = 'pending' | 'approved' | 'all';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewFilter>('pending');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await supabase
        .from('reviews')
        .select('*, profiles(full_name), products(name)')
        .order('created_at', { ascending: false });
      if (loadError) throw loadError;
      setReviews(data || []);
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reviews.filter((review) => {
      if (filter === 'pending' && review.is_approved) return false;
      if (filter === 'approved' && !review.is_approved) return false;
      if (!term) return true;
      return (
        (review.profiles?.full_name || '').toLowerCase().includes(term) ||
        (review.comment || '').toLowerCase().includes(term) ||
        (review.products?.name || '').toLowerCase().includes(term)
      );
    });
  }, [reviews, filter, search]);

  const moderate = async (id: string, approved: boolean) => {
    setUpdatingId(id);
    const { error: updateError } = await supabase.from('reviews').update({ is_approved: approved }).eq('id', id);
    if (updateError) {
      toast.error(updateError.message);
    } else {
      setReviews((current) => current.map((review) => review.id === id ? { ...review, is_approved: approved } : review));
      toast.success(approved ? 'Review approved' : 'Review hidden');
    }
    setUpdatingId(null);
  };

  const pendingCount = reviews.filter((review) => !review.is_approved).length;
  const approvedCount = reviews.filter((review) => review.is_approved).length;

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Approve genuine customer feedback before it appears on product pages."
        actions={<button type="button" onClick={() => void load()} className="btn-secondary text-xs"><RefreshCw size={14} /> Refresh</button>}
      />

      <div className="admin-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex rounded-lg border border-subtle-border bg-[#FBF8F5] p-1">
          {[
            { id: 'pending' as const, label: `Pending (${pendingCount})` },
            { id: 'approved' as const, label: `Approved (${approvedCount})` },
            { id: 'all' as const, label: `All (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-[0.68rem] font-semibold transition-colors ${filter === tab.id ? 'bg-white text-burgundy shadow-sm' : 'text-secondary-text hover:text-ink'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/60" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reviewer, product, or comment…" className="admin-input pl-9" />
        </div>
      </div>

      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : loading ? (
        <AdminLoading label="Loading reviews…" />
      ) : filtered.length === 0 ? (
        <AdminEmpty
          icon={MessageSquare}
          title={filter === 'pending' ? 'No reviews awaiting moderation' : 'No reviews found'}
          description="Customer reviews will appear here after they are submitted."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <article key={review.id} className="admin-card p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{review.profiles?.full_name || 'Customer'}</p>
                    <StatusBadge status={review.is_approved ? 'approved' : 'pending_review'} />
                    <span className="text-[0.65rem] text-secondary-text">{formatDate(review.created_at)}</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] font-medium text-secondary-text">{review.products?.name || 'General review'}</p>
                  <div className="mt-2 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star key={value} size={14} className={value <= Number(review.rating) ? 'fill-star text-star' : 'text-star/25'} />
                    ))}
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/70">{review.comment || 'No comment provided.'}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  {!review.is_approved && (
                    <button
                      type="button"
                      disabled={updatingId === review.id}
                      onClick={() => void moderate(review.id, true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}
                  {review.is_approved && (
                    <button
                      type="button"
                      disabled={updatingId === review.id}
                      onClick={() => void moderate(review.id, false)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <X size={14} /> Hide
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
