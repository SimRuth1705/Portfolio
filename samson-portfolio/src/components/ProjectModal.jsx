import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Cpu, TrendingUp, Github, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ProjectModal = ({ project, isOpen, onClose }) => {
    const { isDark } = useTheme();

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => { 
            document.body.style.overflow = ''; 
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    if (!project) return null;

    const sections = [
        {
            icon: <AlertTriangle size={16} />,
            label: 'The Problem',
            code: 'CHALLENGE_BRIEF',
            content: project.problem || 'No details available.',
        },
        {
            icon: <Cpu size={16} />,
            label: 'The Tech Choice',
            code: 'STACK_RATIONALE',
            content: project.tech_choice || 'No details available.',
        },
        {
            icon: <TrendingUp size={16} />,
            label: 'The Outcome',
            code: 'IMPACT_METRICS',
            content: project.outcome || 'No details available.',
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal — expands from project card via layoutId */}
                    <motion.div
                        layoutId={`project-card-${project.id}`}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed top-20 bottom-4 left-4 right-4 md:top-20 md:bottom-10 md:left-10 md:right-10 lg:top-20 lg:bottom-16 lg:left-16 lg:right-16 z-[80] overflow-hidden border ${isDark
                                ? 'bg-[#0a0a0a] border-white/10 text-white'
                                : 'bg-white border-black/10 text-black'
                            }`}
                    >
                        {/* Integrated flowing border SVG - Fixed to the frame */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <svg className="w-full h-full">
                                <rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="none"
                                    stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                                    strokeWidth="1"
                                />
                                <motion.rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="none"
                                    stroke={isDark ? "white" : "black"}
                                    strokeWidth="1"
                                    strokeLinecap="square"
                                    initial={{ pathLength: 0.2, pathOffset: 0, opacity: 0 }}
                                    animate={{ 
                                        pathOffset: [0, 1],
                                        opacity: [0.2, 0.5, 0.2]
                                    }}
                                    transition={{ 
                                        pathOffset: { duration: 4, repeat: Infinity, ease: "linear" },
                                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    style={{
                                        filter: isDark ? 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' : 'none'
                                    }}
                                />
                            </svg>
                            <div className={`absolute inset-[1px] ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}  style={{ zIndex: -1 }} />
                        </div>

                        {/* Close button - Fixed to the frame */}
                        <button
                            onClick={onClose}
                            className={`absolute top-6 right-6 z-30 w-10 h-10 border flex items-center justify-center transition-all duration-300 group ${isDark
                                    ? 'border-white/10 hover:border-white/40 hover:bg-white/5'
                                    : 'border-black/10 hover:border-black/40 hover:bg-black/5'
                                }`}
                        >
                            <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Scrollable Area strictly for content */}
                        <div className="absolute inset-0 overflow-y-auto scrollbar-none z-10 p-8 md:p-16">
                            <div className="relative">
                                {/* Header */}
                                <div className="mb-16">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                                        <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                            Command Center — Project Deep Dive
                                        </span>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="text-5xl md:text-8xl font-display font-black uppercase tracking-tight mb-6"
                                    >
                                        {project?.title || "Untitled Project"}
                                    </motion.h2>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex flex-wrap gap-3 mb-8"
                                    >
                                        <span className={`text-[9px] font-mono uppercase tracking-widest border px-3 py-1.5 ${isDark ? 'border-white/10 text-zinc-400' : 'border-black/10 text-zinc-500'
                                            }`}>
                                            {project?.category || "Project"}
                                        </span>
                                        {(project?.tech || project?.tags || []).map(t => (
                                            <span key={t} className={`text-[9px] font-mono uppercase tracking-widest border px-3 py-1.5 ${isDark ? 'border-white/5 text-zinc-600' : 'border-black/5 text-zinc-400'
                                                }`}>
                                                {t}
                                            </span>
                                        ))}
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className={`text-lg md:text-xl font-display font-light max-w-2xl ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
                                    >
                                        {project?.description || "No description available."}
                                    </motion.p>
                                </div>

                                {/* Detail Sections */}
                                <div className="grid grid-cols-1 gap-0">
                                    {sections.map((section, idx) => (
                                        <motion.div
                                            key={section.code}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + idx * 0.15, duration: 0.6 }}
                                            className={`border-t py-12 md:py-16 group ${isDark ? 'border-white/5' : 'border-black/5'}`}
                                        >
                                            <div className="grid md:grid-cols-12 gap-8">
                                                <div className="md:col-span-4 flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`${isDark ? 'text-zinc-600 group-hover:text-white' : 'text-zinc-400 group-hover:text-black'} transition-colors duration-300`}>
                                                            {section.icon}
                                                        </span>
                                                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] ${isDark ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors duration-300`}>
                                                            {section.label}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[8px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-800' : 'text-zinc-300'}`}>
                                                        {section.code}
                                                    </span>
                                                </div>
                                                <div className="md:col-span-8">
                                                    <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-600'} transition-colors duration-300`}>
                                                        {section.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer Actions */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className={`border-t pt-12 mt-4 flex flex-col sm:flex-row gap-6 ${isDark ? 'border-white/5' : 'border-black/5'}`}
                                >
                                    {project?.github_url && (
                                      <a
                                          href={project.github_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center justify-center gap-3 border px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 group ${isDark
                                                  ? 'border-white/10 hover:bg-white hover:text-black hover:border-white'
                                                  : 'border-black/10 hover:bg-black hover:text-white hover:border-black'
                                              }`}
                                      >
                                          <Github size={14} className="group-hover:rotate-12 transition-transform duration-300" />
                                          View Repository
                                          <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                      </a>
                                    )}

                                    {project?.live_url && (
                                      <a
                                          href={project.live_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center justify-center gap-3 border px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 group ${isDark
                                                  ? 'border-white/10 hover:bg-white hover:text-black hover:border-white text-emerald-500 hover:text-black hover:border-emerald-500'
                                                  : 'border-black/10 hover:bg-black hover:text-white hover:border-black text-emerald-600 hover:text-white hover:border-emerald-600'
                                              }`}
                                      >
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          Live Demo
                                          <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                      </a>
                                    )}

                                    <button
                                        onClick={onClose}
                                        className={`flex items-center justify-center gap-3 border px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${isDark
                                                ? 'border-white/5 text-zinc-600 hover:text-white hover:border-white/20'
                                                : 'border-black/5 text-zinc-400 hover:text-black hover:border-black/20'
                                            }`}
                                    >
                                        Close Terminal
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
