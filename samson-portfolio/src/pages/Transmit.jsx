import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi } from 'lucide-react';
import LeadsTable from '../components/LeadsTable';

const Transmit = () => {
    const { isAdmin, loading } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/vault');
        }
    }, [isAdmin, loading, navigate]);

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse font-mono text-xs uppercase tracking-[0.5em] opacity-40">
                    Authenticating Terminal...
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen pt-32 pb-20 px-4 sm:px-6 md:px-10 ${isDark ? 'bg-[#050505]' : 'bg-[#f5f5f0]'}`}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-black/5 dark:border-white/5 pb-12">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate(-1)}
                            className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity mb-8`}
                        >
                            <ArrowLeft size={12} /> Back to Terminal
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-blue-500/50" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-blue-500">Secure Transmission Link</span>
                        </div>
                        
                        <h1 className={`text-5xl md:text-8xl font-display font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                            TRANSMIT
                        </h1>
                    </div>

                    <div className={`px-6 py-3 border backdrop-blur-sm self-start md:self-auto ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <div className="flex items-center gap-3">
                            <Wifi size={14} className="text-green-500 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">Live_Stream_Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Submissions Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-display font-bold uppercase tracking-tight">Intercepted Requests</h2>
                        <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    </div>
                    
                    <LeadsTable />
                </div>
            </div>

            {/* Background Grid Accent */}
            <div className={`fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] ${isDark ? 'grid-background-dark' : 'grid-background'}`}></div>
        </motion.div>
    );
};

export default Transmit;
