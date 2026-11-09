import { Link } from 'react-router-dom';
import type { CategoryShortcut } from '../../lib/homeData';

interface CategoryShortcutsProps {
  categories: CategoryShortcut[];
}

/** Circular category links: scrolls sideways on small screens, an even 8-column row on desktop. */
export default function CategoryShortcuts({ categories }: CategoryShortcutsProps) {
  return (
    <section aria-labelledby="shop-by-category" className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <h2 id="shop-by-category" className="sr-only">
        Shop by category
      </h2>
      <ul className="no-scrollbar -mx-4 flex snap-x snap-proximity gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-2 lg:overflow-visible lg:px-0">
        {categories.map((category) => (
          <li key={category.label} className="w-[5.5rem] shrink-0 snap-start sm:w-[6.5rem] lg:w-auto">
            <Link
              to={category.to}
              className="group flex flex-col items-center gap-2.5 rounded-xl py-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <span className="block h-[4.75rem] w-[4.75rem] overflow-hidden rounded-full bg-blush shadow-[0_3px_10px_rgba(90,40,30,0.10)] ring-1 ring-[#f1d6d0] transition-shadow group-hover:shadow-[0_6px_16px_rgba(128,17,31,0.18)] sm:h-[5.5rem] sm:w-[5.5rem]">
                <img src={category.image} alt="" width={96} height={96} loading="lazy" className="h-full w-full object-cover" />
              </span>
              <span className="text-[0.8125rem] font-medium leading-tight text-[#2b1f1c] group-hover:text-burgundy">
                {category.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
