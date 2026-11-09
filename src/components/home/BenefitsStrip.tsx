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
    <section aria-label="Why shop with us" className="mx-auto mt-10 max-w-[1280px] px-4 sm:mt-12 sm:px-6 lg:px-8">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#efe3dd] py-8 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:py-9">
        {BENEFITS.map(({ icon, title, text }) => {
          const Icon = ICONS[icon];
          return (
            <li key={title} className="flex items-center gap-3.5 sm:gap-4 lg:justify-center">
              <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#efe3dd] bg-white text-burgundy sm:h-14 sm:w-14">
                <Icon size={26} strokeWidth={1.4} />
              </span>
              <span>
                <span className="block text-[0.875rem] font-semibold text-[#2b1f1c]">{title}</span>
                <span className="block text-[0.8125rem] text-[#5f524d]">{text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
