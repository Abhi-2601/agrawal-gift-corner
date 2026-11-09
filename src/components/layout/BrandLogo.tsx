import { Link } from 'react-router-dom';

/** Burgundy gift box with a cream ribbon and bow. Decorative (the wordmark names the brand). */
function GiftBoxMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      {/* bow */}
      <path
        d="M24 15c-1.2-5.2-8.6-8.2-11.4-4.8-2.2 2.7.2 6.4 4.6 6.4H24Zm0 0c1.2-5.2 8.6-8.2 11.4-4.8 2.2 2.7-.2 6.4-4.6 6.4H24Z"
        fill="#80111F"
      />
      <path d="M24 15c-.5 1.4-1.5 2.4-3 3m3-3c.5 1.4 1.5 2.4 3 3" stroke="#F6DCCB" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* lid + body */}
      <rect x="6" y="16" width="36" height="9" rx="2" fill="#80111F" />
      <rect x="9" y="25" width="30" height="18" rx="2" fill="#80111F" />
      {/* ribbon */}
      <rect x="21" y="16" width="6" height="27" fill="#F6DCCB" />
      <rect x="21" y="16" width="6" height="9" fill="#EBC3AB" />
    </svg>
  );
}

interface BrandLogoProps {
  className?: string;
}

/** "AGRAWAL / — GIFT CORNER — / tagline" wordmark with the gift-box mark. */
export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <Link
      to="/"
      aria-label="Agrawal Gift Corner, home"
      className={`group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy sm:gap-3 ${className}`}
    >
      <GiftBoxMark className="h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
      <span className="flex flex-col leading-none text-burgundy" aria-hidden="true">
        <span className="font-brand text-[1.15rem] font-semibold tracking-[0.12em] sm:text-[1.5rem] lg:text-[1.65rem]">
          AGRAWAL
        </span>
        <span className="mt-1 flex items-center gap-1.5">
          <span className="h-px flex-1 bg-burgundy/70" />
          <span className="font-brand text-[0.55rem] font-medium tracking-[0.3em] sm:text-[0.65rem]">GIFT CORNER</span>
          <span className="h-px flex-1 bg-burgundy/70" />
        </span>
        <span className="mt-1 hidden text-[0.6rem] tracking-[0.04em] text-[#6b5a55] sm:block">Make Every Moment Special</span>
      </span>
    </Link>
  );
}
