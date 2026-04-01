import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SuccessOverlay = ({ isOpen, onClose }) => {
    const { isDark } = useTheme();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                >
                    {/* Backdrop with noise and blur */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 backdrop-blur-2xl ${isDark ? 'bg-black/90' : 'bg-white/90'}`}
                    />
                    
                    {/* Animated background patterns */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                        <div className={`absolute top-0 left-0 w-full h-full ${isDark ? 'grid-background' : 'grid-background-dark'}`} />
                    </div>

                    {/* Content Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.1, opacity: 0, y: -20 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20 
                        }}
                        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center"
                    >
                        {/* Animated Icon Circle */}
                        <motion.div
                            initial={{ rotate: -90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center mb-10 border-2 ${isDark ? 'border-white bg-white/5' : 'border-black bg-black/5'}`}
                        >
                            <Check size={48} className={isDark ? 'text-white' : 'text-black'} strokeWidth={3} />
                        </motion.div>

                        {/* Text Content */}
                        <div className="space-y-4 mb-16">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`text-[10px] font-mono uppercase tracking-[0.6em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
                            >
                                Security Clearance: Granted
                            </motion.span>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className={`text-6xl sm:text-8xl font-display font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}
                            >
                                Big Thank You.
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className={`text-base font-medium max-w-md mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
                            >
                                Your message has been encrypted and transmitted successfully into the SAMSON_OS vault.
                            </motion.p>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                        >
                            <button
                                onClick={onClose}
                                className={`group relative px-10 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 overflow-hidden ${
                                    isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                                }`}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Return to Reality <ArrowRight size={14} />
                                </span>
                            </button>
                        </motion.div>

                        {/* Bottom Status Code */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 1.2 }}
                            className={`mt-20 font-mono text-[8px] uppercase tracking-[0.4em] ${isDark ? 'text-white' : 'text-black'}`}
                        >
                            Status: OK_TRANSMISSION_200 // SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                        </motion.div>
                    </motion.div>

                    {/* Glitch Decorative Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div 
                            animate={{ 
                                y: ["0%", "100%", "0%"],
                                opacity: [0, 0.2, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className={`w-full h-px ${isDark ? 'bg-white' : 'bg-black'}`}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessOverlay;
