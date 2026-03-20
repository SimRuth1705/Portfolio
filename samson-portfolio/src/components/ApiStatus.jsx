import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Editable from './Editable';

import { API_BASE } from '../constants';

const StatusDot = ({ status }) => {
    if (status === 'loading') return <Loader2 size={14} className="animate-spin text-zinc-500" />;
    if (status === 'online') return <CheckCircle2 size={14} className="text-green-500" />;
    return <XCircle size={14} className="text-red-500" />;
};

const ApiStatus = () => {
    const { isDark } = useTheme();
    const [githubUser, setGithubUser] = useState("SimRuth1705");
    const [statuses, setStatuses] = useState({ pallet: 'loading', github: 'loading' });

    const endpoints = [
        { name: 'Portfolio API', url: API_BASE, id: 'pallet' },
        { name: 'GitHub Stats', url: `https://api.github.com/users/${githubUser}`, id: 'github' },
    ];

    const checkStatuses = async () => {
        for (const ep of endpoints) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);
                await fetch(ep.url, { signal: controller.signal });
                clearTimeout(timeout);
                setStatuses(prev => ({ ...prev, [ep.id]: 'online' }));
            } catch {
                setStatuses(prev => ({ ...prev, [ep.id]: 'offline' }));
            }
        }
    };

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/content/github_username`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.content) setGithubUser(data.content);
                }
            } catch (err) { console.error("Failed to fetch github_username:", err); }
        };
        fetchUsername();
    }, []);

    useEffect(() => {
        checkStatuses();
        const interval = setInterval(checkStatuses, 60000);
        return () => clearInterval(interval);
    }, [githubUser]);

    return (
        <section id="api-status" className={`py-28 sm:py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b relative transition-colors duration-700 ${isDark ? 'border-white/20' : 'border-black/10'}`}>
            <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>[ 09. STATUS ]</span>

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
                            <Editable id="api_status_label" defaultContent="Live Infrastructure" />
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? 'text-white' : 'text-black'}`}
                    >
                        <Editable id="api_title" defaultContent="API STATUS" />
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-px mt-6 ${isDark ? 'bg-gradient-to-r from-white/40 via-white/10 to-transparent' : 'bg-gradient-to-r from-black/40 via-black/10 to-transparent'}`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    {endpoints.map((ep, idx) => {
                        const status = statuses[ep.id];
                        return (
                            <motion.div
                                key={ep.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`group border p-8 transition-all duration-500 ${isDark ? 'border-white/5 hover:border-white/20' : 'border-black/5 hover:border-black/20'}`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Activity size={14} className={`${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
                                        <span className={`text-sm font-display font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                            {ep.name}
                                        </span>
                                    </div>
                                    <StatusDot status={status} />
                                </div>

                                <p className={`text-[9px] font-mono truncate mb-4 ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                                    {ep.url}
                                </p>

                                <div className="flex items-center gap-2">
                                    <div className={`h-1 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: status === 'online' ? '100%' : status === 'offline' ? '15%' : '50%' }}
                                            transition={{ duration: 1 }}
                                            className={`h-full rounded-full ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-zinc-500'}`}
                                        />
                                    </div>
                                    <span className={`text-[8px] font-mono uppercase tracking-widest ${status === 'online' ? 'text-green-500' : status === 'offline' ? 'text-red-500' : isDark ? 'text-zinc-600' : 'text-zinc-400'
                                        }`}>
                                        {status}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ApiStatus;
