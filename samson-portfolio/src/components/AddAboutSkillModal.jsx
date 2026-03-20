import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AddAboutSkillModal = ({ isOpen, onClose, onSubmit }) => {
    const { isDark } = useTheme();
    const [category, setCategory] = useState("");
    const [items, setItems] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !items) return;
        onSubmit({
            category: category.trim(),
            items: items.split(",").map((i) => i.trim()).filter((i) => i),
        });
        setCategory("");
        setItems("");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? "bg-black/80" : "bg-black/60"}`}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full max-w-md rounded-2xl border p-8 ${isDark ? "bg-[#050505] border-white/10" : "bg-[#f5f5f0] border-black/10"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className={`text-2xl font-display font-black ${isDark ? "text-white" : "text-black"}`}>
                            Add Skill Category
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-full ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-black"}`}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="about-skill-category" className={`text-[10px] font-mono uppercase tracking-widest mb-2 block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                Category
                            </label>
                            <input
                                type="text"
                                id="about-skill-category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Web Technologies"
                                className={`w-full bg-transparent border-b py-2 focus:outline-none transition-colors ${isDark ? "border-white/10 focus:border-white text-white" : "border-black/10 focus:border-black text-black"}`}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label htmlFor="about-skill-items" className={`text-[10px] font-mono uppercase tracking-widest mb-2 mt-6 block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                Skills (Comma separated)
                            </label>
                            <textarea
                                id="about-skill-items"
                                name="items"
                                value={items}
                                onChange={(e) => setItems(e.target.value)}
                                placeholder="React, Node.js, MongoDB"
                                className={`w-full bg-transparent border-b py-2 focus:outline-none transition-colors resize-none ${isDark ? "border-white/10 focus:border-white text-white" : "border-black/10 focus:border-black text-black"}`}
                                rows={3}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-4 font-mono uppercase text-[10px] tracking-[0.4em] transition-all ${isDark ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"}`}
                        >
                            Add Category
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddAboutSkillModal;
