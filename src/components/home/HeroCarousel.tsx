import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, ShieldCheck, Truck } from 'lucide-react';
import { HERO_HIGHLIGHTS } from '../../lib/homeData';
import type { HeroSlide } from '../../lib/homeData';

const HIGHLIGHT_ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  heart: Heart,
} as const;

interface HeroCarouselProps {
  slides: HeroSlide[];
}

/** Manual (no autoplay) hero carousel: prev/next buttons and dot indicators. */
export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const slide = slides[index];
  const go = (next: number) => setIndex((next + count) % count);

  const arrow =
    'absolute z-20 grid h-9 w-9 place-items-center rounded-full bg-white text-[#2b1f1c] shadow-[0_4px_14px_rgba(90,40,30,0.18)] transition-colors hover:bg-blush hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy sm:h-10 sm:w-10';

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured gift collections"
      className="relative isolate overflow-hidden bg-[linear-gradient(100deg,#f9dccd_0%,#fbe2da_42%,#fadfd8_100%)] [--img-h:17rem] sm:[--img-h:20rem] md:[--img-h:22rem] lg:flex lg:min-h-[var(--hero-h)] lg:items-center lg:[--hero-h:clamp(24rem,36vw,34rem)]"
    >
      <div key={slide.id} className="motion-safe:animate-hero-in lg:w-full" aria-live="polite" aria-atomic="true">
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
          className="flex flex-col lg:flex-row"
        >
          {/* Copy */}
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-4 pt-9 sm:px-6 sm:pt-12 lg:flex lg:items-center lg:pl-[4.5rem] lg:pr-8 lg:py-8">
            <div className="max-w-[34rem] lg:max-w-[min(36rem,54%)]">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#a14a40] sm:text-xs">
                {slide.eyebrow}
              </p>

              <h1 className="mt-3 font-playfair text-[clamp(2.5rem,5.6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[#1d1311]">
                <span className="block">{slide.lines[0]}</span>
                <span className="block">
                  {slide.lines[1]}
                  <span className="ml-2 inline-flex items-center align-baseline font-script text-[1.2em] font-normal leading-none tracking-normal text-burgundy sm:ml-3">
                    {slide.script}
                    <Heart size={16} aria-hidden className="ml-1.5 mt-3 text-burgundy" />
                  </span>
                </span>
              </h1>

              <p className="mt-3 max-w-[27rem] text-[0.9375rem] leading-relaxed text-[#3a2a26] sm:text-base">{slide.text}</p>

              <Link
                to={slide.cta.to}
                className="mt-5 inline-flex h-12 items-center gap-2 rounded-lg bg-burgundy px-7 text-[0.9375rem] font-semibold text-white shadow-[0_8px_18px_rgba(128,17,31,0.28)] transition-colors hover:bg-burgundy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbe2da]"
              >
                {slide.cta.label}
                <ArrowRight size={18} aria-hidden />
              </Link>

              <ul className="mt-6 grid max-w-[30rem] grid-cols-3 gap-x-3 gap-y-3 sm:flex sm:max-w-none sm:gap-x-8">
                {HERO_HIGHLIGHTS.map(({ icon, lines }) => {
                  const Icon = HIGHLIGHT_ICONS[icon];
                  return (
                    <li key={icon} className="flex items-center gap-2.5">
                      <Icon size={28} strokeWidth={1.4} aria-hidden className="shrink-0 text-burgundy" />
                      <span className="text-[0.6875rem] font-medium leading-snug text-[#2b1f1c] sm:text-xs">
                        {lines[0]}
                        <br />
                        {lines[1]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Photography */}
          <div className="relative h-[var(--img-h)] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[min(58%,calc(var(--hero-h)*1.6))]">
            <img
              src={slide.image}
              alt={slide.alt}
              width={992}
              height={744}
              fetchPriority={index === 0 ? 'high' : undefined}
              className="mask-fade-t h-full w-full object-cover object-[50%_15%] lg:mask-fade-l"
            />
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className={`${arrow} left-2 bottom-[calc(var(--img-h)/2-1.125rem)] sm:left-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2`}
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className={`${arrow} right-2 bottom-[calc(var(--img-h)/2-1.125rem)] sm:right-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2`}
          >
            <ChevronRight size={20} aria-hidden />
          </button>

          <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 items-center lg:bottom-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className="group grid h-8 w-6 place-items-center focus-visible:outline-none"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-colors ${
                    i === index ? 'bg-burgundy' : 'bg-burgundy/25 group-hover:bg-burgundy/50'
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
