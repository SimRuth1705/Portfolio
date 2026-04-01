import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Editable from './Editable';
import heroImg from '../assets/hero.jpeg';
import { Phone, Mail, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import TextReveal from './TextReveal';

const Hero = () => {
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yBg = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(heroScroll, [0, 0.8], [1, 0]);
    const skewHero = useTransform(heroScroll, [0, 0.5], [0, 5]);
    const { isDark } = useTheme();

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    return (
        <section
            ref={heroRef}
            id="home"
            className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 border-b overflow-hidden transition-colors duration-700 ${isDark ? 'border-white/20' : 'border-black/10'}`}
        >
            {/* Ambient Background Elements (Static for Performance) */}
            <div
                className={`absolute top-1/4 left-1/4 w-96 h-96 blur-[150px] rounded-full mix-blend-screen pointer-events-none opacity-50 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
            />
            <div
                className={`absolute bottom-1/4 right-1/4 w-64 h-64 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-50 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
            />

            <motion.div style={{ y: yBg, opacity: opacityHero }} className="w-full max-w-[1400px] grid md:grid-cols-2 gap-12 lg:gap-20 items-center mt-24 md:mt-0 relative z-10">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    {/* System Badge */}
                    <motion.div
                        variants={fadeInUp}
                        className={`text-[10px] font-mono mb-6 group cursor-default w-max transition-colors duration-700 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
                    >
                        <span className={`transition-all duration-500 ${isDark ? 'group-hover:text-white group-hover:tracking-widest' : 'group-hover:text-black group-hover:tracking-widest'}`}>
                            [ <Editable id="hero_badge" defaultContent="SYS.READY" /> ]
                        </span>
                    </motion.div>

                    {/* Name */}
                    <div className="mb-6 relative z-20">
                        <TextReveal
                            text="SAMSON"
                            flexWrap={false}
                            className={`whitespace-nowrap text-[clamp(2.2rem,8vw,8rem)] font-display font-black tracking-tighter leading-[0.9] uppercase ${isDark ? 'text-white' : 'text-black'}`}
                            delay={0.2}
                        />
                        <TextReveal
                            text="RAJ N."
                            flexWrap={false}
                            className={`whitespace-nowrap text-[clamp(2.2rem,8vw,8rem)] font-display font-black tracking-tighter leading-[0.9] uppercase ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
                            delay={0.5}
                        />
                    </div>

                    {/* Animated separator line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "96px" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className={`h-px mb-8 transition-all duration-500 ${isDark ? 'bg-white/30 hover:bg-white/60 hover:w-48' : 'bg-black/30 hover:bg-black/60 hover:w-48'}`}
                    />

                    {/* Role Tag */}
                    <motion.p variants={fadeInUp} className={`font-mono text-xs md:text-sm tracking-[0.4em] uppercase mb-8 transition-all duration-500 cursor-default w-max ${isDark ? 'text-zinc-400 hover:text-white hover:tracking-[0.5em]' : 'text-zinc-500 hover:text-black hover:tracking-[0.5em]'}`}>
                        <Editable id="hero_role" defaultContent="Developer × Problem Solver" />
                    </motion.p>

                    {/* Contact Pill Row */}
                    <motion.div variants={staggerContainer} className="flex flex-wrap gap-4 mt-4">
                        <motion.a
                            variants={fadeInUp}
                            href="tel:+918825470047"
                            className={`flex items-center gap-2 text-[11px] font-mono border px-4 py-2 transition-all duration-300 group ${isDark ? 'text-zinc-500 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/5' : 'text-zinc-500 border-black/10 hover:border-black/40 hover:text-black hover:bg-black/5'}`}
                        >
                            <Phone size={12} className="group-hover:scale-125 transition-transform duration-300" />
                            +91 88254 70047
                        </motion.a>
                        <motion.a
                            variants={fadeInUp}
                            href="mailto:samsonraj74@gmail.com"
                            className={`flex items-center gap-2 text-[11px] font-mono border px-4 py-2 transition-all duration-300 group ${isDark ? 'text-zinc-500 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/5' : 'text-zinc-500 border-black/10 hover:border-black/40 hover:text-black hover:bg-black/5'}`}
                        >
                            <Mail size={12} className="group-hover:scale-125 transition-transform duration-300" />
                            samsonraj74@gmail.com
                        </motion.a>
                        <motion.a
                            variants={fadeInUp}
                            href="https://x.com/raj_samson52595"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-[11px] font-mono border px-4 py-2 transition-all duration-300 group ${isDark ? 'text-zinc-500 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/5' : 'text-zinc-500 border-black/10 hover:border-black/40 hover:text-black hover:bg-black/5'}`}
                        >
                            <Twitter size={12} className="group-hover:scale-125 transition-transform duration-300" />
                            Twitter
                        </motion.a>
                        <motion.a
                            variants={fadeInUp}
                            href="https://www.linkedin.com/in/samsonrajn1706"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-[11px] font-mono border px-4 py-2 transition-all duration-300 group ${isDark ? 'text-zinc-500 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/5' : 'text-zinc-500 border-black/10 hover:border-black/40 hover:text-black hover:bg-black/5'}`}
                        >
                            <Linkedin size={12} className="group-hover:scale-125 transition-transform duration-300" />
                            LinkedIn
                        </motion.a>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex justify-center md:justify-end"
                >
                    <div className={`absolute inset-0 blur-[120px] rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`}></div>
                    <motion.div
                        style={{
                            skewY: skewHero
                        }}
                        className={`relative p-2 border group overflow-hidden transition-colors duration-700 ${isDark ? 'border-white/20 bg-black' : 'border-black/10 bg-white'}`}
                        data-hover="true"
                    >
                        <img src={heroImg} className="w-[clamp(16rem,35vw,28rem)] h-[clamp(16rem,35vw,28rem)] object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Samson Raj N" />
                    </motion.div>
                    <div className={`absolute -bottom-6 -right-6 text-[10px] font-mono hidden md:block cursor-default transition-colors duration-300 ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`}>IMG_SRC_01</div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
