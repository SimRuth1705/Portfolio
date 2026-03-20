import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import "./App.css";
import { useTheme } from "./context/ThemeContext";

// Global Components
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import CommandPalette from "./components/CommandPalette";
import SystemDialog from "./components/SystemDialog";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";
import Transmit from "./pages/Transmit";

function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen grid-background relative font-sans overflow-x-hidden flex flex-col transition-colors duration-700 ${isDark
        ? "bg-[#050505] text-white selection:bg-white selection:text-black"
        : "bg-[#f5f5f0] text-black selection:bg-black selection:text-white"
        }`}
    >
        {/* 1. Global Utilities */}
        <CustomCursor />
        <CommandPalette />
        <SystemDialog />
        <div className="fixed inset-0 pointer-events-none noise-overlay z-[99999] opacity-[0.03]"></div>
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 z-[100] origin-left ${isDark ? "bg-white" : "bg-black"}`}
        style={{ scaleX }}
      />
      <div
        className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] border-x pointer-events-none z-0 ${isDark ? "border-white/[0.03]" : "border-black/[0.05]"}`}
      ></div>

      {/* 2. Structural Elements */}
      <Navbar />

      {/* 3. Page Router with Smooth Fade Transitions */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/vault" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/transmit" element={<Transmit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* 4. Structural Elements */}
      <Footer />

        {/* 5. Floating Theme Toggle */}
        <ThemeToggle />
    </div>
  );
}

export default App;
