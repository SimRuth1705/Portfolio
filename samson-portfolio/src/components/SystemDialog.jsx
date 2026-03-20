import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle, X } from 'lucide-react';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';

const SystemDialog = () => {
    const { dialog, closeDialog } = useDialog();
    const { isDark } = useTheme();

    if (!dialog.isOpen) return null;

    const isConfirm = dialog.type === 'confirm';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={isConfirm ? dialog.onCancel : closeDialog}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Dialog Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${isDark
                            ? 'bg-[#0a0a0a] border-white/10 text-white'
                            : 'bg-white border-black/10 text-black'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${isConfirm
                                ? (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
                                : (isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600')
                            }`}>
                            {isConfirm ? <HelpCircle size={24} /> : <AlertCircle size={24} />}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-display font-bold mb-2">
                                {dialog.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {dialog.message}
                            </p>
                        </div>

                        <button
                            onClick={isConfirm ? dialog.onCancel : closeDialog}
                            className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500' : 'hover:bg-black/5 text-zinc-400'
                                }`}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        {isConfirm && (
                            <button
                                onClick={dialog.onCancel}
                                className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest border transition-all ${isDark
                                        ? 'border-white/10 text-white hover:bg-white/5'
                                        : 'border-black/10 text-black hover:bg-black/5'
                                    }`}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={dialog.onConfirm}
                            className={`px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${isConfirm
                                    ? (isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700')
                                    : (isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')
                                }`}
                        >
                            {isConfirm ? 'Confirm' : 'OK'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SystemDialog;
