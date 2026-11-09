import React, { useState } from "react";

interface Slide { image: string; title: string; subtitle?: string; link?: string }

export const ProductCarousel: React.FC<{ slides: Slide[]; autoplay?: boolean; interval?: number }> = ({ slides, autoplay = false, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);
  React.useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setCurrent(i => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [autoplay, interval, slides.length]);

  return (
    <section style={{ position: "relative", overflow: "hidden", height: "400px" }}>
      {slides.map((s, i) => (
        <a key={i} href={s.link || "#"} style={{
          position: "absolute", inset: 0, display: i === current ? "block" : "none",
          backgroundImage: `url(${s.image})`, backgroundSize: "cover", backgroundPosition: "center",
          textDecoration: "none"
        }}>
          <div style={{ position: "absolute", bottom: "2rem", left: "2rem", background: "rgba(0,0,0,0.5)", color: "#fff", padding: "1rem 2rem", borderRadius: "var(--radius-md)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", margin: 0 }}>{s.title}</h2>
            {s.subtitle && <p style={{ margin: "0.25rem 0 0" }}>{s.subtitle}</p>}
          </div>
        </a>
      ))}
      <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: "10px", height: "10px", borderRadius: "50%", border: "none", background: i === current ? "var(--color-secondary)" : "rgba(255,255,255,0.5)", cursor: "pointer"
          }} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};