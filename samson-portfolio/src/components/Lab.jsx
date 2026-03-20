import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Editable from './Editable';

const experiments = [
    {
        id: 1,
        title: 'Glassmorphism Card',
        description: 'A pure CSS glassmorphism card with animated gradient border and frosted backdrop.',
        tags: ['CSS', 'Animation'],
        color: 'from-purple-500/20 to-blue-500/20',
    },
    {
        id: 2,
        title: 'Infinite Marquee',
        description: 'Smooth infinite scroll text ticker using CSS keyframes. Zero JavaScript.',
        tags: ['CSS', 'Keyframes'],
        color: 'from-green-500/20 to-emerald-500/20',
    },
    {
        id: 3,
        title: 'Magnetic Cursor',
        description: 'Physics-based cursor follower that magnetically attracts to interactive elements.',
        tags: ['Framer Motion', 'React'],
        color: 'from-orange-500/20 to-red-500/20',
    },
    {
        id: 4,
        title: 'Noise Grain Overlay',
        description: 'SVG-based film grain effect that adds analog texture to modern web designs.',
        tags: ['SVG', 'CSS'],
        color: 'from-pink-500/20 to-fuchsia-500/20',
    },
];

const Lab = () => {
    const { isDark } = useTheme();

    return (
        <section id="lab" className={`py-28 sm:py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b relative transition-colors duration-700 ${isDark ? 'border-white/20' : 'border-black/10'}`}>
            <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>[ 07. LAB ]</span>

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
                            <Editable id="lab_status" defaultContent="Experimental Zone" />
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? 'text-white' : 'text-black'}`}
                    >
                        <Editable id="lab_title" defaultContent="THE LAB" />
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-px mt-6 ${isDark ? 'bg-gradient-to-r from-white/40 via-white/10 to-transparent' : 'bg-gradient-to-r from-black/40 via-black/10 to-transparent'}`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {experiments.map((exp, idx) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className={`group relative border p-6 transition-all duration-500 cursor-pointer overflow-hidden ${isDark ? 'border-white/5 hover:border-white/20' : 'border-black/5 hover:border-black/20'}`}
                        >
                            {/* Gradient glow on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <Sparkles size={16} className={`${isDark ? 'text-zinc-700 group-hover:text-white' : 'text-zinc-300 group-hover:text-black'} transition-colors duration-300`} />
                                    <ExternalLink size={12} className={`opacity-0 group-hover:opacity-100 ${isDark ? 'text-zinc-500' : 'text-zinc-400'} transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
                                </div>

                                <h3 className={`text-base font-display font-black mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                                    <Editable id={`lab_${exp.id}_title`} defaultContent={exp.title} />
                                </h3>

                                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors duration-300`}>
                                    <Editable id={`lab_${exp.id}_desc`} defaultContent={exp.description} />
                                </p>

                                <div className="flex gap-2">
                                    {exp.tags.map(tag => (
                                        <span key={tag} className={`text-[7px] font-mono uppercase tracking-widest border px-2 py-0.5 ${isDark ? 'border-white/5 text-zinc-600' : 'border-black/5 text-zinc-400'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Lab;
