import React, { useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useTheme } from "./context/ThemeContext";

// Global Components
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import { useAuth } from "./context/AuthContext";
import { API_BASE } from "./constants";
import AddProjectModal from "./components/AddProjectModal";
import AddTimelineModal from "./components/AddTimelineModal";
import AddTestimonialModal from "./components/AddTestimonialModal";
import AddDevLogModal from "./components/AddDevLogModal";

function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  const progressBarRef = useRef(null);
  useMotionValueEvent(scaleX, "change", (latest) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${latest})`;
    }
  });

  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  
  const [modals, setModals] = useState({
    project: false,
    timeline: false,
    testimonial: false,
    devlog: false
  });

  const toggleModal = (type, state) => setModals(prev => ({ ...prev, [type]: state }));

  const handleCreate = async (endpoint, data, modalType) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toggleModal(modalType, false);
        window.dispatchEvent(new CustomEvent('content-updated'));
      }
    } catch (err) {
      console.error(`Failed to create ${modalType}:`, err);
    }
  };

  return (
    <div
      className={`min-h-screen grid-background relative font-sans overflow-x-hidden flex flex-col transition-colors duration-700 ${isDark
        ? "bg-[#050505] text-white selection:bg-white selection:text-black"
        : "bg-[#f5f5f0] text-black selection:bg-black selection:text-white"
        }`}
      style={{ position: 'relative' }}
    >
        {/* 1. Global Utilities */}
        <CustomCursor />
        <CommandPalette />
        <SystemDialog />
        <div className="fixed inset-0 pointer-events-none noise-overlay z-[99999] opacity-[0.03]"></div>
      {/* Scroll Progress Bar Container */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
        <div
          ref={progressBarRef}
          className={`w-full h-full origin-left will-change-transform ${isDark ? "bg-white" : "bg-black"}`}
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <div
        className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] border-x pointer-events-none z-0 ${isDark ? "border-white/[0.03]" : "border-black/[0.05]"}`}
      ></div>

      {/* 2. Structural Elements */}
      <Navbar 
        onAddProject={() => toggleModal('project', true)}
        onAddTimeline={() => toggleModal('timeline', true)}
        onAddTestimonial={() => toggleModal('testimonial', true)}
        onAddDevLog={() => toggleModal('devlog', true)}
      />

      {/* 3. Page Router with Smooth Fade Transitions */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/vault" element={
              <Login 
                onAddProject={() => toggleModal('project', true)}
                onAddTimeline={() => toggleModal('timeline', true)}
                onAddTestimonial={() => toggleModal('testimonial', true)}
                onAddDevLog={() => toggleModal('devlog', true)}
              />
            } />
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

      {/* Admin Modals */}
      <AnimatePresence>
        {isAdmin && modals.project && (
          <AddProjectModal
            isOpen={modals.project}
            onClose={() => toggleModal('project', false)}
            onSubmit={(data) => handleCreate('/api/projects', data, 'project')}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAdmin && modals.timeline && (
          <AddTimelineModal
            isOpen={modals.timeline}
            onClose={() => toggleModal('timeline', false)}
            onSubmit={(data) => handleCreate('/api/timeline', data, 'timeline')}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAdmin && modals.testimonial && (
          <AddTestimonialModal
            isOpen={modals.testimonial}
            onClose={() => toggleModal('testimonial', false)}
            onSubmit={(data) => handleCreate('/api/testimonials', data, 'testimonial')}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAdmin && modals.devlog && (
          <AddDevLogModal
            isOpen={modals.devlog}
            onClose={() => toggleModal('devlog', false)}
            onSubmit={(data) => handleCreate('/api/devlogs', data, 'devlog')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
