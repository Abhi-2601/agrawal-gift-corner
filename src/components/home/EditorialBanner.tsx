import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EditorialBannerProps {
  title: string;
  description: string;
  image: string;
  to: string;
  cta?: string;
  eyebrow?: string;
}

export default function EditorialBanner({
  title,
  description,
  image,
  to,
  cta = 'Explore collection',
  eyebrow = 'The festive edit',
}: EditorialBannerProps) {
  return (
    <section className="container-page py-10 sm:py-12">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#4A0D15] text-white shadow-[0_18px_44px_rgba(74,13,21,0.18)]">
        <div className="grid items-center lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 p-7 sm:p-10 lg:p-12">
            <p className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#F6DCCB]">
              <Sparkles size={14} /> {eyebrow}
            </p>
            <h2 className="mt-3 max-w-lg font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">{description}</p>
            <Link to={to} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F6DCCB] px-5 py-3 text-sm font-semibold text-[#4A0D15] transition-colors hover:bg-white">
              {cta} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative h-56 sm:h-72 lg:h-full lg:min-h-[20rem]">
            <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A0D15]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#4A0D15] lg:via-[#4A0D15]/20 lg:to-transparent" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
