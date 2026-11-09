import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import catHampers from '../../assets/home/cat-hampers.webp';
import catFlowers from '../../assets/home/cat-flowers.webp';
import catPersonalized from '../../assets/home/cat-personalized.webp';

const COLLECTIONS = [
  {
    title: 'Gift hampers',
    description: 'Curated boxes of treats, keepsakes, and little luxuries.',
    image: catHampers,
    to: '/products?cat=Gift+Hampers',
  },
  {
    title: 'Fresh flowers',
    description: 'Beautiful blooms arranged to say what words cannot.',
    image: catFlowers,
    to: '/products?cat=Flowers',
  },
  {
    title: 'Personalized gifts',
    description: 'Names, photos, and messages made uniquely theirs.',
    image: catPersonalized,
    to: '/products?cat=Personalized+Gifts',
  },
];

export default function CollectionCards() {
  return (
    <section className="container-page py-10 sm:py-12" aria-labelledby="collections-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Curated for you</p>
          <h2 id="collections-title" className="mt-1">Featured collections</h2>
        </div>
        <Link to="/products" className="hidden items-center gap-1.5 text-sm font-semibold text-burgundy hover:underline sm:inline-flex">
          Browse all <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.title}
            to={collection.to}
            className="group relative isolate overflow-hidden rounded-2xl border border-subtle-border bg-sand shadow-[0_1px_2px_rgba(43,26,23,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(57,38,51,0.1)]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2B1715]/85 via-[#2B1715]/35 to-transparent p-5 pt-16 text-white">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-white">{collection.title}</h3>
                  <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-white/75">{collection.description}</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/95 text-burgundy transition-colors group-hover:bg-white">
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
