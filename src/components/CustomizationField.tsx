import React from "react";

export const CustomizationField: React.FC<{ value: string; onChange: (v: string) => void; label?: string; maxLength?: number }> = ({ value, onChange, label = "Customization / Special Instructions", maxLength = 500 }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      maxLength={maxLength}
      rows={3}
      placeholder="Tell us what makes it special (max 500 chars)"
      style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)" }}
    />
    <div style={{ textAlign: "right", fontSize: "0.75rem", color: value.length > maxLength ? "var(--color-error)" : "var(--text-secondary)", marginTop: "0.25rem" }}>
      {value.length}/{maxLength}
    </div>
  </div>
);