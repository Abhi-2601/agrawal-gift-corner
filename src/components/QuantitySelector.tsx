import React from "react";

export const QuantitySelector: React.FC<{ quantity: number; onIncrement: () => void; onDecrement: () => void; min?: number; max?: number }> = ({ quantity, onIncrement, onDecrement, min = 1, max = 99 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <button onClick={onDecrement} disabled={quantity <= min} style={{ width: "32px", height: "32px", border: "1px solid #ddd", borderRadius: "4px", background: "#fff", cursor: "pointer" }}>-</button>
    <span style={{ minWidth: "24px", textAlign: "center", fontWeight: 600 }}>{quantity}</span>
    <button onClick={onIncrement} disabled={quantity >= max} style={{ width: "32px", height: "32px", border: "1px solid #ddd", borderRadius: "4px", background: "#fff", cursor: "pointer" }}>+</button>
  </div>
);