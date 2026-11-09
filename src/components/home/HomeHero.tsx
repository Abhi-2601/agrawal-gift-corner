import { Link } from 'react-router-dom';
import { ArrowRight, Gift, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import heroImage from '../../assets/home/hero.webp';

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8EDE7]">
      <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[#F3DCD3] lg:block" aria-hidden />
      <div className="container-page relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-16">
        <div className="relative z-10 max-w-[36rem] motion-safe:animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-burgundy/10 bg-white/75 px-3.5 py-1.5 text-[0.7rem] font-semibold text-burgundy shadow-sm backdrop-blur">
            <Gift size={14} aria-hidden /> Premium gifting destination
          </span>

          <h1 className="mt-5 font-playfair font-bold leading-[1.02] text-[#231614]">
            Thoughtful gifts for
            <span className="block italic text-burgundy">every occasion</span>
          </h1>

          <p className="mt-4 max-w-[30rem] text-[0.95rem] leading-relaxed text-ink/70 sm:text-base">
            Discover curated hampers, fresh flowers, and personalized keepsakes — beautifully crafted to make your loved ones feel truly special.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/products" className="btn-primary px-6 py-3">
              Shop now <ArrowRight size={16} />
            </Link>
            <Link to="/products?cat=Gift+Hampers" className="btn-secondary px-6 py-3">
              Explore collections
            </Link>
          </div>

          <div className="mt-8 grid max-w-[31rem] grid-cols-3 gap-3 border-t border-burgundy/10 pt-5">
            {[
              { icon: Truck, title: 'Fast delivery', text: 'Across India' },
              { icon: ShieldCheck, title: 'Quality assured', text: 'Handpicked' },
              { icon: Sparkles, title: 'Personalized', text: 'Made for them' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-2.5">
                <Icon size={19} className="mt-0.5 shrink-0 text-burgundy" strokeWidth={1.7} />
                <div>
                  <p className="text-[0.75rem] font-semibold leading-tight text-ink">{title}</p>
                  <p className="mt-0.5 text-[0.68rem] text-secondary-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div className="absolute -inset-3 rounded-[2.25rem] bg-white/40 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#F1D6CA] shadow-[0_22px_60px_rgba(74,13,21,0.16)]">
            <img
              src={heroImage}
              alt="A handcrafted gift hamper with flowers and a candle"
              className="aspect-[5/4] w-full object-cover object-center sm:aspect-[6/5]"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2B1715]/50 to-transparent" aria-hidden />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-white/50 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-burgundy">Signature collection</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">Handcrafted with care</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-burgundy text-white">
                <Gift size={17} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
