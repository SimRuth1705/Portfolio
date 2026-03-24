import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Github, ArrowUpRight, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Editable from "./Editable";

// Shimmer skeleton placeholder
const Skeleton = ({ isLightMode }) => (
  <div
    className={`absolute inset-0 ${isLightMode ? "bg-zinc-200" : "bg-zinc-900"}`}
  >
    {/* Shimmer sweep */}
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] ${isLightMode
          ? "bg-gradient-to-r from-transparent via-white/40 to-transparent"
          : "bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
          }`}
      />
    </div>

    {/* Faint structural lines to hint at the image shape */}
    <div className="absolute inset-0 flex flex-col justify-end p-6 gap-3">
      <div
        className={`h-2 w-1/3 rounded-sm ${isLightMode ? "bg-black/5" : "bg-white/5"}`}
      />
      <div
        className={`h-2 w-2/3 rounded-sm ${isLightMode ? "bg-black/5" : "bg-white/5"}`}
      />
      <div
        className={`h-2 w-1/2 rounded-sm ${isLightMode ? "bg-black/5" : "bg-white/5"}`}
      />
    </div>

    {/* Corner code tag placeholder */}
    <div
      className={`absolute top-4 right-4 h-5 w-20 rounded-sm ${isLightMode ? "bg-black/5" : "bg-white/5"}`}
    />
  </div>
);

const getDirectImageUrl = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([-\w]{25,})/) || url.match(/[?&]id=([-\w]{25,})/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
};

const ProjectCard = ({ project, isOffset, isLightMode, onOpen, onDelete }) => {
  const { isAdmin } = useAuth();
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Scroll parallax for the image
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Spring physics for hover tilt - more "premium" feel
  const x = useSpring(0, { stiffness: 150, damping: 30, mass: 0.5 });
  const y = useSpring(0, { stiffness: 150, damping: 30, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-15 to 15 degrees)
    const rotateX = (mouseY / height - 0.5) * -15;
    const rotateY = (mouseX / width - 0.5) * 15;

    x.set(rotateY);
    y.set(rotateX);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const revealMask = {
    hidden: { scaleY: 1 },
    visible: {
      scaleY: 0,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={`project-card-${project.id}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      className={`group cursor-pointer relative ${isOffset ? "md:mt-40" : ""}`}
      style={{ perspective: 2000 }}
    >
      <motion.div
        style={{ rotateX: y, rotateY: x }}
        className={`relative aspect-[16/11] overflow-hidden mb-8 border transition-colors duration-700 ${isLightMode
          ? "bg-zinc-200 border-black/5"
          : "bg-zinc-900 border-white/10"
          }`}
      >
        {/* Reveal Mask Overlay */}
        <motion.div
          variants={revealMask}
          className={`absolute inset-0 z-30 origin-top ${isLightMode ? "bg-zinc-100" : "bg-[#050505]"}`}
        />

        {/* Skeleton placeholder — visible while image loads */}
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10"
            >
              <Skeleton isLightMode={isLightMode} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual image */}
        <motion.img
          src={getDirectImageUrl(project.image)}
          alt={project.title}
          style={{ y: yImage }}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full scale-110 object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-[1s] ease-out ${imageLoaded ? "" : "opacity-0"
            }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        {/* Category Overlay */}
        <div
          className={`absolute top-4 right-4 z-20 px-3 py-1 border backdrop-blur-md text-[9px] uppercase tracking-widest transition-colors duration-700 ${isLightMode
            ? "bg-white/50 border-black/10 text-black"
            : "bg-black/50 border-white/20 text-white"
            }`}
        >
          {project?.category || "Project"}
        </div>
      </motion.div>

      <div className="flex justify-between items-start group-hover:translate-x-1 transition-transform duration-500">
        <div className="flex-1">
          {/* Title and Description */}
          <h3 className={`text-xl md:text-2xl font-display font-black mb-4 uppercase leading-none transition-colors duration-500 ${isLightMode ? "text-black" : "text-white"}`}>
            {project?.title}
          </h3>
          <p
            className={`text-sm leading-relaxed mb-6 max-w-sm transition-colors duration-500 ${isLightMode ? "text-zinc-600" : "text-zinc-400 group-hover:text-zinc-300"}`}
          >
            {project?.description || "No description available."}
          </p>
          <div className="flex gap-2 mb-6 flex-wrap font-mono">
            {(project?.tech || project?.tags || []).map((tech) => (
              <span
                key={tech}
                className={`text-[8px] border px-2 py-1 uppercase tracking-widest transition-all duration-300 hover:scale-110 ${isLightMode ? "border-black/10 text-zinc-600 hover:border-black/30 hover:bg-black/5" : "border-white/10 text-zinc-500 hover:border-white/30 hover:bg-white/5"}`}
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-6">
            <a
              href={project?.repoLink || project?.github_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 transition-all duration-700 ${isLightMode ? "text-zinc-500 hover:text-black" : "text-zinc-500 hover:text-white"}`}
            >
              <Github size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="relative overflow-hidden group">
                View Repository
                <span className={`absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isLightMode ? "bg-black" : "bg-white"}`} />
              </span>
            </a>
          </div>
        </div>
        {/* Admin Delete Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`p-2 rounded transition-colors duration-300 mr-2 ${isLightMode ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-400" : "bg-red-500/20 text-red-600 hover:bg-red-500/30 hover:text-red-700"}`}
            title="Delete project"
          >
            <Trash2 size={16} />
          </button>
        )}
        <div className="relative">
          <ArrowUpRight
            className={`transition-all duration-500 group-hover:rotate-45 ${isLightMode
              ? "text-zinc-400 group-hover:text-black"
              : "text-zinc-600 group-hover:text-white"
              }`}
            size={32}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
