import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CustomDropdown = ({
    options,
    value,
    onChange,
    label,
    placeholder = "Select an option",
    searchable = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { isDark } = useTheme();
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label className={`block text-[10px] font-mono uppercase tracking-[0.3em] mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 group ${isDark
                        ? 'bg-white/5 border-white/10 text-white hover:border-white/30'
                        : 'bg-black/5 border-black/10 text-black hover:border-black/30'
                    } ${isOpen ? (isDark ? 'border-white/40 ring-1 ring-white/10' : 'border-black/40 ring-1 ring-black/10') : ''}`}
            >
                <span className={`text-sm ${!selectedOption ? (isDark ? 'text-zinc-500' : 'text-zinc-400') : ''}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={`absolute top-full left-0 right-0 z-[100] mt-2 p-2 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl ${isDark ? 'bg-[#0f0f0f]/90 border-white/10' : 'bg-white/90 border-black/10'
                            }`}
                    >
                        {searchable && (
                            <div className={`flex items-center gap-2 px-3 py-2 mb-2 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                <Search size={14} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none text-xs font-mono uppercase tracking-widest placeholder:text-zinc-700"
                                />
                            </div>
                        )}

                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group/item ${value === option.value
                                                ? (isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black')
                                                : (isDark ? 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300' : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-700')
                                            }`}
                                    >
                                        <span className="text-xs font-mono uppercase tracking-widest">
                                            {option.label}
                                        </span>
                                        {value === option.value && (
                                            <Check size={12} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className={`px-4 py-8 text-center text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
                                    No results found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
