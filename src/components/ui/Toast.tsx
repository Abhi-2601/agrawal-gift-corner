import React from "react";
import { Toaster } from "react-hot-toast";

export const Toast: React.FC = () => <Toaster position="bottom-right" toastOptions={{ style: { background: "var(--color-primary)", color: "#fff", borderRadius: "var(--radius-md)" } }} />;