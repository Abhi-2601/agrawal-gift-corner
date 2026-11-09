import React from "react";

export const CategoryFilter: React.FC<{ categories: string[]; selected: string; onSelect: (c: string) => void }> = ({ categories, selected, onSelect }) => (
  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
    {categories.map(c => (
      <button key={c} onClick={() => onSelect(c)} style={{
        padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", border: "1px solid #ddd",
        background: selected === c ? "var(--color-primary)" : "transparent",
        color: selected === c ? "#fff" : "var(--text-primary)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.875rem"
      }}>{c}</button>
    ))}
  </div>
);