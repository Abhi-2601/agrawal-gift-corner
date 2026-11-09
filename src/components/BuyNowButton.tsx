import React from "react";

export const BuyNowButton: React.FC<{ loading?: boolean; disabled?: boolean; onClick?: () => void }> = ({ loading, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled || loading} className="btn btn-secondary" style={{ width: "100%", padding: "0.75rem" }}>
    {loading ? "Processing..." : "Buy Now"}
  </button>
);