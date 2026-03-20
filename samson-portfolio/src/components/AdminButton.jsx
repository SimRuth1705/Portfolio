import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AdminButton = ({ onClick, label = "Add Item", className = "" }) => {
  const { isDark } = useTheme();

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-8 right-8 z-40 flex items-center gap-2 border px-4 py-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm ${isDark ? "bg-white/10 border-white/20 hover:bg-white/20 text-white" : "bg-black/10 border-black/20 hover:bg-black/20 text-black"} ${className}`}
    >
      <Plus size={16} className="flex-shrink-0" />
      <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
    </motion.button>
  );
};

export default AdminButton;
