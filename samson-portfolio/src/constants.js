// This file previously contained hardcoded data.
// All data is now fetched from the backend API.
// Keeping this file for potential future constants or configuration.

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5006";

// Animation constants
export const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 1.0,
};

// Theme constants
export const THEME_COLORS = {
  DARK: {
    background: "#050505",
    text: "#ffffff",
    border: "rgba(255, 255, 255, 0.1)",
  },
  LIGHT: {
    background: "#f5f5f0",
    text: "#000000",
    border: "rgba(0, 0, 0, 0.1)",
  },
};
