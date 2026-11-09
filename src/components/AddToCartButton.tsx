import React from "react";

export const AddToCartButton: React.FC<{ loading?: boolean; disabled?: boolean; onClick?: () => void }> = ({ loading, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled || loading} className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
    {loading ? "Adding..." : "Add to Cart"}
  </button>
);