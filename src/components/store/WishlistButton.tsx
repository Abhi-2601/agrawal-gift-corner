import { Heart } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
}

export default function WishlistButton({ productId, className = '', size = 18 }: WishlistButtonProps) {
  const user = useAuthStore((state) => state.user);
  const { isWished, toggle } = useWishlist(user?.id);
  const wished = isWished(productId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle(productId);
      }}
      aria-pressed={wished}
      aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`grid place-items-center rounded-full border border-subtle-border bg-white/95 text-ink shadow-sm backdrop-blur transition-colors hover:border-burgundy/30 hover:text-burgundy ${className}`}
    >
      <Heart size={size} aria-hidden className={wished ? 'fill-burgundy text-burgundy' : ''} />
    </button>
  );
}
