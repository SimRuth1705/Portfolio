import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  GraduationCap,
  Rocket,
  FolderGit2,
  Briefcase,
  Trash2,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import Editable from "./Editable";
import { API_BASE } from "../constants";

const typeIcons = {
  education: GraduationCap,
  milestone: Rocket,
  project: FolderGit2,
  internship: Briefcase,
};

const TimelineItem = ({ event, index, isDark, isAdmin, onDelete }) => {
  const isLeft = index % 2 === 0;
  const Icon = typeIcons[event.type] || Rocket;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className={`relative flex items-start mb-16 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Dot on timeline */}
      <div
        className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 border-2 rounded-full z-10 mt-2 ${isDark ? "border-white/40 bg-[#050505]" : "border-black/40 bg-[#f5f5f0]"}`}
      />

      {/* Content */}
      <div
        className={`ml-16 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16"}`}
      >
        <div
          className={`group border p-6 md:p-8 transition-all duration-500 ${isDark ? "border-white/5 hover:border-white/20 hover:bg-white/[0.02]" : "border-black/5 hover:border-black/20 hover:bg-black/[0.02]"}`}
        >
          {/* Year badge */}
          <div
            className={`flex items-center gap-2 mb-3 ${isLeft ? "md:justify-end" : ""}`}
          >
            <Icon
              size={14}
              className={`${isDark ? "text-zinc-600 group-hover:text-white" : "text-zinc-400 group-hover:text-black"} transition-colors duration-300`}
            />
            <span
              className={`text-[10px] font-mono uppercase tracking-[0.4em] ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
            >
              {event.year}
            </span>
          </div>

          <h3
            className={`text-lg md:text-xl font-display font-black mb-3 transition-colors duration-300 ${isDark ? "text-white group-hover:text-white" : "text-black"}`}
          >
            {event.title}
          </h3>

          <p
            className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? "text-zinc-500 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-600"}`}
          >
            {event.description}
          </p>

          {/* Admin Controls */}
          {isAdmin && (
            <div
              className={`flex gap-2 mt-4 ${isLeft ? "md:justify-end" : ""}`}
            >
              <button
                onClick={onDelete}
                className={`p-2 rounded transition-all duration-300 ${isDark ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                title="Delete item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const { showConfirm } = useDialog();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/timeline`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading timeline:", err);
      setError("Failed to load timeline");
    } finally {
      setLoading(false);
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    loadTimeline();
    const handleRefresh = () => loadTimeline();
    window.addEventListener('content-updated', handleRefresh);
    return () => window.removeEventListener('content-updated', handleRefresh);
  }, []);

  const handleDeleteTimelineItem = async (itemId) => {
    const confirmed = await showConfirm("Delete this event?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/timeline/${itemId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const sortedEvents = [...items].sort((a, b) => b.year.localeCompare(a.year));

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className={`relative py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b overflow-hidden transition-colors duration-700 ${isDark ? "border-white/20" : "border-black/10"}`}
    >
      <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
        [ 04. JOURNEY ]
      </span>

      <div className="max-w-[1400px] mx-auto mt-10">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 1, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className={`h-px w-8 ${isDark ? "bg-white/20" : "bg-black/20"}`} />
            <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              <Editable id="timeline_status" defaultContent="System History" />
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? "text-white" : "text-black"}`}
          >
            <Editable id="timeline_title" defaultContent="Timeline" />
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`h-px mt-6 ${isDark ? "bg-gradient-to-r from-white/40 via-white/10 to-transparent" : "bg-gradient-to-r from-black/40 via-black/10 to-transparent"}`}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? "border-white" : "border-black"}`} />
          </div>
        ) : (
          <div className="relative">
            {/* Background Line */}
            <div className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />

            {/* Animated Progress Line */}
            <motion.div
              style={{ scaleY: pathLength }}
              className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-px origin-top z-1 ${isDark ? "bg-white/40" : "bg-black/40"}`}
            />

            <div className="space-y-24 md:space-y-40">
              {sortedEvents.map((event, index) => (
                <TimelineItem
                  key={event.id || index}
                  event={event}
                  index={index}
                  isDark={isDark}
                  isAdmin={isAdmin}
                  onDelete={() => handleDeleteTimelineItem(event.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;
