import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={toggleTheme}
      className={`fixed bottom-8 right-8 z-[9999] w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-500 group ${
        isDark
          ? "bg-zinc-900 border-white/20 hover:bg-zinc-800 hover:border-white/40 text-white shadow-black/50"
          : "bg-white border-black/20 hover:bg-zinc-100 hover:border-black/40 text-black shadow-black/20"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun
              size={20}
              className="group-hover:rotate-45 transition-transform duration-500"
            />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon
              size={20}
              className="group-hover:-rotate-12 transition-transform duration-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow ring */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isDark
            ? "shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            : "shadow-[0_0_20px_rgba(0,0,0,0.1)]"
        }`}
      />

      {/* Label tooltip */}
      <span
        className={`absolute right-full mr-4 text-[9px] font-mono uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDark ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
