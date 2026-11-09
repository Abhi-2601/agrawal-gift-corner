import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BannerTone, PromoBannerData } from '../../lib/homeData';

const TONES: Record<BannerTone, { bg: string; title: string; text: string; button: string; ring: string }> = {
  blush: {
    bg: 'bg-[linear-gradient(100deg,#fde6e2_0%,#fcdbd9_100%)]',
    title: 'text-[#8b1020]',
    text: 'text-[#4a3733]',
    button: 'bg-[#86111d] text-white hover:bg-burgundy-dark focus-visible:ring-burgundy',
    ring: 'focus-visible:ring-offset-[#fcdbd9]',
  },
  sand: {
    bg: 'bg-[linear-gradient(100deg,#fcf8ec_0%,#f6e3d0_55%,#f0ccaf_100%)]',
    title: 'text-[#3a1710]',
    text: 'text-[#4a3733]',
    button: 'bg-[#82131f] text-white hover:bg-burgundy-dark focus-visible:ring-burgundy',
    ring: 'focus-visible:ring-offset-[#f6e3d0]',
  },
  wine: {
    bg: 'bg-[linear-gradient(100deg,#4a0407_0%,#640a10_60%,#7f1118_100%)]',
    title: 'text-white',
    text: 'text-white/90',
    button: 'bg-[#f7f0eb] text-burgundy-dark hover:bg-white focus-visible:ring-white',
    ring: 'focus-visible:ring-offset-[#640a10]',
  },
  stone: {
    bg: 'bg-[linear-gradient(100deg,#f7f1ea_0%,#eee6dc_55%,#e0d5ca_100%)]',
    title: 'text-[#3a2a22]',
    text: 'text-[#4a3f3a]',
    button: 'bg-[#032837] text-white hover:bg-[#0a3a4d] focus-visible:ring-[#032837]',
    ring: 'focus-visible:ring-offset-[#eee6dc]',
  },
};

interface PromoBannerProps {
  banner: PromoBannerData;
  /** Heading level, so each section keeps a valid outline. */
  as?: 'h2' | 'h3';
  decoration?: ReactNode;
}

/** Image-right promotional banner. Stacks (copy above photo) on phones. */
export default function PromoBanner({ banner, as: Heading = 'h3', decoration }: PromoBannerProps) {
  const tone = TONES[banner.tone];

  return (
    <article
      className={`relative isolate flex flex-col overflow-hidden rounded-2xl shadow-[0_4px_18px_rgba(90,40,30,0.08)] sm:min-h-[12.5rem] lg:min-h-[clamp(11.25rem,17.5vw,15rem)] ${tone.bg}`}
    >
      {decoration}

      <div className="relative z-10 flex flex-col items-start justify-center gap-3 p-6 sm:p-7 lg:p-7 lg:pl-8 xl:p-8 xl:pl-9">
        <Heading
          className={`font-playfair text-[1.625rem] font-bold leading-[1.12] tracking-[-0.01em] sm:max-w-[56%] sm:text-[1.75rem] lg:text-[clamp(1.5rem,2.4vw,2.1rem)] ${tone.title}`}
        >
          {banner.title}
        </Heading>
        <p className={`max-w-[19rem] text-[0.8125rem] sm:max-w-[min(19rem,56%)] leading-relaxed sm:text-sm ${tone.text}`}>{banner.description}</p>
        <Link
          to={banner.to}
          className={`mt-1 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg px-4 lg:px-5 text-[0.8125rem] font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-10 ${tone.button} ${tone.ring}`}
        >
          {banner.cta}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <div className="relative h-44 w-full sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto sm:w-[46%]">
        <img
          src={banner.image}
          alt={banner.imageAlt}
          loading="lazy"
          style={banner.imagePosition ? { objectPosition: banner.imagePosition } : undefined}
          className="mask-fade-t h-full w-full object-cover sm:mask-fade-l"
        />
      </div>
    </article>
  );
}
