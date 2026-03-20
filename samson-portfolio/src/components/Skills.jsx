import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Plus, X, Edit2, Trash2, Save } from "lucide-react";
import Editable from "./Editable";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import { API_BASE } from "../constants";

// Default skill lists shown before / if DB is empty
const DEFAULT_ROW1 = ["React", "Node.js", "JavaScript", "Python", "MongoDB", "Tailwind CSS"];
const DEFAULT_ROW2 = ["HTML", "CSS", "EJS", "Git", "GitHub", "MySQL", "Express"];

const ROW1_CATEGORY = "Technical Skills Row 1";
const ROW2_CATEGORY = "Technical Skills Row 2";

// A single numbered skill pill
const SkillChip = ({ id, name, index, isDark, row, isAdmin, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.5 }}
    className="relative group"
  >
    <span
      className={`inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] border px-6 py-3 mx-4 transition-all duration-300 cursor-default whitespace-nowrap ${isDark
        ? "text-zinc-500 border-white/10 hover:text-white hover:border-white/40 hover:bg-white/5 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        : "text-zinc-400 border-black/10 hover:text-black hover:border-black/40 hover:bg-black/5 hover:drop-shadow-[0_0_12px_rgba(0,0,0,0.15)]"
        }`}
    >
      <span className={`text-[9px] ${isDark ? "text-zinc-700" : "text-zinc-300"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      {name}
    </span>
    {/* Admin controls omitted for brevity here, but should be kept in real implementation */}

    {isAdmin && (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(id, name)}
          className={`p-1 rounded transition-colors ${isDark ? "hover:bg-blue-500/20 text-blue-500" : "hover:bg-blue-500/20 text-blue-600"}`}
          title="Edit skill"
        >
          <Edit2 size={10} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(id)}
          className={`p-1 rounded transition-colors ${isDark ? "hover:bg-red-500/20 text-red-500" : "hover:bg-red-500/20 text-red-600"}`}
          title="Delete skill"
        >
          <Trash2 size={10} />
        </motion.button>
      </div>
    )}
  </motion.div>
);

// A single carousel track — forward or reverse
const InfiniteRow = ({ items, reverse = false, speed, isDark, row, isAdmin, onEdit, onDelete }) => {
  const animClass = reverse ? "row-scroll-reverse" : "row-scroll-forward";
  return (
    <div className={`flex whitespace-nowrap ${animClass}`} style={{ animationDuration: `${speed}s` }}>
      {[...Array(3)].map((_, i) =>
        items.map((skill, j) => (
          <SkillChip
            key={`${i}-${skill.id || j}`}
            id={skill.id}
            name={skill.name}
            index={j}
            isDark={isDark}
            row={row}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )),
      )}
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const { showAlert, showConfirm } = useDialog();

  const [row1Skills, setRow1Skills] = useState(DEFAULT_ROW1.map((name, i) => ({ id: `def1-${i}`, name })));
  const [row2Skills, setRow2Skills] = useState(DEFAULT_ROW2.map((name, i) => ({ id: `def2-${i}`, name })));
  const [isAdding, setIsAdding] = useState({ row1: false, row2: false });
  const [newSkills, setNewSkills] = useState({ row1: "", row2: "" });
  const [editingSkill, setEditingSkill] = useState(null); // { id, name, row }
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Load skills from DB, separated by category
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/skills`);
        if (res.ok) {
          const dbSkills = await res.json();
          if (!ignore) {
            const r1 = dbSkills.filter(s => s.category === ROW1_CATEGORY).map(s => ({ id: s.id, name: s.name }));
            const r2 = dbSkills.filter(s => s.category === ROW2_CATEGORY).map(s => ({ id: s.id, name: s.name }));
            // Fall back to defaults if DB is empty for a row
            setRow1Skills(r1.length > 0 ? r1 : DEFAULT_ROW1.map((name, i) => ({ id: `def1-${i}`, name })));
            setRow2Skills(r2.length > 0 ? r2 : DEFAULT_ROW2.map((name, i) => ({ id: `def2-${i}`, name })));
          }
        }
      } catch (err) {
        if (!ignore) console.error("Error loading skills:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, []);


  const handleAddSkill = async (row, name) => {
    if (!name.trim()) return;
    const category = row === "row1" ? ROW1_CATEGORY : ROW2_CATEGORY;
    try {
      const res = await fetch(`${API_BASE}/api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim(), category }),
      });
      if (res.ok) {
        const newSkill = await res.json();
        const skillObj = { id: newSkill.id, name: newSkill.name };
        if (row === "row1") setRow1Skills(prev => [...prev, skillObj]);
        else setRow2Skills(prev => [...prev, skillObj]);
        setIsAdding(prev => ({ ...prev, [row]: false }));
        setNewSkills(prev => ({ ...prev, [row]: "" }));
      }
    } catch (err) { console.error("Error adding skill:", err); }
  };

  const handleDeleteSkill = async (row, skillId) => {
    if (skillId.startsWith('def')) {
      // Local only delete for default skills
      if (row === "row1") setRow1Skills(prev => prev.filter(s => s.id !== skillId));
      else setRow2Skills(prev => prev.filter(s => s.id !== skillId));
      return;
    }
    const confirmed = await showConfirm("Are you sure you want to delete this skill?");
    if (!confirmed) return;

    try {
      const del = await fetch(`${API_BASE}/api/skills/${skillId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (del.ok) {
        if (row === "row1") setRow1Skills(prev => prev.filter(s => s.id !== skillId));
        else setRow2Skills(prev => prev.filter(s => s.id !== skillId));
      } else {
        showAlert("Failed to delete skill. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting skill:", err);
      showAlert("An error occurred while deleting the skill.");
    }
  };

  const handleSaveEdit = async (value) => {
    if (!editingSkill || !value.trim()) return;
    const { id, row } = editingSkill;
    const category = row === "row1" ? ROW1_CATEGORY : ROW2_CATEGORY;

    if (id.startsWith('def')) {
      // Local only update for default skills
      const updater = prev => prev.map(s => s.id === id ? { ...s, name: value.trim() } : s);
      if (row === "row1") setRow1Skills(updater);
      else setRow2Skills(updater);
      setEditingSkill(null);
      setEditValue("");
      return;
    }

    try {
      const upd = await fetch(`${API_BASE}/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ name: value.trim(), category }),
      });
      if (upd.ok) {
        const updater = prev => prev.map(s => s.id === id ? { ...s, name: value.trim() } : s);
        if (row === "row1") setRow1Skills(updater);
        else setRow2Skills(updater);
      }
    } catch (err) { console.error("Error updating skill:", err); }
    finally {
      setEditingSkill(null);
      setEditValue("");
    }
  };

  const renderAddButton = (row) => (
    <div className="absolute top-0 right-0 z-20 flex items-center gap-2 p-2">
      {!isAdding[row] ? (
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(prev => ({ ...prev, [row]: true }))}
          className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? "border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-500 hover:text-white" : "border-black/10 hover:border-black/20 hover:bg-black/5 text-zinc-400 hover:text-black"}`}
          title={`Add skill to ${row}`}
        >
          <Plus size={14} />
        </motion.button>
      ) : (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleAddSkill(row, newSkills[row])}
            className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? "border-green-500/20 hover:bg-green-500/10 text-green-500" : "border-green-500/20 hover:bg-green-500/10 text-green-600"}`}
            title="Save"
          >
            <Save size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setIsAdding(prev => ({ ...prev, [row]: false })); setNewSkills(prev => ({ ...prev, [row]: "" })); }}
            className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? "border-red-500/20 hover:bg-red-500/10 text-red-500" : "border-red-500/20 hover:bg-red-500/10 text-red-600"}`}
            title="Cancel"
          >
            <X size={14} />
          </motion.button>
        </div>
      )}
    </div>
  );

  const renderAddInput = (row) => (
    <AnimatePresence>
      {isAdding[row] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="absolute top-0 left-0 z-30"
        >
          <input
            type="text"
            value={newSkills[row] || ""}
            onChange={(e) => setNewSkills(prev => ({ ...prev, [row]: e.target.value }))}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(row, e.target.value); }}
            placeholder={`New skill for ${row}...`}
            className={`font-mono text-xs uppercase tracking-[0.3em] border px-6 py-3 mx-4 transition-all duration-300 ${isDark ? "text-white border-white/10 bg-white/5 focus:border-white/40" : "text-black border-black/10 bg-black/5 focus:border-black/40"} focus:outline-none`}
            autoFocus
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  const xParallax1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const xParallax2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <motion.section
      ref={sectionRef}
      id="skills"
      style={{ opacity }}
      className={`relative py-20 border-b overflow-hidden transition-colors duration-700 ${isDark ? "border-white/20" : "border-black/10"}`}
    >
      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
        }}
        className="px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto mb-12 md:mb-16"
      >
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex items-center gap-3"
            >
              <div className={`h-px w-8 ${isDark ? "bg-white/20" : "bg-black/20"}`} />
              <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                [ 02. ENGINE ]
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                <Editable id="skills_status" defaultContent="Engine Capabilities" />
              </span>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? "text-white" : "text-black"}`}
            >
              <Editable id="skills_title" defaultContent="SKILLS" />
            </motion.h2>
          </div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className="hidden md:block"
          >
            <p className={`text-[9px] font-mono uppercase tracking-[0.3em] mb-4 ${isDark ? "text-zinc-700" : "text-zinc-300"}`}>
              <Editable id="skills_hint" defaultContent="Interactive Stream v1.0" />
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Row 1 */}
      <div className="relative mb-8">
        {isAdmin && renderAddButton("row1")}
        {isAdmin && renderAddInput("row1")}
        <motion.div style={{ x: xParallax1 }} className="overflow-hidden py-2">
          <InfiniteRow
            items={row1Skills} reverse={false} speed={40} isDark={isDark} row="row1"
            isAdmin={isAdmin}
            onEdit={(id, name) => { setEditingSkill({ id, name, row: "row1" }); setEditValue(name); }}
            onDelete={(id) => handleDeleteSkill("row1", id)}
          />
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="relative">
        {isAdmin && renderAddButton("row2")}
        {isAdmin && renderAddInput("row2")}
        <motion.div style={{ x: xParallax2 }} className="overflow-hidden py-2">
          <InfiniteRow
            items={row2Skills} reverse={true} speed={55} isDark={isDark} row="row2"
            isAdmin={isAdmin}
            onEdit={(id, name) => { setEditingSkill({ id, name, row: "row2" }); setEditValue(name); }}
            onDelete={(id) => handleDeleteSkill("row2", id)}
          />
        </motion.div>
      </div>

      {/* Edit modal overlay */}
      <AnimatePresence>
        {editingSkill && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => { setEditingSkill(null); setEditValue(""); }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className={`p-8 border flex flex-col gap-4 ${isDark ? "bg-[#050505] border-white/10" : "bg-[#f5f5f0] border-black/10"}`}
            >
              <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Edit Skill</p>
              <input
                type="text" value={editValue} autoFocus
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(editValue); if (e.key === "Escape") { setEditingSkill(null); setEditValue(""); } }}
                className={`font-mono text-sm uppercase tracking-widest border px-4 py-3 bg-transparent focus:outline-none ${isDark ? "border-white/20 text-white focus:border-white/40" : "border-black/20 text-black focus:border-black/40"}`}
              />
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSaveEdit(editValue)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-mono uppercase tracking-widest">
                  <Save size={12} /> Save
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditingSkill(null); setEditValue(""); }} className={`flex items-center gap-2 px-4 py-2 border text-xs font-mono uppercase tracking-widest ${isDark ? "border-white/20 text-white" : "border-black/20 text-black"}`}>
                  <X size={12} /> Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge fade masks */}
      <div className={`absolute inset-y-0 left-0 w-40 pointer-events-none z-10 ${isDark ? "bg-gradient-to-r from-[#050505] to-transparent" : "bg-gradient-to-r from-[#f5f5f0] to-transparent"}`} />
      <div className={`absolute inset-y-0 right-0 w-40 pointer-events-none z-10 ${isDark ? "bg-gradient-to-l from-[#050505] to-transparent" : "bg-gradient-to-l from-[#f5f5f0] to-transparent"}`} />
    </motion.section>
  );
};

export default Skills;
