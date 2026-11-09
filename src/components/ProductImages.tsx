import React, { useState } from "react";

export const ProductImages: React.FC<{ images: string[]; initialImage?: string }> = ({ images, initialImage }) => {
  const [main, setMain] = useState(initialImage || images[0] || "");
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <img src={main} alt="Product" style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "80px" }}>
        {images.map((img, i) => (
          <button key={i} onClick={() => setMain(img)} style={{ padding: 0, border: main === img ? "2px solid var(--color-secondary)" : "2px solid transparent", borderRadius: "4px", background: "none", cursor: "pointer" }}>
            <img src={img} alt={`Thumbnail ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
          </button>
        ))}
      </div>
    </div>
  );
};