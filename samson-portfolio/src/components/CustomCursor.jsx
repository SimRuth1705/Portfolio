import React, { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // References to the DOM elements
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const reqRef = useRef(null);

  // State to hold cursor position targets and current positions for lerping
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // The single animation loop that interpolates both elements
    const updateCursor = () => {
      // Linear interpolation (lerp) for the Spring effect
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.15;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentPos.current.x - 16}px, ${currentPos.current.y - 16}px, 0)`;
      }
      
      // The dot perfectly follows the mouse (no spring)
      if (dotRef.current) {
         dotRef.current.style.transform = `translate3d(${targetPos.current.x - 4}px, ${targetPos.current.y - 4}px, 0)`;
      }

      reqRef.current = requestAnimationFrame(updateCursor);
    };
    reqRef.current = requestAnimationFrame(updateCursor);

    const moveCursor = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      const isHoverable = e.target.closest('a, button, input, textarea, [data-hover="true"]');
      setIsHovering(!!isHoverable);
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
      cancelAnimationFrame(reqRef.current);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isMobile]);

  if (isMobile) return null;

  // Derive CSS variables for the states
  let ringScale = 1;
  if (isClicking) ringScale = 0.8;
  else if (isHovering) ringScale = 2;
  
  const ringBg = isHovering ? "white" : "transparent";
  const ringOpacity = isVisible ? 1 : 0;
  const dotOpacity = isVisible && !isHovering ? 1 : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000]">
      {/* The Spring Ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full will-change-transform"
        style={{
          border: `1px solid white`,
          mixBlendMode: "difference",
          opacity: ringOpacity,
          backgroundColor: ringBg,
          transition: "opacity 0.2s ease, transform 0s, background-color 0.2s ease, scale 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          scale: ringScale,
          transformOrigin: 'center center' // Ensure scale happens from the center
        }}
      />

      {/* The Exact Mouse Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-2 h-2 rounded-full will-change-transform"
        style={{
          backgroundColor: "white",
          mixBlendMode: "difference",
          opacity: dotOpacity,
          transition: "opacity 0.1s ease, transform 0s",
        }}
      />
    </div>
  );
};

export default CustomCursor;
