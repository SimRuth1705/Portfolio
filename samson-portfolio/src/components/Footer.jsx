import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editable from './Editable';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className={`py-12 px-4 sm:px-6 md:px-10 border-t backdrop-blur-md relative z-10 mt-auto transition-colors duration-700 ${isDark ? 'border-white/10 bg-black/40' : 'border-black/10 bg-white/40'}`}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">

        {/* Left section */}
        <div className="flex flex-col gap-1">
          <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            © {new Date().getFullYear()} <Editable id="footer_copyright" defaultContent="SAMSON RAJ N." />
          </p>
          <p className={`text-[9px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
            <Editable id="footer_tagline" defaultContent="Crafting Digital Architecture" />
          </p>
        </div>

        {/* Right section */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <Editable id="footer_location" defaultContent="TAMIL NADU, INDIA" />
          </p>
          <p className={`text-[9px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
            <Editable id="footer_status" defaultContent="Open for Global Collaboration" />
          </p>
        </div>

        <ul className={`flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] uppercase tracking-[0.3em] font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <li>
            <Link to="/privacy" className={`transition-colors duration-300 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms" className={`transition-colors duration-300 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Terms of Service</Link>
          </li>
          <li>
            <Link to="/faq" className={`transition-colors duration-300 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>FAQ</Link>
          </li>
        </ul>

      </div>
    </motion.footer>
  );
};

export default Footer;
