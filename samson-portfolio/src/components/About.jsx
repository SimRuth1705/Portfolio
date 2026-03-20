import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Code,
  Database,
  GitBranch,
  Trash2,
  Edit2,
  Plus,
  X,
} from "lucide-react";
import Editable from "./Editable";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import { API_BASE } from "../constants";
import AddAboutSkillModal from "./AddAboutSkillModal";
import AddSoftSkillModal from "./AddSoftSkillModal";

const About = () => {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const [skills, setSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddSoftSkillModal, setShowAddSoftSkillModal] = useState(false);

  // Fetch skills data
  useEffect(() => {
    let ignore = false;
    const loadSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch skills from API
        const [skillsRes, softSkillsRes] = await Promise.all([
          fetch(`${API_BASE}/api/about/skills`),
          fetch(`${API_BASE}/api/about/soft-skills`),
        ]);

        if (skillsRes.ok && softSkillsRes.ok) {
          const skillsData = await skillsRes.json();
          const softSkillsData = await softSkillsRes.json();

          if (!ignore) {
            setSkills(skillsData);
            setSoftSkills(softSkillsData);
            setError(null);
          }
        } else {
          throw new Error("Failed to fetch skills data");
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading skills:", err);
          setError(err.message);
          // Fallback to static data
          const staticSkills = [
            {
              id: 1,
              category: "Web Technologies",
              items: ["HTML", "CSS", "EJS"],
            },
            { id: 2, category: "Tools & Platforms", items: ["Git", "GitHub"] },
            {
              id: 3,
              category: "Programming Languages",
              items: ["JavaScript", "Python"],
            },
            { id: 4, category: "For UI Development", items: ["Tailwind"] },
            { id: 5, category: "Database", items: ["MongoDB", "MySQL"] },
          ];

          const staticSoftSkills = [
            {
              id: 1,
              title: "Leadership",
              description:
                "Guiding and motivating others toward a common goal.",
            },
            {
              id: 2,
              title: "Teamwork & Collaboration",
              description: "Working well with others to achieve goals.",
            },
            {
              id: 3,
              title: "Problem Solving",
              description:
                "Analytical thinking and creative solutions to complex challenges.",
            },
            {
              id: 4,
              title: "Excellent Interpersonal and Communication Skills",
              description: "Clear articulation of ideas and active listening.",
            },
            {
              id: 5,
              title: "Excellent Time Management",
              description:
                "Efficient prioritization and meeting deadlines consistently.",
            },
          ];

          setSkills(staticSkills);
          setSoftSkills(staticSoftSkills);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadSkills();
    return () => {
      ignore = true;
    };
  }, [API_BASE]);

  const handleDeleteSkill = async (skillId) => {
    const confirmed = await showConfirm("Are you sure you want to delete this skill category?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/about/skills/${skillId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill.id !== skillId),
        );
      } else {
        showAlert("Failed to delete skill. Please try again.");
      }
    } catch (err) {
      showAlert("Failed to delete skill. Please try again.");
    }
  };

  const handleDeleteSoftSkill = async (skillId) => {
    const confirmed = await showConfirm("Are you sure you want to delete this soft skill?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/about/soft-skills/${skillId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        setSoftSkills((prevSkills) =>
          prevSkills.filter((skill) => skill.id !== skillId),
        );
      } else {
        showAlert("Failed to delete soft skill. Please try again.");
      }
    } catch (err) {
      showAlert("Failed to delete soft skill. Please try again.");
    }
  };

  const handleAddSkill = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/about/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newSkill = await res.json();
        setSkills(prev => [...prev, newSkill]);
        setShowAddSkillModal(false);
      }
    } catch (err) {
      console.error("Failed to add skill:", err);
    }
  };

  const handleAddSoftSkill = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/about/soft-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newSkill = await res.json();
        setSoftSkills(prev => [...prev, newSkill]);
        setShowAddSoftSkillModal(false);
      }
    } catch (err) {
      console.error("Failed to add soft skill:", err);
    }
  };
  const [addingToCategoryId, setAddingToCategoryId] = useState(null);
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = async (groupId) => {
    if (!newItemText.trim()) return;
    const group = skills.find(s => s.id === groupId);
    if (!group) return;

    const updatedItems = [...group.items, newItemText.trim()];
    try {
      const res = await fetch(`${API_BASE}/api/about/skills/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ category: group.category, items: updatedItems }),
      });
      if (res.ok) {
        setSkills(prev => prev.map(s => s.id === groupId ? { ...s, items: updatedItems } : s));
        setAddingToCategoryId(null);
        setNewItemText("");
      }
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDeleteItem = async (groupId, itemToDelete) => {
    const group = skills.find(s => s.id === groupId);
    if (!group) return;

    const updatedItems = group.items.filter(item => item !== itemToDelete);
    try {
      const res = await fetch(`${API_BASE}/api/about/skills/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ category: group.category, items: updatedItems }),
      });
      if (res.ok) {
        setSkills(prev => prev.map(s => s.id === groupId ? { ...s, items: updatedItems } : s));
      } else {
        showAlert("Failed to delete item. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      showAlert("An error occurred while deleting the item.");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <>
      <section id="about" className="min-h-screen relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 py-20 md:py-32">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-left mb-16 md:mb-24"
          >
            <motion.span
              variants={fadeInUp}
              className={`text-[10px] font-mono uppercase tracking-[0.5em] block mb-4 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              <Editable
                id="about_status"
                defaultContent="Personal Background"
              />
            </motion.span>
            <div className="overflow-hidden">
              <motion.h1
                variants={{
                  hidden: { y: "100%" },
                  visible: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black uppercase mb-6 transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}
              >
                <Editable id="about_title" defaultContent="ABOUT" />
              </motion.h1>
            </div>
            <motion.div
              variants={{
                hidden: { width: 0 },
                visible: { width: "120px", transition: { duration: 1.2, delay: 0.5 } }
              }}
              className={`h-px ${isDark ? "bg-white/40" : "bg-black/40"}`}
            />
          </motion.div>

          {/* Biography & Quick Contact */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20 md:mb-32 max-w-4xl"
          >
            <div className={`text-xl md:text-3xl leading-relaxed font-light mb-12 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              <Editable 
                id="about_bio" 
                tagName="p"
                defaultContent="Crafting digital experiences with precision and passion. I specialize in building scalable web applications and intuitive user interfaces that bridge the gap between complex logic and human interaction."
              />
            </div>

            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className={`p-3 rounded-full transition-all duration-300 ${isDark ? "bg-white/5 group-hover:bg-white/10 text-white" : "bg-black/5 group-hover:bg-black/10 text-black"}`}>
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Email</p>
                  <Editable id="about_email" defaultContent="samson@example.com" className="text-sm font-bold tracking-wider" />
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className={`p-3 rounded-full transition-all duration-300 ${isDark ? "bg-white/5 group-hover:bg-white/10 text-white" : "bg-black/5 group-hover:bg-black/10 text-black"}`}>
                  <Phone size={18} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Phone</p>
                  <Editable id="about_phone" defaultContent="+91 98765 43210" className="text-sm font-bold tracking-wider" />
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className={`p-3 rounded-full transition-all duration-300 ${isDark ? "bg-white/5 group-hover:bg-white/10 text-white" : "bg-black/5 group-hover:bg-black/10 text-black"}`}>
                  <MapPin size={18} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Location</p>
                  <Editable id="about_location" defaultContent="Tamil Nadu, India" className="text-sm font-bold tracking-wider" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
          >
            {/* Left Column - Technical Skills */}
            <motion.div variants={fadeInUp} className="space-y-12 text-left">
              {skills.map((skillGroup, groupIdx) => (
                <motion.div
                  key={skillGroup.id}
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className={`text-2xl md:text-3xl font-display font-black transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}
                    >
                      {skillGroup.category}
                    </h2>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAddingToCategoryId(skillGroup.id)}
                          className={`p-2 rounded transition-colors duration-300 ${isDark ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-400" : "bg-green-500/20 text-green-600 hover:bg-green-500/30 hover:text-green-700"}`}
                          title="Add item to this category"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skillGroup.id)}
                          className={`p-2 rounded transition-colors duration-300 ${isDark ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-400" : "bg-red-500/20 text-red-600 hover:bg-red-500/30 hover:text-red-700"}`}
                          title="Delete entire category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {addingToCategoryId === skillGroup.id && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex gap-2">
                      <input
                        type="text"
                        value={newItemText}
                        autoFocus
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddItem(skillGroup.id);
                          if (e.key === "Escape") setAddingToCategoryId(null);
                        }}
                        placeholder="Add skill tag..."
                        className={`flex-grow px-4 py-2 text-sm font-mono border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white/40 border-black/10 text-black focus:border-black/30"} outline-none`}
                      />
                      <button onClick={() => setAddingToCategoryId(null)} className={`px-4 text-xs font-mono uppercase tracking-widest border ${isDark ? "border-white/10 text-zinc-500" : "border-black/10 text-zinc-400"}`}>Cancel</button>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-wrap gap-3"
                  >
                    {skillGroup.items.map((item, idx) => (
                      <motion.span
                        key={`${skillGroup.id}-${item}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        whileHover={{
                          scale: 1.1,
                          rotate: idx % 2 === 0 ? 2 : -2,
                          transition: { duration: 0.2 }
                        }}
                        className={`group/tag relative px-4 py-2 text-sm font-mono border transition-all duration-300 ${isDark ? "border-white/20 text-white/80 bg-white/5 hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "border-black/20 text-black/80 bg-black/5 hover:bg-black/10 hover:border-black/40 hover:shadow-[0_0_20px_rgba(0,0,0,0.05)]"}`}
                      >
                        {item}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteItem(skillGroup.id, item)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/tag:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              ))}

              {isAdmin && (
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className={`w-full py-4 border border-dashed transition-all duration-300 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.3em] ${isDark ? "border-white/10 text-zinc-500 hover:border-white/30 hover:text-white hover:bg-white/5" : "border-black/10 text-zinc-400 hover:border-black/30 hover:text-black hover:bg-black/5"}`}
                >
                  <Plus size={14} /> Add New Category
                </button>
              )}
            </motion.div>

            {/* Right Column - Soft Skills */}
            <motion.div variants={fadeInUp} className="space-y-8 text-left">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl md:text-3xl font-display font-black transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}
                >
                  Soft Skills
                </h2>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddSoftSkillModal(true)}
                      className={`p-2 rounded transition-colors duration-300 ${isDark ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-400" : "bg-green-500/20 text-green-600 hover:bg-green-500/30 hover:text-green-700"}`}
                      title="Add soft skill"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
              <motion.div className="space-y-8">
                {softSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ x: 10, transition: { duration: 0.3 } }}
                    className="relative group border-l-2 border-transparent hover:border-white/20 pl-4 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-display font-bold mb-3 transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}
                        >
                          {skill.title}
                        </h3>
                        <p
                          className={`text-base leading-relaxed transition-colors duration-300 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
                        >
                          {skill.description}
                        </p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteSoftSkill(skill.id)}
                          className={`p-2 rounded transition-colors duration-300 ml-4 ${isDark ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-400" : "bg-red-500/20 text-red-600 hover:bg-red-500/30 hover:text-red-700"}`}
                          title="Delete soft skill"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AddAboutSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        onSubmit={handleAddSkill}
      />
      <AddSoftSkillModal
        isOpen={showAddSoftSkillModal}
        onClose={() => setShowAddSoftSkillModal(false)}
        onSubmit={handleAddSoftSkill}
      />
    </>
  );
};

export default About;
