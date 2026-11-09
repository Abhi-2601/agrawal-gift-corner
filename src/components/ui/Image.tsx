import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  objectFit?: "cover" | "contain";
  fallback?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  className = "",
  objectFit = "cover",
  fallback = "https://placehold.co/400x400?text=Image"
}) => {
  const [loaded, setLoaded] = React.useState(true);

  return (
    <img
      src={src || fallback}
      alt={alt}
      loading="lazy"
      onError={() => setLoaded(false)}
      style={{
        width,
        height,
        objectFit,
        borderRadius: "var(--radius-md)",
        display: loaded ? "block" : "none"
      }}
      className={className}
    />
  );
};