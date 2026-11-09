import type { ComponentType } from 'react';
import { Gift, Heart, MapPin, ShieldCheck, Truck } from 'lucide-react';

export interface AnnouncementBarProps {
  /** When provided, replaces the default highlight row with a single custom message. */
  message?: string;
  linkText?: string;
  linkHref?: string;
}

interface Highlight {
  /** Tailwind visibility classes: lower-priority items drop out on narrow screens. */
  show: string;
  icon: ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  text: string;
}

const HIGHLIGHTS: Highlight[] = [
  { show: 'flex', icon: Gift, text: 'Free delivery on orders above ₹999' },
  { show: 'hidden sm:flex', icon: Truck, text: 'Handcrafted & carefully packed' },
  { show: 'hidden lg:flex', icon: ShieldCheck, text: '100% quality assured' },
  { show: 'hidden lg:flex', icon: Heart, text: 'Make every moment special' },
];

// Demo delivery pincode shown in the reference design.
const DELIVERY_PINCODE = '281403';

export default function AnnouncementBar({ message, linkText, linkHref }: AnnouncementBarProps) {
  if (message) {
    return (
      <div className="bg-burgundy px-4 py-2.5 text-center text-[0.8125rem] font-medium text-white">
        <p className="text-white">
          {message}
          {linkText && linkHref && (
            <a href={linkHref} className="ml-2 font-semibold underline underline-offset-[3px] hover:text-[#f6dccb]">
              {linkText}
            </a>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-burgundy text-white">
      <div className="mx-auto flex max-w-[1280px] items-center px-4 sm:px-6 lg:px-8">
        <ul
          aria-label="Store highlights"
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-x-6 overflow-x-auto whitespace-nowrap py-2 text-[0.75rem] font-medium lg:justify-between lg:gap-x-5 lg:pr-5 lg:text-[0.72rem] xl:gap-x-8 xl:pr-8 xl:text-[0.78rem]"
        >
          {HIGHLIGHTS.map(({ icon: Icon, text, show }) => (
            <li key={text} className={`${show} shrink-0 items-center gap-2`}>
              <Icon size={15} className="text-[#f6dccb]" aria-hidden />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <div className="ml-3 flex shrink-0 items-center gap-1.5 border-l border-white/25 py-2 pl-3 text-[0.75rem] font-medium sm:ml-4 sm:pl-4">
          <MapPin size={14} className="text-[#f6dccb]" aria-hidden />
          <span className="sr-only">Delivery pincode</span>
          <span>{DELIVERY_PINCODE}</span>
        </div>
      </div>
    </div>
  );
}
