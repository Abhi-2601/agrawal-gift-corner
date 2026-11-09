import React from "react";
import { Heart } from "lucide-react";

export const WishlistButton: React.FC<{ isFavorited?: boolean; onToggle?: () => void; size?: number }> = ({ isFavorited = false, onToggle, size = 24 }) => (
  <button onClick={onToggle} aria-label="Toggle wishlist" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>
    <Heart size={size} color={isFavorited ? "#D32F2F" : "var(--color-primary)"} fill={isFavorited ? "#D32F2F" : "none"} />
  </button>
);