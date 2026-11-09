import React, { useState } from "react";

export const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; suggestions: string[]; onSelect?: (s: string) => void }> = ({ value, onChange, suggestions, onSelect }) => {
  const [open, setOpen] = useState(false);
  const filtered = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()) && value.length > 0);
  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search gifts..."
        style={{ padding: "0.5rem 1rem", width: "100%", borderRadius: "var(--radius-md)", border: "1px solid #ccc", fontFamily: "var(--font-body)" }}
      />
      {open && filtered.length > 0 && (
        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ddd", borderRadius: "var(--radius-md)", listStyle: "none", padding: 0, zIndex: 50, margin: "0.25rem 0 0" }}>
          {filtered.map(s => (
            <li key={s} onClick={() => { onSelect && onSelect(s); onChange(s); setOpen(false); }} style={{ padding: "0.5rem 1rem", cursor: "pointer", borderBottom: "1px solid #eee" }}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};