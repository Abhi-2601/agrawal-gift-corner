import React from "react";

export const ReviewForm: React.FC<{ onSubmit?: (data: { name: string; rating: number; comment: string }) => void }> = ({ onSubmit }) => {
  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit && onSubmit({ name, rating, comment }); }} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", background: "#fff", borderRadius: "var(--radius-md)" }}>
      <h3 style={{ fontFamily: "var(--font-heading)", margin: 0 }}>Write a Review</h3>
      <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }} />
      <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}>
        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>)}
      </select>
      <textarea placeholder="Your review..." value={comment} onChange={e => setComment(e.target.value)} rows={3} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }} />
      <button type="submit" className="btn btn-primary">Submit Review</button>
    </form>
  );
};