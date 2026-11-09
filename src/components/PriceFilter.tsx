import React from "react";

export const PriceFilter: React.FC<{ min?: number; max?: number; value?: [number, number]; onChange?: (v: [number, number]) => void }> = ({ min = 0, max = 5000, value = [0, 5000], onChange }) => (
  <div style={{ padding: "1rem 0" }}>
    <label style={{ fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>Price Range</label>
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input type="number" value={value[0]} onChange={e => onChange && onChange([Number(e.target.value), value[1]])} min={min} max={max} style={{ width: "100px", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "var(--radius-sm)" }} />
      <span>-</span>
      <input type="number" value={value[1]} onChange={e => onChange && onChange([value[0], Number(e.target.value)])} min={min} max={max} style={{ width: "100px", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "var(--radius-sm)" }} />
    </div>
  </div>
);