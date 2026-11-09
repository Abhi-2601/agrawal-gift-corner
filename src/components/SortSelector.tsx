import React from "react";

export const SortSelector: React.FC<{ options: { value: string; label: string }[]; value?: string; onChange?: (v: string) => void }> = ({ options, value, onChange }) => (
  <select value={value} onChange={e => onChange && onChange(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid #ccc", fontFamily: "var(--font-body)" }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);