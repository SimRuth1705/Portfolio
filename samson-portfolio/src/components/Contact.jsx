import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle, AlertCircle } from 'lucide-react';
import Editable from './Editable';
import { useTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';
import { API_BASE } from '../constants';

const Contact = () => {
    const { isDark } = useTheme();
    const { showAlert } = useDialog();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitStatus, setSubmitStatus] = useState('idle'); // idle | sending | success | error

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    // Contact is inverted: light when dark mode, dark when light mode
    const isInverted = isDark;
    const bg = isInverted ? 'bg-white text-black' : 'bg-[#0a0a0a] text-white';
    const gridBg = isInverted ? 'grid-background-dark' : 'grid-background';
    const accent = isInverted ? 'black' : 'white';
    const borderCol = isInverted ? 'border-black/[0.05]' : 'border-white/[0.05]';
    const labelColor = isInverted ? 'text-zinc-400' : 'text-zinc-500';
    const headingHover = isInverted ? 'hover:text-zinc-700' : 'hover:text-zinc-300';
    const inputBorder = isInverted ? 'border-black/20 focus:border-black' : 'border-white/20 focus:border-white';
    const placeholderColor = isInverted ? 'placeholder:text-zinc-400' : 'placeholder:text-zinc-600';
    const underlineColor = isInverted ? 'bg-black' : 'bg-white';
    const btnClass = isInverted ? 'bg-black text-white' : 'bg-white text-black';
    const socialColor = isInverted ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white';
    const socialBorder = isInverted ? 'border-black/10' : 'border-white/10';
    const socialText = isInverted ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white';

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.message) {
            setSubmitStatus('error-missing');
            setTimeout(() => setSubmitStatus('idle'), 4000);
            return;
        }

        if (!validateEmail(form.email)) {
            setSubmitStatus('error-email');
            setTimeout(() => setSubmitStatus('idle'), 4000);
            return;
        }

        setSubmitStatus('sending');
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSubmitStatus('success');
                showAlert("Transmission received. I've decoded your request and will be in touch shortly.", "Secure Link Established");
                setForm({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error-api');
                showAlert("Transmission failed. The secure link could not be established. Please try again later.", "Terminal Error");
                setTimeout(() => setSubmitStatus('idle'), 4000);
            }
        } catch {
            setSubmitStatus('error-api');
            showAlert("External connection failure. Please check your network integrity.", "Connection Lost");
            setTimeout(() => setSubmitStatus('idle'), 4000);
        }
    };

    return (
        <section id="contact" className={`py-28 sm:py-32 md:py-60 relative flex flex-col items-center transition-colors duration-700 ${bg}`}>
            <div className={`absolute inset-0 ${gridBg} opacity-20 pointer-events-none w-full`}></div>
            <div className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] border-x ${borderCol} pointer-events-none z-0`}></div>
            <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${labelColor}`}>[ 10. CONNECT ]</span>

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10 mt-8 md:mt-10">

                {/* Left Column */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="md:col-span-5 flex flex-col justify-between">
                    <div className="flex flex-col gap-2 mb-12">
                        <motion.div variants={fadeInUp} className="flex items-center gap-3">
                            <div className={`h-px w-8 ${isInverted ? 'bg-black/20' : 'bg-white/20'}`} />
                            <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${labelColor}`}>
                                <Editable id="contact_status" defaultContent="Transmission Portal" />
                            </span>
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className={`text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8 cursor-default transition-colors duration-500 ${headingHover}`}>
                            <Editable id="contact_title" defaultContent="START A PROJECT." />
                        </motion.h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-px mb-12 ${isInverted ? 'bg-gradient-to-r from-black/20 via-black/5 to-transparent' : 'bg-gradient-to-r from-white/20 via-white/5 to-transparent'}`}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.p variants={fadeInUp} className={`text-2xl md:text-4xl font-display font-light leading-tight mb-8 ${isInverted ? 'text-zinc-700' : 'text-zinc-300'}`}>
                                <Editable id="contact_headline" defaultContent="Have a vision? Let's decode the path together." />
                            </motion.p>
                        </motion.div>

                        <motion.div variants={staggerContainer} className="space-y-6 mb-12">
                            <motion.div variants={fadeInUp} className="space-y-1">
                                <p className={`font-mono text-[9px] uppercase tracking-[0.4em] ${labelColor}`}>
                                    <Editable id="contact_label_email" defaultContent="Email" />
                                </p>
                                <a href="mailto:samsonraj74@gmail.com" className={`flex items-center gap-3 text-lg font-bold group transition-colors duration-300 ${isInverted ? 'hover:text-zinc-600' : 'hover:text-zinc-400'}`}>
                                    <Mail size={16} className="group-hover:scale-125 transition-transform duration-300" />
                                    <span className={`border-b-2 border-transparent transition-all duration-300 ${isInverted ? 'group-hover:border-black' : 'group-hover:border-white'}`}>
                                        <Editable id="contact_value_email" defaultContent="samsonraj74@gmail.com" />
                                    </span>
                                </a>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="space-y-1">
                                <p className={`font-mono text-[9px] uppercase tracking-[0.4em] ${labelColor}`}>
                                    <Editable id="contact_label_phone" defaultContent="Phone" />
                                </p>
                                <a href="tel:+918825470047" className={`flex items-center gap-3 text-lg font-bold group transition-colors duration-300 ${isInverted ? 'hover:text-zinc-600' : 'hover:text-zinc-400'}`}>
                                    <Phone size={16} className="group-hover:scale-125 transition-transform duration-300" />
                                    <span className={`border-b-2 border-transparent transition-all duration-300 ${isInverted ? 'group-hover:border-black' : 'group-hover:border-white'}`}>+91 88254 70047</span>
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Social Links */}
                    <motion.div variants={staggerContainer} className={`flex gap-8 pt-12 border-t ${socialBorder}`}>
                        <motion.a variants={fadeInUp} href="https://github.com/SimRuth1705" target="_blank" rel="noopener noreferrer" className={`${socialColor} hover:scale-125 transition-all duration-300`}>
                            <Github size={22} />
                        </motion.a>
                        <motion.a variants={fadeInUp} href="https://linkedin.com/in/samsonrajn" target="_blank" rel="noopener noreferrer" className={`${socialColor} hover:scale-125 transition-all duration-300`}>
                            <Linkedin size={22} />
                        </motion.a>
                        <motion.a variants={fadeInUp} href="#" className={`${socialColor} hover:scale-125 transition-all duration-300`}>
                            <Twitter size={22} />
                        </motion.a>
                        <motion.div variants={fadeInUp} className={`ml-auto flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest cursor-default transition-colors duration-300 ${socialText}`}>
                            <MapPin size={14} /> Tamil Nadu, India
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Space Column */}
                <div className="hidden md:block md:col-span-1"></div>

                {/* Right Column: Form */}
                <motion.form
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    onSubmit={handleSubmit}
                    className="space-y-12 md:col-span-6 mt-20 md:mt-0 flex flex-col justify-end"
                >
                    <motion.div variants={fadeInUp} className="relative group">
                        <label htmlFor="contact-name" className="sr-only">Full Name</label>
                        <input
                            type="text" id="contact-name" name="name" value={form.name} onChange={handleChange}
                            placeholder="YOUR NAME" required
                            autoComplete="name"
                            className={`w-full bg-transparent border-b-2 ${inputBorder} py-4 focus:outline-none transition-all ${placeholderColor} text-lg font-bold uppercase tracking-widest peer`}
                        />
                        <span className={`absolute left-0 bottom-0 w-0 h-[2px] ${underlineColor} transition-all duration-500 peer-focus:w-full`}></span>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="relative group">
                        <label htmlFor="contact-email" className="sr-only">Email Address</label>
                        <input
                            type="email" id="contact-email" name="email" value={form.email} onChange={handleChange}
                            placeholder="EMAIL ADDRESS" required
                            autoComplete="email"
                            className={`w-full bg-transparent border-b-2 ${inputBorder} py-4 focus:outline-none transition-all ${placeholderColor} text-lg font-bold uppercase tracking-widest peer`}
                        />
                        <span className={`absolute left-0 bottom-0 w-0 h-[2px] ${underlineColor} transition-all duration-500 peer-focus:w-full`}></span>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="relative group">
                        <label htmlFor="contact-phone" className="sr-only">Phone Number</label>
                        <input
                            type="tel" id="contact-phone" name="phone" value={form.phone} onChange={handleChange}
                            placeholder="PHONE (OPTIONAL)"
                            autoComplete="tel"
                            className={`w-full bg-transparent border-b-2 ${inputBorder} py-4 focus:outline-none transition-all ${placeholderColor} text-lg font-bold uppercase tracking-widest peer`}
                        />
                        <span className={`absolute left-0 bottom-0 w-0 h-[2px] ${underlineColor} transition-all duration-500 peer-focus:w-full`}></span>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="relative group">
                        <label htmlFor="contact-message" className="sr-only">Message</label>
                        <textarea
                            id="contact-message" name="message" value={form.message} onChange={handleChange}
                            placeholder="PROJECT DETAILS" rows="4" required
                            autoComplete="off"
                            className={`w-full bg-transparent border-b-2 ${inputBorder} py-4 focus:outline-none transition-all ${placeholderColor} text-lg font-bold uppercase tracking-widest peer resize-none`}
                        ></textarea>
                        <span className={`absolute left-0 bottom-0 w-0 h-[2px] ${underlineColor} transition-all duration-500 peer-focus:w-full`}></span>
                    </motion.div>

                    {/* Feedback messages */}
                    {submitStatus === 'success' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-green-500 font-mono text-sm">
                            <CheckCircle size={16} /> Transmission received — I'll be in touch soon.
                        </motion.div>
                    )}
                    {submitStatus === 'error-missing' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-red-500 font-mono text-sm">
                            <AlertCircle size={16} /> Please fill in all required fields.
                        </motion.div>
                    )}
                    {submitStatus === 'error-email' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-red-500 font-mono text-sm">
                            <AlertCircle size={16} /> Please enter a valid email address.
                        </motion.div>
                    )}
                    {submitStatus === 'error-api' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-red-500 font-mono text-sm">
                            <AlertCircle size={16} /> Transmission failed. Please try again later.
                        </motion.div>
                    )}

                    <div className="relative group pt-4">
                        <motion.button
                            variants={fadeInUp}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitStatus === 'sending'}
                            className={`relative overflow-hidden px-14 py-6 font-black uppercase text-xs tracking-[0.4em] w-full md:w-auto self-start mt-4 group shadow-xl transition-opacity ${submitStatus === 'sending' ? 'opacity-60 cursor-not-allowed' : ''} ${btnClass}`}
                        >
                            <motion.div
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                className={`absolute inset-0 bg-gradient-to-r from-transparent ${isInverted ? 'via-white/20' : 'via-black/20'} to-transparent pointer-events-none`}
                            />
                            <span className="relative z-10 group-hover:tracking-[0.6em] transition-all duration-500">
                                {submitStatus === 'sending' ? 'Transmitting...' : 'Transmit Request'}
                            </span>
                            <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full group-hover:scale-[3] transition-all duration-500 opacity-20 ${isInverted ? 'bg-white group-hover:bg-white/10' : 'bg-black group-hover:bg-black/10'}`}></div>
                        </motion.button>
                        <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-lg -z-10 ${isInverted ? 'bg-black/5' : 'bg-white/5'}`}></div>
                    </div>
                </motion.form>
            </div>
        </section>
    );
};

export default Contact;
