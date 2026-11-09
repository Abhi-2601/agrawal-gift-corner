import { Heart } from 'lucide-react';
import BenefitsStrip from '../components/home/BenefitsStrip';
import BestSellers from '../components/home/BestSellers';
import CategoryShortcuts from '../components/home/CategoryShortcuts';
import HeroCarousel from '../components/home/HeroCarousel';
import PromoBanner from '../components/home/PromoBanner';
import type { PromoBannerData } from '../lib/homeData';
import { CATEGORY_SHORTCUTS, FEATURE_BANNERS, HERO_SLIDES, PROMO_BANNERS, SAMPLE_PRODUCTS } from '../lib/homeData';

/** Small outlined hearts that sit in the soft area between the copy and the photo. */
function FlowerHearts() {
  return (
    <>
      <Heart size={20} strokeWidth={1.4} aria-hidden className="absolute left-[58%] top-4 hidden text-[#a20b19]/60 sm:block" />
      <Heart size={22} strokeWidth={1.4} aria-hidden className="absolute bottom-5 left-[42%] hidden text-[#a20b19]/60 sm:block" />
    </>
  );
}

function BannerRow({ label, banners }: { label: string; banners: PromoBannerData[] }) {
  return (
    <section aria-label={label} className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 sm:pt-9 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-2">
        {banners.map((banner) => (
          <PromoBanner key={banner.id} banner={banner} as="h2" decoration={banner.id === 'flowers' ? <FlowerHearts /> : undefined} />
        ))}
      </div>
    </section>
  );
}

/**
 * Storefront homepage (frontend-only build).
 * Catalog-driven sections use DEMO data from `lib/homeData.ts`; no network calls are made here.
 */
export default function HomePage() {
  return (
    <div className="bg-cream pb-2">
      <HeroCarousel slides={HERO_SLIDES} />
      <CategoryShortcuts categories={CATEGORY_SHORTCUTS} />
      <BannerRow label="Featured collections" banners={PROMO_BANNERS} />
      <BestSellers products={SAMPLE_PRODUCTS} />
      <BannerRow label="Festive and corporate gifting" banners={FEATURE_BANNERS} />
      <BenefitsStrip />
    </div>
  );
}
