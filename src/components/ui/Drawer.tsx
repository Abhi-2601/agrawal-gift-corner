import React from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  position?: "left" | "right";
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, position = "right", children }) => (
  <>
    {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} />}
    <aside style={{
      position: "fixed",
      top: 0,
      [position]: 0,
      width: "320px",
      maxWidth: "85vw",
      height: "100vh",
      background: "var(--color-surface)",
      boxShadow: position === "left" ? "2px 0 15px rgba(0,0,0,0.1)" : "-2px 0 15px rgba(0,0,0,0.1)",
      zIndex: 200,
      transform: open ? "translateX(0)" : `translateX(${position === "left" ? "-100%" : "100%"})`,
      transition: "transform 0.3s ease",
      padding: "1.5rem",
      overflowY: "auto"
    }}>
      <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", float: "right" }}>&times;</button>
      <div style={{ clear: "both", paddingTop: "1rem" }}>{children}</div>
    </aside>
  </>
);