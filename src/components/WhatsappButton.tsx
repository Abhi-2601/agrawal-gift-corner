import React from "react";
import { MessageCircle } from "lucide-react";

export const WhatsappButton: React.FC<{ phone?: string; message?: string; label?: string }> = ({ phone = "+919876543210", message = "Hello, I have a question about your gifts.", label = "Chat on WhatsApp" }) => {
  const href = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      position: "fixed", bottom: "2rem", right: "2rem", zIndex: 999,
      background: "#25D366", color: "#fff", padding: "0.75rem 1rem", borderRadius: "var(--radius-full)",
      textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem",
      boxShadow: "var(--shadow-lg)", fontFamily: "var(--font-body)", fontSize: "0.9rem"
    }}>
      <MessageCircle size={20} /> {label}
    </a>
  );
};