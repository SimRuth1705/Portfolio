import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, ShieldAlert, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../constants';
import VaultDashboard from '../components/VaultDashboard';

const Login = ({ onAddProject, onAddTimeline, onAddTestimonial, onAddDevLog }) => {
    const { isAdmin, login, logout } = useAuth();
    const { showAlert } = useDialog();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle | checking | success | error
    const [glitch, setGlitch] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) return;

        setStatus('checking');

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
                credentials: 'include'
            });

            if (res.ok) {
                setStatus('success');
                login();
                setTimeout(() => navigate('/vault'), 1000);
            } else {
                setStatus('error');
                setGlitch(true);
                showAlert('AUTHENTICATION FAILURE: Access credentials rejected by security kernel.');
                setTimeout(() => {
                    setStatus('idle');
                    setGlitch(false);
                    setPassword('');
                }, 2000);
            }
        } catch {
            setStatus('error');
            setGlitch(true);
            showAlert('CONNECTION ERROR: Unable to reach authentication server.');
            setTimeout(() => {
                setStatus('idle');
                setGlitch(false);
                setPassword('');
            }, 2000);
        }
    };

    const handleLogout = () => {
        logout();
        setStatus('idle');
        setPassword('');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center font-mono overflow-hidden relative transition-colors duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f5f5f0] text-black'}`}>
            <div className={`absolute inset-0 opacity-20 pointer-events-none ${isDark ? 'grid-background' : 'grid-background-dark'}`}></div>

            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className={`absolute left-0 right-0 h-px z-0 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-full ${isAdmin ? 'max-w-6xl mt-20' : 'max-w-md'} p-6 sm:p-10 relative z-10 transition-all duration-300 ${glitch ? 'translate-x-1 skew-x-2 grayscale' : ''}`}
            >
                {!isAdmin && (
                    <>
                        <div className={`absolute inset-0 border ${isDark ? 'border-white/5' : 'border-black/5'}`}></div>
                        <motion.div
                            className={`absolute inset-0 border ${isDark ? 'border-white/20' : 'border-black/20'}`}
                            animate={{ clipPath: ['inset(0 0 95% 0)', 'inset(0 95% 0 0)', 'inset(95% 0 0 0)', 'inset(0 0 0 95%)', 'inset(0 0 95% 0)'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />
                    </>
                )}

                {isAdmin ? (
                    <VaultDashboard 
                        onLogout={handleLogout} 
                        onAddProject={onAddProject}
                        onAddTimeline={onAddTimeline}
                        onAddTestimonial={onAddTestimonial}
                        onAddDevLog={onAddDevLog}
                    />
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`inline-flex items-center justify-center w-16 h-16 border rounded-full mb-6 relative group ${isDark ? 'border-white/10' : 'border-black/10'}`}
                            >
                                <AnimatePresence mode="wait">
                                    {status === 'error' ? (
                                        <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <ShieldAlert className="text-red-500" size={32} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <Lock className={`text-zinc-500 transition-colors ${isDark ? 'group-hover:text-white' : 'group-hover:text-black'}`} size={24} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className={`absolute inset-0 border rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity ${isDark ? 'border-white/20' : 'border-black/20'}`}></div>
                            </motion.div>

                            <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-500 mb-2">
                                System Access
                            </h2>
                            <div className={`h-px w-12 mx-auto mb-4 ${isDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                            <p className={`text-[10px] uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
                                Encrypted Terminal V2.4
                            </p>
                            <label htmlFor="login-password" className="sr-only">Access Key</label>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="relative group">
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="ENTER CREDENTIALS"
                                    autoComplete="current-password"
                                    disabled={status === 'checking' || status === 'success'}
                                    className={`w-full bg-transparent border-b py-4 font-mono text-center tracking-[1em] focus:outline-none transition-all placeholder:tracking-widest text-sm peer ${isDark ? 'border-white/10 focus:border-white placeholder:text-zinc-800' : 'border-black/10 focus:border-black placeholder:text-zinc-300'}`}
                                />
                                <div className={`absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 peer-focus:w-full ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={status === 'checking' || status === 'success'}
                                className={`w-full py-5 border font-black uppercase text-[10px] tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden relative group ${status === 'success' ? 'bg-green-500 border-green-500 text-white' :
                                    status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                                        isDark ? 'bg-transparent border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
                                            : 'bg-transparent border-black/10 text-black hover:bg-black hover:text-white hover:border-black'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {status === 'checking' ? (
                                        <motion.span key="check" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}>.</motion.span>
                                            ))}
                                        </motion.span>
                                    ) : (
                                        <motion.span key="txt" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-3">
                                            {status === 'success' ? 'Access Granted' : 'Authenticate'}
                                            {status === 'idle' && <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </form>

                        <div className={`mt-16 flex justify-between items-center opacity-30 text-[8px] uppercase tracking-widest text-zinc-500 border-t pt-6 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                            <span>SAMSON_OS_ROOT</span>
                            <span className="animate-pulse">Waiting for Access</span>
                            <span>4A_F2_99_00</span>
                        </div>
                    </>
                )}
            </motion.div>

            <div className={`absolute top-10 left-10 opacity-10 font-mono text-[9px] space-y-1 pointer-events-none ${isDark ? 'text-white' : 'text-black'}`}>
                <div>&gt; initializing_sec_protocol...</div>
                <div>&gt; bypass_check: {isAdmin ? 'success' : 'fail'}</div>
                <div>&gt; kernel_access: {isAdmin ? 'unrestricted' : 'restricted'}</div>
            </div>
        </div>
    );
};

export default Login;
