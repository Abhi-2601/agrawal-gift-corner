import React from "react";
export interface BadgeProps { text: string; variant?: "stock" | "discount" | "featured" | "default"; }
const colors = { stock: "#10b981", discount: "#f59e0b", featured: "#bfa065", default: "#6b7280" };
export const Badge: React.FC<BadgeProps> = ({ text, variant = "default" }) => (
  <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontWeight: 700, fontSize: 11, color: "#fff", background: colors[variant] || colors.default }}>{text}</span>
);
