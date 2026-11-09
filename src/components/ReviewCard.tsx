import React from "react";

interface ReviewCardProps {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ name, rating, date, comment }) => (
  <div style={{ background: "#fff", padding: "1rem", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", marginBottom: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
      <h4 style={{ margin: 0, fontFamily: "var(--font-heading)" }}>{name}</h4>
      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{date}</span>
    </div>
    <div style={{ color: "var(--color-secondary)", fontWeight: 700, marginBottom: "0.5rem" }}>{"★".repeat(Math.round(rating))}</div>
    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{comment}</p>
  </div>
);