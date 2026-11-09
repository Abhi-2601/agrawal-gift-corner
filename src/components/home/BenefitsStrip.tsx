import { Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { BENEFITS } from '../../lib/homeData';

const ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  returns: RotateCcw,
  support: Headset,
} as const;

export default function BenefitsStrip() {
  return (
    <section aria-label="Why shop with us" className="border-y border-subtle-border bg-white">
      <div className="container-page">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 sm:gap-x-6 lg:grid-cols-4 lg:py-7">
          {BENEFITS.map(({ icon, title, text }) => {
            const Icon = ICONS[icon];
            return (
              <li key={title} className="flex items-center gap-3 lg:justify-center">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAEC] text-burgundy">
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-[0.78rem] font-semibold leading-tight text-ink">{title}</span>
                  <span className="mt-0.5 block text-[0.68rem] text-secondary-text">{text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
