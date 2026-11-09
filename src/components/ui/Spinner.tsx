import React from "react";

export const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <div style={{ width: size, height: size, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "var(--color-secondary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
);