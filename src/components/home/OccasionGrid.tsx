import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Cake, Gem, Gift, Heart, Sparkles } from 'lucide-react';

const OCCASIONS = [
  { label: 'Birthday', caption: 'Make their day', to: '/products?cat=Birthday', icon: Cake },
  { label: 'Anniversary', caption: 'Celebrate love', to: '/products?cat=Anniversary', icon: Heart },
  { label: 'Wedding', caption: 'Bless the couple', to: '/products?cat=Wedding', icon: Gem },
  { label: 'Festive', caption: 'Celebrate together', to: '/products?cat=Festive', icon: Sparkles },
  { label: 'Corporate', caption: 'Thoughtful business gifts', to: '/products?cat=Corporate', icon: Building2 },
  { label: 'Combos', caption: 'Gifts that go together', to: '/products?cat=Combos', icon: Gift },
];

export default function OccasionGrid() {
  return (
    <section className="container-page py-10 sm:py-12" aria-labelledby="occasion-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Find the perfect gift</p>
          <h2 id="occasion-title" className="mt-1">Shop by occasion</h2>
        </div>
        <Link to="/products" className="hidden items-center gap-1.5 text-sm font-semibold text-burgundy hover:underline sm:inline-flex">
          View all gifts <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {OCCASIONS.map(({ label, caption, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="group flex min-h-[8.5rem] flex-col items-center justify-center rounded-2xl border border-subtle-border bg-white px-3 py-5 text-center shadow-[0_1px_2px_rgba(43,26,23,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy/20 hover:shadow-[0_10px_24px_rgba(57,38,51,0.08)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FBEAEC] text-burgundy transition-colors group-hover:bg-burgundy group-hover:text-white">
              <Icon size={20} strokeWidth={1.7} />
            </span>
            <span className="mt-3 text-sm font-semibold text-ink group-hover:text-burgundy">{label}</span>
            <span className="mt-1 text-[0.68rem] text-secondary-text">{caption}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
