import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FolderPlus,
    MessageSquarePlus,
    Clock,
    Code,
    Zap,
    ShieldCheck,
    Activity,
    LogOut,
    ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../constants';
import LeadsTable from './LeadsTable';
import AddProjectModal from './AddProjectModal';
import AddTimelineModal from './AddTimelineModal';
import AddTestimonialModal from './AddTestimonialModal';
import AddDevLogModal from './AddDevLogModal';

const StatCard = ({ label, value, icon: Icon, color, isDark }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`p-6 border transition-all duration-300 ${isDark ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-black/5 bg-black/[0.02] hover:bg-black/[0.05]'}`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon size={18} className={color.replace('bg-', 'text-')} />
            </div>
            <span className="text-2xl font-black font-display tracking-tighter">{value}</span>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">{label}</p>
    </motion.div>
);

const VaultDashboard = ({ onLogout, onAddProject, onAddTimeline, onAddTestimonial, onAddDevLog }) => {
    const { isDark } = useTheme();
    const { isAdmin } = useAuth();
    const [stats, setStats] = useState({ projects: 0, devlogs: 0, leads: 0, testimonials: 0, skills: 0 });
    const [apiHealth, setApiHealth] = useState('checking');

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/vault/stats`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const checkHealth = async () => {
        try {
            const res = await fetch(`${API_BASE}/`);
            setApiHealth(res.ok ? 'online' : 'unstable');
        } catch {
            setApiHealth('offline');
        }
    };

    useEffect(() => {
        fetchStats();
        checkHealth();

        // Listen for global content updates (from Navbar/Admin Modals)
        window.addEventListener('content-updated', fetchStats);
        return () => window.removeEventListener('content-updated', fetchStats);
    }, [isAdmin]);


    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/10 pb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-green-500/50" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-green-500">Secure Environment Active</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">The Vault</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 border flex items-center gap-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${apiHealth === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[9px] font-mono uppercase tracking-widest opacity-60">System_{apiHealth.toUpperCase()}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-3 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Projects" value={stats.projects} icon={Zap} color="text-blue-500 bg-blue-500" isDark={isDark} />
                <StatCard label="Leads" value={stats.leads} icon={Activity} color="text-green-500 bg-green-500" isDark={isDark} />
                <StatCard label="DevLogs" value={stats.devlogs} icon={Code} color="text-orange-500 bg-orange-500" isDark={isDark} />
                <StatCard label="Testimonials" value={stats.testimonials} icon={MessageSquarePlus} color="text-purple-500 bg-purple-500" isDark={isDark} />
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'New Project', icon: FolderPlus, color: 'hover:border-blue-500/40', onClick: onAddProject },
                    { label: 'New Event', icon: Clock, color: 'hover:border-green-500/40', onClick: onAddTimeline },
                    { label: 'New Voices', icon: MessageSquarePlus, color: 'hover:border-purple-500/40', onClick: onAddTestimonial },
                    { label: 'New DevLog', icon: Code, color: 'hover:border-orange-500/40', onClick: onAddDevLog },
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={action.onClick}
                        className={`group flex items-center justify-between p-5 border transition-all duration-300 ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'} ${action.color}`}
                    >
                        <div className="flex items-center gap-4">
                            <action.icon size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">{action.label}</span>
                        </div>
                        <Zap size={10} className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                    </button>
                ))}
            </div>

            {/* Leads Section */}
            <div className="pt-8">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight">Transmission Logs</h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
                <LeadsTable />
            </div>

        </div>
    );
};

export default VaultDashboard;
