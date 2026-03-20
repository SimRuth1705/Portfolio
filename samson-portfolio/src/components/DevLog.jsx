import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Calendar,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import Editable from "./Editable";
import { API_BASE } from "../constants";

const LogCard = ({ log, index, isDark, isAdmin, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className={`group border p-8 transition-all duration-500 relative overflow-hidden ${isDark ? "border-white/5 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-black/5 hover:border-black/20 hover:bg-black/[0.04] hover:shadow-[0_0_30px_rgba(0,0,0,0.02)]"}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Terminal size={12} className={isDark ? "text-zinc-700 group-hover:text-green-400" : "text-zinc-300 group-hover:text-green-600"} />
        <span className={`text-[9px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-700 group-hover:text-green-400/60" : "text-zinc-300 group-hover:text-green-600/60"}`}>
          ~/devlog
        </span>
        <span className={`text-[9px] font-mono ml-auto flex items-center gap-1 ${isDark ? "text-zinc-700" : "text-zinc-300"}`}>
          <Calendar size={10} />
          {log.created_at ? new Date(log.created_at).toLocaleDateString() : "—"}
        </span>
      </div>

      <h3 className={`text-base md:text-lg font-display font-black mb-3 ${isDark ? "text-white" : "text-black"}`}>
        {log.title}
      </h3>

      <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
        {log.snippet}
      </p>

      <div className="flex flex-wrap gap-2">
        {log.tags && log.tags.map((tag) => (
          <span key={tag} className={`text-[8px] font-mono uppercase border px-2 py-1 ${isDark ? "border-white/5 text-zinc-600" : "border-black/5 text-zinc-400"}`}>
            <Tag size={8} className="inline mr-1" />
            {tag}
          </span>
        ))}
      </div>

      {isAdmin && (
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(log.id)}
            className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

const DevLog = () => {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const { showConfirm } = useDialog();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/devlogs`);
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const handleRefresh = () => loadLogs();
    window.addEventListener('content-updated', handleRefresh);
    return () => window.removeEventListener('content-updated', handleRefresh);
  }, []);

  const handleDeleteDevLog = async (logId) => {
    const confirmed = await showConfirm("Delete this log?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/devlogs/${logId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        setLogs(prev => prev.filter(log => log.id !== logId));
      }
    } catch (err) {
      console.error("Error deleting log:", err);
    }
  };

  return (
    <section ref={sectionRef} id="devlog" className={`relative py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b overflow-hidden transition-colors duration-700 ${isDark ? "border-white/20" : "border-black/10"}`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
            <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
              [ 06. ACTIVITY ]
            </span>
            <div className={`h-px w-8 ${isDark ? "bg-white/20" : "bg-black/20"}`} />
            <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              <Editable id="devlog_status" defaultContent="Dev Stream" />
            </span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? "text-white" : "text-black"}`}>
            <Editable id="devlog_title" defaultContent="DEVLOG" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {logs.map((log, index) => (
              <LogCard
                key={log.id || index}
                log={log}
                index={index}
                isDark={isDark}
                isAdmin={isAdmin}
                onDelete={() => handleDeleteDevLog(log.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DevLog;
