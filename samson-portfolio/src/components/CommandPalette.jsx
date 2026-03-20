import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const COMMANDS = [
    { label: 'About', section: 'about', description: 'Jump to About section', shortcut: '01' },
    { label: 'Skills', section: 'skills', description: 'Jump to Skills section', shortcut: '02' },
    { label: 'Projects', section: 'projects', description: 'Jump to Projects section', shortcut: '03' },
    { label: 'Experience', section: 'timeline', description: 'Jump to Timeline section', shortcut: '04' },
    { label: 'Testimonials', section: 'testimonials', description: 'Jump to Voices section', shortcut: '05' },
    { label: 'Dev Log', section: 'devlog', description: 'Jump to Dev Log section', shortcut: '06' },
    { label: 'GitHub Stats', section: 'github', description: 'Jump to GitHub section', shortcut: '07' },
    { label: 'The Lab', section: 'lab', description: 'Jump to Lab / Playground', shortcut: '08' },
    { label: 'System Specs', section: 'specs', description: 'View setup & tools', shortcut: '09' },
    { label: 'Contact', section: 'contact', description: 'Jump to Contact section', shortcut: '10' },
];

const CommandPalette = () => {
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const filtered = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase())
    );

    // Keyboard shortcut to open (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Arrow key navigation
    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            executeCommand(filtered[selectedIndex]);
        }
    };

    const executeCommand = (cmd) => {
        setIsOpen(false);
        setQuery('');
        const el = document.getElementById(cmd.section);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed top-[20%] left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-[560px] border overflow-hidden ${isDark
                                ? 'bg-[#0a0a0a] border-white/10'
                                : 'bg-white border-black/10'
                            }`}
                    >
                        {/* Search input */}
                        <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                            <Search size={16} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Type a command or search..."
                                className={`flex-1 bg-transparent outline-none font-mono text-sm ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-black placeholder:text-zinc-400'}`}
                            />
                            <kbd className={`text-[9px] font-mono px-2 py-0.5 border ${isDark ? 'border-white/10 text-zinc-600' : 'border-black/10 text-zinc-400'}`}>
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                            {filtered.length === 0 ? (
                                <div className={`px-5 py-8 text-center font-mono text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                    No results found
                                </div>
                            ) : (
                                filtered.map((cmd, i) => (
                                    <button
                                        key={cmd.section}
                                        onClick={() => executeCommand(cmd)}
                                        onMouseEnter={() => setSelectedIndex(i)}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors duration-150 ${i === selectedIndex
                                                ? isDark ? 'bg-white/5' : 'bg-black/5'
                                                : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                                                {cmd.shortcut}
                                            </span>
                                            <span className={`text-sm font-display font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                                {cmd.label}
                                            </span>
                                            <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                {cmd.description}
                                            </span>
                                        </div>
                                        {i === selectedIndex && (
                                            <CornerDownLeft size={12} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer hints */}
                        <div className={`px-5 py-3 border-t flex items-center gap-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                            <div className="flex items-center gap-1.5">
                                <ArrowUp size={10} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                                <ArrowDown size={10} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                                <span className={`text-[9px] font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>Navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CornerDownLeft size={10} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                                <span className={`text-[9px] font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>Select</span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-auto">
                                <Command size={10} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                                <span className={`text-[9px] font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>K to toggle</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
