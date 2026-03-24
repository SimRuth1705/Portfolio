import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CustomCursor = () => {
  const { isDark } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Motion Values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.1 };
  const ringXSpring = useSpring(ringX, springConfig);
  const ringYSpring = useSpring(ringY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
      ringX.set(e.clientX - 16);
      ringY.set(e.clientY - 16);

      // Ensure cursor becomes visible if moving inside the window
      setIsVisible(prev => !prev ? true : prev);

      const isHoverable = !!e.target.closest('a, button, input, textarea, [data-hover="true"], [class*="cursor-pointer"]');
      setIsHovering(prev => prev !== isHoverable ? isHoverable : prev);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY, ringX, ringY, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000]" style={{ mixBlendMode: "difference" }}>
      {/* 1. OUTER RING */}
      <motion.div
        className="absolute top-0 left-0 w-8 h-8 rounded-full pointer-events-none"
        style={{
          position: 'absolute',
          x: ringXSpring,
          y: ringYSpring,
          border: `1px solid white`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.8 : isHovering ? 2 : 1,
          backgroundColor: isHovering ? "white" : "transparent",
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 25 },
          opacity: { duration: 0.2 },
        }}
      />

      {/* 2. INNER DOT */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 rounded-full pointer-events-none"
        style={{
          position: 'absolute',
          x: cursorX,
          y: cursorY,
          backgroundColor: "white",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible && !isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

export default CustomCursor;
