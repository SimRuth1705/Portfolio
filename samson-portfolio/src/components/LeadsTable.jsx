import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Calendar, Trash2, ExternalLink, Search, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { API_BASE } from '../constants';

const LeadsTable = () => {
    const { isDark } = useTheme();
    const { isAdmin } = useAuth();
    const { showConfirm } = useDialog();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedLead, setExpandedLead] = useState(null);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
                setError(null);
            } else {
                setError('Failed to fetch transmissions');
            }
        } catch (err) {
            setError('Connection failure');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [isAdmin]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        const confirmed = await showConfirm('Terminate this transmission record?');
        if (!confirmed) return;

        try {
            const res = await fetch(`${API_BASE}/api/contact/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
                showAlert('Transmission record purged successfully.');
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error('Delete failed with status:', res.status, errorData);
                showAlert(`DELETE_FAILED: Server responded with status ${res.status}. ${errorData.detail || ''}`);
            }
        } catch (err) {
            console.error('Delete network/request failure:', err);
            showAlert('CONNECTION_FAILURE: Unable to reach the security kernel.');
        }
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className={`animate-spin ${isDark ? 'text-white/20' : 'text-black/20'}`} size={32} />
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Decrypting Leads...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.02] border border-white/[0.05] p-4 rounded-lg">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input
                        type="text"
                        placeholder="FILTER_LEADS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-transparent border-b py-2 pl-10 pr-4 text-xs font-mono uppercase tracking-widest focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`}
                    />
                </div>
                <button
                    onClick={fetchLeads}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${isDark ? 'border-white/10 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white'}`}
                >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-3">
                    <RefreshCw size={14} /> {error}
                </div>
            )}

            <div className="space-y-4">
                {filteredLeads.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/5 rounded-xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">No transmissions matching criteria</span>
                    </div>
                ) : (
                    filteredLeads.map((lead) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`group border transition-all duration-300 overflow-hidden ${isDark ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-black/5 bg-black/[0.01] hover:bg-black/[0.03]'} ${expandedLead === lead.id ? 'ring-1 ring-inset ring-white/10' : ''}`}
                        >
                            <div
                                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-sm font-display font-black uppercase tracking-wider">{lead.name}</h4>
                                        <span className={`text-[8px] font-mono px-2 py-0.5 border rounded-full ${isDark ? 'border-white/10 text-zinc-500' : 'border-black/10 text-zinc-400'}`}>
                                            ID: {lead.id.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                            <Mail size={12} /> {lead.email}
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                                <Phone size={12} /> {lead.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                            <Calendar size={12} /> {formatDate(lead.created_at)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end md:self-center">
                                    <button
                                        onClick={(e) => handleDelete(lead.id, e)}
                                        className={`p-2 rounded-full transition-all ${isDark ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white'}`}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className={`p-2 transition-transform duration-300 ${expandedLead === lead.id ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={14} className="opacity-30" />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedLead === lead.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={`border-t ${isDark ? 'border-white/5 bg-black/40' : 'border-black/5 bg-white/40'}`}
                                    >
                                        <div className="p-6">
                                            <p className={`text-xs leading-relaxed whitespace-pre-wrap font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                                <span className="text-[10px] block mb-2 opacity-30 uppercase tracking-[0.3em]">&gt; Transmission_Body</span>
                                                {lead.message}
                                            </p>
                                            <div className="mt-8 flex gap-4">
                                                <a
                                                    href={`mailto:${lead.email}`}
                                                    className={`flex items-center gap-2 px-4 py-2 border text-[9px] font-mono uppercase tracking-[0.2em] transition-all ${isDark ? 'border-white/10 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white'}`}
                                                >
                                                    <ExternalLink size={12} /> Reply via Email
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeadsTable;
