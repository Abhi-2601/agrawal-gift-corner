import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/store/ProductCard';
import WishlistButton from '../components/store/WishlistButton';
import { useAuthStore } from '../hooks/useAuth';
import { useCartStore } from '../hooks/useCartStore';
import {
  getDiscountPercent,
  getEffectivePrice,
  getProductImage,
  productCategoryName,
  toCartProduct,
} from '../lib/catalog';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate } from '../lib/utils';
import { getProductById, getProducts } from '../services/productService';
import type { CatalogProduct } from '../lib/types';

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} size={size} className={value <= Math.round(rating) ? 'fill-star text-star' : 'text-star/30'} />
      ))}
    </span>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [related, setRelated] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState('');
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setProduct(null);
    setRelated([]);
    setMainImage(0);
    try {
      const data = await getProductById(id);
      if (!data) {
        setError('This gift could not be found or is no longer available.');
        return;
      }
      setProduct(data);
      if (data.category_id) {
        const siblings = await getProducts({ category: data.category_id }).catch(() => []);
        setRelated(siblings.filter((item) => item.id !== data.id).slice(0, 4));
      }
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load this product.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    const media = (product.product_media || []).map((item) => item.media_url).filter(Boolean);
    return media.length > 0 ? media : [getProductImage(product)];
  }, [product]);

  const approvedReviews = useMemo(
    () => (product?.reviews || []).filter((review) => review.is_approved),
    [product]
  );
  const averageRating = approvedReviews.length
    ? approvedReviews.reduce((sum, review) => sum + Number(review.rating), 0) / approvedReviews.length
    : 0;

  const handleAdd = () => {
    if (!product || Number(product.stock) <= 0) return;
    addItem(toCartProduct(product), quantity, customization.trim() || undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  const handleReview = async (event: FormEvent) => {
    event.preventDefault();
    setReviewError('');
    setReviewMessage('');
    if (!product) return;
    if (!user) {
      setReviewError('Please sign in to write a review.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please share a few words about the gift.');
      return;
    }
    setReviewSubmitting(true);
    try {
      const { error: insertError } = await supabase.from('reviews').insert({
        product_id: product.id,
        profile_id: user.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (insertError) throw insertError;
      setReviewComment('');
      setReviewRating(5);
      setReviewMessage('Thank you — your review is pending approval and will appear shortly.');
      toast.success('Review submitted for approval');
    } catch (submitError: any) {
      setReviewError(submitError?.message || 'Could not submit your review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-10">
        <div className="grid animate-pulse gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] rounded-2xl bg-sand" />
          <div className="space-y-4 py-4">
            <div className="h-3 w-1/3 rounded bg-sand" />
            <div className="h-10 w-4/5 rounded bg-sand" />
            <div className="h-4 w-1/2 rounded bg-sand" />
            <div className="h-24 rounded bg-sand" />
            <div className="h-12 w-2/3 rounded bg-sand" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-subtle-border bg-white p-8 text-center shadow-sm">
          <AlertCircle size={34} className="mx-auto text-burgundy" />
          <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Gift not found</h1>
          <p className="mt-2 text-sm text-secondary-text">{error || 'This product is unavailable.'}</p>
          <div className="mt-5 flex justify-center gap-2">
            <button type="button" onClick={() => void load()} className="btn-secondary"><RefreshCw size={15} /> Retry</button>
            <Link to="/products" className="btn-primary">Browse collection</Link>
          </div>
        </div>
      </div>
    );
  }

  const price = getEffectivePrice(product);
  const discount = getDiscountPercent(product);
  const category = productCategoryName(product);
  const inStock = Number(product.stock) > 0;

  return (
    <div className="bg-ivory">
      <div className="container-page py-7 sm:py-9">
        <nav className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-medium text-secondary-text" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-burgundy">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-burgundy">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/products?cat=${encodeURIComponent(category)}`} className="hover:text-burgundy">{category}</Link>
          <ChevronRight size={12} />
          <span className="line-clamp-1 max-w-[15rem] text-ink">{product.name}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-subtle-border bg-sand shadow-[0_1px_2px_rgba(43,26,23,0.04)]">
              <img src={images[mainImage] || images[0]} alt={product.name} className="aspect-[4/3] w-full object-cover" />
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-burgundy px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-white shadow-sm">
                  {discount}% off
                </span>
              )}
              <WishlistButton productId={product.id} className="absolute right-4 top-4 h-10 w-10" />
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setMainImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 bg-sand transition ${
                      mainImage === index ? 'border-burgundy' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-2">
            <p className="eyebrow">{category}</p>
            <h1 className="mt-2 font-playfair text-3xl font-bold leading-tight text-ink sm:text-4xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-secondary-text">
              {approvedReviews.length > 0 ? (
                <span className="inline-flex items-center gap-1.5"><Stars rating={averageRating} /> {averageRating.toFixed(1)} · {approvedReviews.length} reviews</span>
              ) : (
                <span>New arrival</span>
              )}
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-[0.95rem]">{product.description}</p>

            <div className="mt-5 flex flex-wrap items-baseline gap-3 border-y border-subtle-border py-4">
              <span className="font-playfair text-3xl font-bold text-burgundy">{formatCurrency(price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-secondary-text line-through">{formatCurrency(Number(product.price))}</span>
                  <span className="rounded-full bg-[#FBEAEC] px-2.5 py-1 text-[0.68rem] font-bold text-burgundy">Save {formatCurrency(Number(product.price) - price)}</span>
                </>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
              <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-emerald-600' : 'bg-red-600'}`} />
              <span className={inStock ? 'text-emerald-700' : 'text-red-700'}>
                {inStock ? `In stock · ${product.stock} available` : 'Currently out of stock'}
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-subtle-border bg-white p-4">
              <label htmlFor="customization" className="text-sm font-semibold text-ink">Personalization notes</label>
              <p className="mt-1 text-xs leading-relaxed text-secondary-text">
                Add names, dates, or a short message. We will confirm the details with you on WhatsApp before crafting.
              </p>
              <textarea
                id="customization"
                value={customization}
                onChange={(event) => {
                  if (event.target.value.length <= 500) setCustomization(event.target.value);
                }}
                maxLength={500}
                rows={3}
                placeholder="e.g. Happy 25th Anniversary, Mom & Dad — from Rahul"
                className="input-base mt-3 resize-none"
              />
              <div className="mt-1 flex justify-between text-[0.68rem] text-secondary-text">
                <span>Optional</span>
                <span>{customization.length}/500</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 items-center justify-between rounded-lg border border-subtle-border bg-white px-1 sm:w-32">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-md text-ink hover:bg-blush/60" aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold text-ink">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid h-9 w-9 place-items-center rounded-md text-ink hover:bg-blush/60" aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>

              <button type="button" onClick={handleAdd} disabled={!inStock} className="btn-primary h-11 flex-1">
                {added ? <Check size={17} /> : <ShoppingBag size={17} />}
                {added ? 'Added to bag' : 'Add to bag'}
              </button>
            </div>

            <div className="mt-5 grid gap-2.5 rounded-xl bg-[#FBF6F2] p-4 text-xs text-secondary-text sm:grid-cols-2">
              <p className="flex items-start gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-burgundy" /> Delivery in 7–15 days after confirmation.</p>
              <p className="flex items-start gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-burgundy" /> Prepaid orders only. We confirm every detail personally.</p>
            </div>
          </div>
        </div>

        <section className="mt-12 border-t border-subtle-border pt-8" aria-labelledby="reviews-title">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2 id="reviews-title" className="mt-1">What customers say</h2>
              <div className="mt-4 rounded-xl border border-subtle-border bg-white p-5">
                <div className="flex items-end gap-3">
                  <span className="font-playfair text-4xl font-bold text-ink">{approvedReviews.length ? averageRating.toFixed(1) : '—'}</span>
                  <div className="pb-1">
                    <Stars rating={averageRating} size={16} />
                    <p className="mt-1 text-xs text-secondary-text">{approvedReviews.length} approved {approvedReviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleReview} className="mt-5 rounded-xl border border-subtle-border bg-white p-5">
                <h3 className="font-playfair text-lg font-bold text-ink">Write a review</h3>
                {!user ? (
                  <p className="mt-2 text-xs leading-relaxed text-secondary-text">
                    <Link to="/login" className="font-semibold text-burgundy hover:underline">Sign in</Link> to share your experience with this gift.
                  </p>
                ) : (
                  <>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button key={value} type="button" onClick={() => setReviewRating(value)} aria-label={`Rate ${value} stars`}>
                          <Star size={22} className={value <= reviewRating ? 'fill-star text-star' : 'text-star/30'} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      rows={3}
                      placeholder="Tell us what you loved…"
                      className="input-base mt-3 resize-none"
                    />
                    {reviewError && <p className="mt-2 text-xs text-red-700">{reviewError}</p>}
                    {reviewMessage && <p className="mt-2 text-xs text-emerald-700">{reviewMessage}</p>}
                    <button type="submit" disabled={reviewSubmitting} className="btn-primary mt-3 w-full">
                      {reviewSubmitting && <Loader2 size={15} className="animate-spin" />}
                      {reviewSubmitting ? 'Submitting…' : 'Submit review'}
                    </button>
                  </>
                )}
              </form>
            </div>

            <div className="space-y-3">
              {approvedReviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-subtle-border bg-white p-8 text-center text-sm text-secondary-text">
                  No approved reviews yet. Be the first to share your experience.
                </div>
              ) : (
                approvedReviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-subtle-border bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{review.profiles?.full_name || 'Customer'}</p>
                        <div className="mt-1"><Stars rating={Number(review.rating)} /></div>
                      </div>
                      <time className="text-[0.68rem] text-secondary-text">{formatDate(review.created_at)}</time>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{review.comment}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12 border-t border-subtle-border pt-8" aria-labelledby="related-title">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">You may also like</p>
                <h2 id="related-title" className="mt-1">More from {category}</h2>
              </div>
              <Link to={`/products?cat=${encodeURIComponent(category)}`} className="text-sm font-semibold text-burgundy hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}

        <div className="mt-8">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-text hover:text-burgundy">
            <ArrowLeft size={15} /> Back to collection
          </Link>
        </div>
      </div>
    </div>
  );
}
