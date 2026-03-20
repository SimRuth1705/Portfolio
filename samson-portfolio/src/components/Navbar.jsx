import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-seal.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, Shield, Command, Menu, X, Sun, Moon, Zap, FolderPlus, Clock, MessageSquarePlus, Code, Activity } from "lucide-react";
import Editable from "./Editable";
import Magnetic from "./Magnetic";

const NAV_ITEMS = [
  { label: "About", section: "about" },
  { label: "Skills", section: "skills" },
  { label: "Projects", section: "projects" },
  { label: "Contact", section: "contact" },
];

const MENU_ITEMS = [
  { label: "Home", section: "home" },
  { label: "About", section: "about" },
  { label: "Skills", section: "skills" },
  { label: "Projects", section: "projects" },
  { label: "Timeline", section: "timeline" },
  { label: "Dev Log", section: "devlog" },
  { label: "GitHub", section: "github" },
  { label: "Lab", section: "lab" },
  { label: "Specs", section: "specs" },
  { label: "API Status", section: "api-status" },
  { label: "Contact", section: "contact" },
];

const Navbar = ({ 
  onAddProject, 
  onAddTimeline, 
  onAddTestimonial, 
  onAddDevLog 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navRef = useRef(null);
  useEffect(() => {
    // Native Web Animations entrance
    if (navRef.current) {
      navRef.current.animate([
        { transform: "translateY(-120px)" },
        { transform: "translateY(0)" }
      ], {
        duration: 800,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
    }
  }, []);

  const [logoClicks, setLogoClicks] = useState(0);
  const { isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => {
      setScrolled(y > 60);
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const leftItemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const rightItemVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const curtainVariants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    open: { y: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.4 + i * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 pointer-events-none">
        <nav
          ref={navRef}
          className={`w-full pointer-events-auto transition-all duration-500 px-4 sm:px-6 lg:px-10 ${scrolled
            ? isDark
              ? "bg-[#050505]/95 backdrop-blur-xl border-b border-white/[0.08] py-2.5 sm:py-3"
              : "bg-[#f5f5f0]/95 backdrop-blur-xl border-b border-black/[0.08] py-2.5 sm:py-3"
            : isDark
              ? "bg-transparent border-b border-white/[0.03] py-3.5 sm:py-5"
              : "bg-transparent border-b border-black/[0.03] py-3.5 sm:py-5"
            }`}
        >
        {/* Progress bar */}
        <motion.div
          className={`absolute bottom-0 left-0 h-px origin-left ${isDark ? "bg-white/30" : "bg-black/30"}`}
          style={{ scaleX: useTransform(scrollY, [0, 5000], [0, 1]) }}
        />

        {/* Navbar Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1400px] mx-auto flex items-center justify-between gap-4"
        >
          {/* Logo Area */}
          <motion.div
            variants={leftItemVariants}
            className={`flex-shrink-0 cursor-pointer lg:pr-6 lg:border-r ${isDark ? "border-white/5" : "border-black/5"}`}
            onClick={() => {
              // Always redirect to home on first click if not already there
              if (window.location.pathname !== "/") {
                navigate("/");
              }
              
              const newCount = logoClicks + 1;
              if (newCount >= 3) {
                navigate("/vault");
                setLogoClicks(0);
              } else {
                setLogoClicks(newCount);
              }

              // Reset clicks after 1 second of inactivity
              setTimeout(() => setLogoClicks(0), 1000);
            }}
          >
            <Magnetic strength={20}>
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={logo}
                    alt="Logo"
                    className={`w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ${isDark ? "" : "invert"}`}
                  />
                  <div
                    className={`absolute inset-0 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? "bg-white/10" : "bg-black/10"}`}
                  ></div>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] sm:text-[11px] font-display font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase group-hover:tracking-[0.5em] transition-all duration-500 ${isDark ? "text-white" : "text-black"}`}
                  >
                    <Editable id="nav_logo_text" defaultContent="SAMSON" />
                  </span>
                  <span
                    className={`text-[7px] sm:text-[8px] font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors duration-300 ${isDark ? "text-zinc-600 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-600"}`}
                  >
                    <Editable id="nav_logo_sub" defaultContent="Full-Stack" />
                  </span>
                </div>
              </div>
            </Magnetic>
          </motion.div>

          {/* Desktop Nav Links - Only visible on LG+ */}
          <motion.div
            variants={rightItemVariants}
            className="hidden lg:flex flex-grow justify-center gap-0"
          >
            {NAV_ITEMS.map((item, i) => (
              <Magnetic key={item.section} strength={15}>
                <a
                  href={`/#${item.section}`}
                  className={`relative px-4 xl:px-6 py-1 text-[10px] font-mono uppercase tracking-[0.3em] xl:tracking-[0.4em] transition-all duration-300 group border-r last:border-r-0 ${isDark ? "border-white/5" : "border-black/5"
                    } ${activeSection === item.section
                      ? isDark
                        ? "text-white"
                        : "text-black"
                      : isDark
                        ? "text-zinc-500 hover:text-zinc-200"
                        : "text-zinc-400 hover:text-zinc-700"
                    }`}
                >
                  <span
                    className={`absolute top-1/2 left-1.5 -translate-y-1/2 w-1 h-1 rounded-full transition-all duration-300 ${isDark ? "bg-white" : "bg-black"} ${activeSection === item.section ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
                  ></span>
                  <span
                    className={`text-[8px] mr-2 transition-colors ${isDark ? "text-zinc-700 group-hover:text-zinc-500" : "text-zinc-300 group-hover:text-zinc-500"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-px transition-all duration-400 group-hover:w-full ${isDark ? "bg-white/60" : "bg-black/60"}`}
                  ></span>
                </a>
              </Magnetic>
            ))}
          </motion.div>

          {/* Right Area: Status / Admin / Toggle */}
          <motion.div
            variants={rightItemVariants}
            className="flex items-center gap-2 sm:gap-4"
          >
            {isAdmin ? (
              <div className="hidden xl:flex items-center gap-4">
                <Link
                  to="/vault"
                  className={`flex items-center gap-2 border px-3 py-1.5 transition-all duration-300 group ${isDark ? "border-white/20 bg-white/5 hover:border-white" : "border-black/20 bg-black/5 hover:border-black"}`}
                >
                  <Shield
                    size={12}
                    className={`transition-colors ${isDark ? "text-zinc-500 group-hover:text-white" : "text-zinc-400 group-hover:text-black"}`}
                  />
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest ${isDark ? "text-white" : "text-black"}`}
                  >
                    Vault
                  </span>
                </Link>
                <div
                  onClick={logout}
                  className="flex items-center gap-2 border border-red-500/20 bg-red-500/10 px-3 py-1.5 group cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <LogOut
                    size={12}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-red-500 group-hover:text-white">
                    Exit
                  </span>
                </div>
              </div>
            ) : null}

            {/* Always visible Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 ${isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </motion.div>
        </motion.div>
        </nav>
      </div>

      {/* Curtain Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Curtain Layers */}
            <motion.div
              variants={curtainVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed inset-0 z-[60] backdrop-blur-md ${isDark ? "bg-zinc-800/30" : "bg-zinc-200/30"}`}
            />
            <motion.div
              variants={curtainVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ delay: 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className={`fixed inset-0 z-[70] backdrop-blur-xl ${isDark ? "bg-zinc-900/60" : "bg-zinc-100/60"}`}
            />
            <motion.div
              variants={curtainVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ delay: 0.2, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className={`fixed inset-0 z-[80] overflow-y-auto ${isDark ? "bg-[#050505]" : "bg-[#f5f5f0]"}`}
            >
              {/* Menu Content Container */}
              <div className="min-h-full flex flex-col items-center justify-start py-20 px-6 sm:px-10 relative">
                {/* Background Text */}
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 0.02, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 text-[30vw] font-display font-black tracking-tighter uppercase select-none pointer-events-none ${isDark ? "text-white" : "text-black"}`}
                >
                  Menu
                </motion.div>

                {/* Close Button */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className={`absolute top-6 right-6 p-2 sm:p-4 rounded-full transition-all duration-300 z-[90] ${isDark ? "hover:bg-white/5 text-white" : "hover:bg-black/5 text-black"}`}
                >
                  <X size={24} className="sm:w-8 sm:h-8" />
                </button>

                {/* Navigation Links in Menu - Optimized Grid */}
                <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 sm:gap-y-10 gap-x-8 sm:gap-x-20 relative z-10 px-4">
                  {MENU_ITEMS.map((item, i) => (
                    <motion.a
                      key={item.section}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      href={`/#${item.section}`}
                      onClick={() => setMenuOpen(false)}
                      className="group relative flex flex-col items-start transition-all duration-500"
                    >
                      <Magnetic strength={20}>
                        <div className="flex flex-col items-start cursor-pointer">
                          <span className={`text-[8px] sm:text-[9px] font-mono mb-1 transition-opacity duration-300 ${isDark ? "text-zinc-600 group-hover:text-white" : "text-zinc-400 group-hover:text-black"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="relative overflow-hidden py-1">
                            <span className={`block text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-black tracking-tight uppercase transition-all duration-500 ${isDark ? "text-zinc-400 group-hover:text-white" : "text-zinc-500 group-hover:text-black"}`}>
                              {item.label}
                            </span>
                            <motion.span
                              className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full ${isDark ? "bg-white" : "bg-black"}`}
                            />
                          </div>
                        </div>
                      </Magnetic>
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Admin Tools */}
                {isAdmin && (
                  <motion.div
                    variants={itemVariants}
                    custom={MENU_ITEMS.length}
                    className={`mt-12 pt-8 border-t w-full max-w-xl flex flex-col xs:flex-row gap-4 relative z-10 ${isDark ? "border-white/5" : "border-black/5"}`}
                  >
                    <Link
                      to="/vault"
                      onClick={() => setMenuOpen(false)}
                      className={`flex-1 flex items-center justify-center gap-3 border py-3 transition-all duration-300 ${isDark ? "border-white/10 hover:border-white text-white" : "border-black/10 hover:border-black text-black"}`}
                    >
                      <Shield size={14} />
                      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Vault</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-3 border border-red-500/20 bg-red-500/5 py-3 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <LogOut size={14} />
                      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Logout</span>
                    </button>
                  </motion.div>
                )}

                {/* Footer info in menu */}
                <motion.div
                  variants={itemVariants}
                  custom={MENU_ITEMS.length + 2}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="mt-12 flex flex-col items-center gap-4 relative z-10"
                >
                  <div className={`h-px w-8 ${isDark ? "bg-white/20" : "bg-black/20"}`} />
                  
                  {/* SYSTEM_CONTROLS: Theme Toggle & Admin Actions */}
                  <div className="flex flex-col items-center gap-10 w-full max-w-2xl px-4">
                   <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <button
                         onClick={toggleTheme}
                         className={`flex items-center justify-between sm:justify-center gap-4 px-8 py-4 border rounded-full transition-all duration-500 group w-full sm:w-auto ${isDark ? "border-white/10 hover:border-white text-white bg-white/5" : "border-black/10 hover:border-black text-black bg-black/5"}`}
                       >
                         <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold">
                           Appearance
                         </span>
                         <div className="flex items-center gap-3">
                           <AnimatePresence mode="wait">
                             {isDark ? (
                               <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                 <Sun size={15} />
                               </motion.div>
                             ) : (
                               <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                 <Moon size={15} />
                               </motion.div>
                             )}
                           </AnimatePresence>
                           <span className={`text-[9px] font-mono opacity-60`}>
                             {isDark ? "Light" : "Dark"}
                           </span>
                         </div>
                       </button>
 
                       {isAdmin && (
                         <button
                           onClick={() => {
                             setMenuOpen(false);
                             navigate("/transmit");
                           }}
                           className={`flex items-center justify-between sm:justify-center gap-4 px-8 py-4 border rounded-full transition-all duration-500 group w-full sm:w-auto ${isDark ? "border-amber-500/20 text-amber-500 hover:border-amber-500 bg-amber-500/5" : "border-amber-600/20 text-amber-600 hover:border-amber-600 bg-amber-600/5"}`}
                         >
                           <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold">Data Hub</span>
                           <div className="flex items-center gap-2">
                              <Activity size={15} />
                              <span className="text-[9px] font-mono opacity-60 tracking-wider">Leads</span>
                           </div>
                         </button>
                       )}
                     </div>

                    {isAdmin && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
                        {[
                          { label: 'Project', icon: FolderPlus, onClick: onAddProject, color: 'hover:border-blue-500/40 text-blue-500' },
                          { label: 'Event', icon: Clock, onClick: onAddTimeline, color: 'hover:border-green-500/40 text-green-500' },
                          { label: 'Voices', icon: MessageSquarePlus, onClick: onAddTestimonial, color: 'hover:border-purple-500/40 text-purple-500' },
                          { label: 'Log', icon: Code, onClick: onAddDevLog, color: 'hover:border-orange-500/40 text-orange-500' },
                        ].map((action, i) => (
                          <motion.button
                            key={i}
                            layoutId={`${action.label.toLowerCase()}-modal-container`}
                            onClick={() => {
                              action.onClick?.();
                            }}
                            className={`flex flex-col items-center justify-center p-5 border rounded-xl ${isDark ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-black/5 bg-black/5 hover:bg-black/10'} ${action.color} group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200`}
                          >
                            <action.icon size={20} className="mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[8px] font-mono uppercase tracking-widest">{action.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className={`font-mono text-[8px] uppercase tracking-[0.4em] text-center ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                    SAMSON_OS V2.5
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
