import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { Heart, ArrowLeft, Star, Truck, ShieldCheck, Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { getProductById } from '../services/productService';
import { DEMO_PRODUCTS } from '../lib/demoData';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState('');
  const [liked, setLiked] = useState(false);
  const [mainImg, setMainImg] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          try {
            const data = await getProductById(id);
            if (isMounted && data) {
              setProduct(data);
              return;
            }
          } catch {
            // DB failed or not seeded; try demo fallback
          }

          const demoMatch = DEMO_PRODUCTS.find((p) => p.id === id || p.slug === id);
          if (isMounted && demoMatch) {
            setProduct(demoMatch);
            return;
          }

          if (isMounted && DEMO_PRODUCTS.length > 0) {
            setProduct(DEMO_PRODUCTS[0]);
            return;
          }

          if (isMounted) setError("Product not found.");
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to load product details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-ivory min-h-screen py-24 text-center">
        <div className="max-w-md mx-auto p-8 bg-warm-white rounded-3xl border border-subtle-border animate-pulse space-y-4">
          <div className="aspect-[4/3] bg-soft-blush/60 rounded-2xl" />
          <div className="h-5 bg-soft-blush rounded w-2/3 mx-auto" />
          <div className="h-4 bg-soft-blush/60 rounded w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-ivory min-h-screen py-20">
        <div className="max-w-lg mx-auto px-4 text-center bg-warm-white rounded-3xl p-10 sm:p-12 border border-subtle-border shadow-sm">
          <h2 className="font-playfair text-3xl text-plum font-bold mb-3">Product Not Found</h2>
          <p className="text-secondary-text text-sm mb-6 leading-relaxed">
            The gift you are looking for is currently unavailable or has been relocated.
          </p>
          <Link to="/products" className="btn-primary">
            <ArrowLeft size={16} className="mr-2" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Normalize images
  const images: string[] = [];
  if (product.product_media && product.product_media.length > 0) {
    product.product_media.forEach((m: any) => {
      if (m.media_url) images.push(m.media_url);
    });
  }
  if (images.length === 0 && product.image_url) images.push(product.image_url);
  if (images.length === 0 && product.image) images.push(product.image);
  if (images.length === 0 && Array.isArray(product.images)) images.push(...product.images);
  if (images.length === 0) images.push('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80');

  const isSale = product.sale_price && product.sale_price < product.price;
  const effectivePrice = isSale ? product.sale_price : product.price;
  const stockAvailable = product.stock ?? 10;
  const categoryName = product.categories?.name || product.category || 'Curated Hamper';

  const handleAddToCart = () => {
    if (stockAvailable > 0) {
      addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          description: product.description || '',
          price: product.price,
          sale_price: product.sale_price,
          image: images[0],
          categoryId: product.category_id || product.categoryId || '',
          tags: product.tags || [],
          stock: stockAvailable,
          rating: product.rating || 5,
          reviewCount: product.reviewCount || 0,
          isFeatured: product.is_featured || false,
          isNew: product.is_new || false,
          createdAt: product.created_at || new Date().toISOString(),
          sku: product.sku || '',
        },
        qty,
        custom
      );
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-secondary-text hover:text-plum text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Images Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-subtle-border bg-warm-white">
              <img
                src={images[mainImg] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition duration-300"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition ${
                      mainImg === i
                        ? 'border-plum ring-2 ring-plum/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-rose uppercase tracking-wider mb-2">
                <span>{categoryName}</span>
                {product.sku && (
                  <>
                    <span>•</span>
                    <span className="text-secondary-text">SKU: {product.sku}</span>
                  </>
                )}
              </div>

              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum font-bold leading-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-champagne-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-secondary-text font-medium">Handcrafted item</span>
              </div>
            </div>

            <p className="text-secondary-text text-base sm:text-lg leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Price section */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="font-playfair text-3xl sm:text-4xl font-bold text-plum">
                ₹{effectivePrice}
              </span>
              {isSale && (
                <span className="font-playfair text-xl text-secondary-text line-through font-normal">
                  ₹{product.price}
                </span>
              )}
              {isSale && (
                <span className="bg-soft-blush text-plum font-bold px-3 py-1 rounded-full text-xs">
                  Save ₹{product.price - product.sale_price}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`w-2 h-2 rounded-full ${
                  stockAvailable > 0 ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              />
              <span className={stockAvailable > 0 ? 'text-emerald-700' : 'text-red-700'}>
                {stockAvailable > 0 ? `${stockAvailable} items available` : 'Currently out of stock'}
              </span>
            </div>

            {/* Customization Textarea */}
            <div className="bg-warm-white p-5 sm:p-6 rounded-2xl border border-subtle-border space-y-2">
              <label htmlFor="custom-notes" className="text-sm font-bold text-plum block">
                Customization / Personalization Notes
              </label>
              <p className="text-xs text-secondary-text leading-normal">
                Enter names, special dates, or a personal message to be handwritten or engraved on this gift.
              </p>
              <textarea
                id="custom-notes"
                value={custom}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setCustom(e.target.value);
                }}
                maxLength={500}
                rows={3}
                placeholder="E.g., Please add a card with: 'Happy 25th Anniversary Mom & Dad! - From Rahul & Neha'"
                className="w-full border border-subtle-border rounded-xl p-3.5 bg-ivory text-plum placeholder:text-secondary-text/50 text-sm focus:outline-none focus:ring-2 focus:ring-champagne-gold resize-none"
              />
              <div className="flex justify-between items-center text-xs text-secondary-text pt-1">
                <span className="italic">Notes stay permanently attached to your order.</span>
                <span>{custom.length}/500</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center justify-between border border-subtle-border rounded-xl bg-warm-white p-1 sm:w-36 shrink-0 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-soft-blush text-plum font-bold rounded-lg transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-semibold text-plum text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-soft-blush text-plum font-bold rounded-lg transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stockAvailable === 0}
                className="flex-1 btn-primary py-3.5 text-sm gap-2"
              >
                {addedNotice ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setLiked((l) => !l)}
                aria-label="Save to Wishlist"
                className={`p-3.5 rounded-xl border transition shrink-0 ${
                  liked
                    ? 'bg-soft-blush border-muted-rose text-muted-rose'
                    : 'bg-warm-white border-subtle-border text-secondary-text hover:border-plum'
                }`}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust and Policy Points */}
            <div className="space-y-2 pt-4 border-t border-subtle-border text-xs text-secondary-text">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-champagne-gold shrink-0" />
                <span>Delivery within 7–15 days post order confirmation.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-champagne-gold shrink-0" />
                <span>Prepaid orders only. Our team will contact you to verify order details.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
