import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Code2, Palette, Terminal, Cpu, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Editable from './Editable';

const specs = [
    { icon: <Monitor size={16} />, label: 'Machine', value: 'Windows 11 — Ryzen 5', id: 'machine' },
    { icon: <Code2 size={16} />, label: 'Editor', value: 'VS Code — Gruvbox Theme', id: 'editor' },
    { icon: <Terminal size={16} />, label: 'Terminal', value: 'Windows Terminal + Git Bash', id: 'terminal' },
    { icon: <Palette size={16} />, label: 'Design', value: 'Figma + Framer', id: 'design' },
    { icon: <Layers size={16} />, label: 'Stack', value: 'React / Node / MongoDB', id: 'stack' },
    { icon: <Cpu size={16} />, label: 'Deploy', value: 'Vercel + Render', id: 'deploy' },
];

const SystemSpecs = () => {
    const { isDark } = useTheme();

    return (
        <section id="specs" className={`py-28 sm:py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b relative transition-colors duration-700 ${isDark ? 'border-white/20' : 'border-black/10'}`}>
            <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>[ 08. SYSTEM ]</span>

            <div className="max-w-[1400px] mx-auto mt-10">
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                        <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            <Editable id="specs_status" defaultContent="Hardware & Software" />
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? 'text-white' : 'text-black'}`}
                    >
                        <Editable id="specs_title" defaultContent="SETUP" />
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-px mt-6 ${isDark ? 'bg-gradient-to-r from-white/40 via-white/10 to-transparent' : 'bg-gradient-to-r from-black/40 via-black/10 to-transparent'}`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                    {specs.map((spec, idx) => (
                        <motion.div
                            key={spec.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className={`group border p-8 transition-all duration-500 ${isDark ? 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]' : 'border-black/5 hover:border-black/20 hover:bg-black/[0.02]'}`}
                        >
                            <div className="flex items-start gap-5">
                                <span className={`mt-1 ${isDark ? 'text-zinc-700 group-hover:text-white' : 'text-zinc-300 group-hover:text-black'} transition-colors duration-300`}>
                                    {spec.icon}
                                </span>
                                <div>
                                    <p className={`text-[9px] font-mono uppercase tracking-[0.4em] mb-2 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                        {spec.label}
                                    </p>
                                    <p className={`text-base font-display font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                                        <Editable id={`spec_${spec.id}`} defaultContent={spec.value} />
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SystemSpecs;
