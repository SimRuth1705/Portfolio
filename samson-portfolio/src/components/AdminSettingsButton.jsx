import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Plus,
  FolderOpen,
  Clock,
  MessageSquare,
  Code,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const AdminSettingsButton = ({
  onAddProject,
  onAddTimeline,
  onAddTestimonial,
  onAddDevLog,
}) => {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: FolderOpen,
      label: "Add Project",
      onClick: () => {
        onAddProject?.();
        setIsOpen(false);
      },
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Add Timeline Event",
      onClick: () => {
        onAddTimeline?.();
        setIsOpen(false);
      },
      color: "text-green-500",
    },
    {
      icon: MessageSquare,
      label: "Add Testimonial",
      onClick: () => {
        onAddTestimonial?.();
        setIsOpen(false);
      },
      color: "text-purple-500",
    },
    {
      icon: Code,
      label: "Add Dev Log",
      onClick: () => {
        onAddDevLog?.();
        setIsOpen(false);
      },
      color: "text-orange-500",
    },
    {
      icon: Activity,
      label: "View Transmissions",
      onClick: () => {
        navigate("/transmit");
        setIsOpen(false);
      },
      color: "text-amber-500",
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className="relative flex flex-col gap-3 items-end">
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 border px-4 py-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm ${isDark ? "bg-white/10 border-white/20 hover:bg-white/20 text-white" : "bg-black/10 border-black/20 hover:bg-black/20 text-black"}`}
      >
        <Settings size={16} className="flex-shrink-0" />
        <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap">
          Admin
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`absolute bottom-full right-0 mb-4 w-64 rounded-2xl border shadow-2xl backdrop-blur-sm ${isDark ? "bg-[#050505] border-white/10" : "bg-[#f5f5f0] border-black/10"}`}
            >
              {/* Header */}
              <div
                className={`px-6 py-4 border-b ${isDark ? "border-white/10" : "border-black/10"}`}
              >
                <h3
                  className={`text-sm font-display font-bold ${isDark ? "text-white" : "text-black"}`}
                >
                  Add Content
                </h3>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Choose what you want to add
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={item.onClick}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"} group`}
                    >
                      <div
                        className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon size={16} className={item.color} />
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}
                        >
                          {item.label}
                        </div>
                      </div>
                      <Plus
                        size={14}
                        className={isDark ? "text-zinc-600" : "text-zinc-400"}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className={`px-6 py-3 border-t ${isDark ? "border-white/10" : "border-black/10"}`}
              >
                <p
                  className={`text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  Click outside to close
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettingsButton;
