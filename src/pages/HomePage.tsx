import { useCallback, useEffect, useState } from 'react';
import BenefitsStrip from '../components/home/BenefitsStrip';
import CollectionCards from '../components/home/CollectionCards';
import EditorialBanner from '../components/home/EditorialBanner';
import HomeHero from '../components/home/HomeHero';
import HomeProductSection from '../components/home/HomeProductSection';
import OccasionGrid from '../components/home/OccasionGrid';
import festiveBanner from '../assets/home/banner-festive.webp';
import { getActiveBanners, getProducts } from '../services/productService';
import type { Banner, CatalogProduct } from '../lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catalog, activeBanners] = await Promise.all([
        getProducts(),
        getActiveBanners().catch(() => []),
      ]);
      setProducts(catalog);
      setBanner(activeBanners[0] ?? null);
    } catch (loadError: any) {
      setProducts([]);
      setError(loadError?.message || 'The collection is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const editorial = banner
    ? {
        title: banner.title || 'The festive edit',
        description: 'Celebrate every occasion with our exclusive gifting range, thoughtfully curated and beautifully wrapped.',
        image: banner.image_url,
        to: banner.link_url || '/products?cat=Festive',
      }
    : {
        title: 'The festive edit',
        description: 'Celebrate every occasion with our exclusive gifting range, thoughtfully curated and beautifully wrapped.',
        image: festiveBanner,
        to: '/products?cat=Festive',
      };

  return (
    <div className="bg-ivory">
      <HomeHero />
      <BenefitsStrip />
      <OccasionGrid />
      <CollectionCards />
      <HomeProductSection products={products} loading={loading} error={error} onRetry={() => void load()} />
      <EditorialBanner
        title={editorial.title}
        description={editorial.description}
        image={editorial.image}
        to={editorial.to}
        cta="Shop festive gifts"
      />
    </div>
  );
}
