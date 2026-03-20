import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SECTION_BLOCK_VARIANTS = {
  home: {
    title: "Hero Panel",
    description: "Additional hero-style spotlight block.",
    accent: "bg-cyan-500",
  },
  about: {
    title: "About Insight",
    description: "Additional profile insight panel.",
    accent: "bg-violet-500",
  },
  skills: {
    title: "Skill Node",
    description: "Additional skill stream capsule.",
    accent: "bg-emerald-500",
  },
  projects: {
    title: "Project Tile",
    description: "Additional project showcase tile.",
    accent: "bg-amber-500",
  },
  timeline: {
    title: "Timeline Event",
    description: "Additional journey timeline card.",
    accent: "bg-blue-500",
  },
  testimonials: {
    title: "Voice Card",
    description: "Additional testimonial signal card.",
    accent: "bg-pink-500",
  },
  devlog: {
    title: "Log Entry",
    description: "Additional development log card.",
    accent: "bg-lime-500",
  },
  github: {
    title: "GitHub Stat",
    description: "Additional source activity card.",
    accent: "bg-indigo-500",
  },
  lab: {
    title: "Lab Experiment",
    description: "Additional experimental feature card.",
    accent: "bg-orange-500",
  },
  specs: {
    title: "Spec Module",
    description: "Additional system spec module.",
    accent: "bg-sky-500",
  },
  "api-status": {
    title: "Endpoint Card",
    description: "Additional endpoint monitor card.",
    accent: "bg-teal-500",
  },
  contact: {
    title: "Contact Channel",
    description: "Additional contact information card.",
    accent: "bg-rose-500",
  },
};

const AdminSectionBlocks = ({ sectionId, isDark }) => {
  const { isAdmin } = useAuth();
  const storageKey = `section_blocks_${sectionId}`;
  const variant = SECTION_BLOCK_VARIANTS[sectionId] || {
    title: "Custom Block",
    description: "Additional section content block.",
    accent: "bg-zinc-500",
  };
  const [blockCount, setBlockCount] = useState(() => {
    const savedCount = Number(localStorage.getItem(storageKey) || 0);
    return Number.isFinite(savedCount) ? savedCount : 0;
  });

  const addBlock = () => {
    const nextCount = blockCount + 1;
    setBlockCount(nextCount);
    localStorage.setItem(storageKey, String(nextCount));
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={addBlock}
        className={`absolute top-10 right-10 z-20 w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-black/20 text-black hover:bg-black/10"}`}
      >
        <Plus size={16} />
      </button>
      {blockCount > 0 && (
        <div className="max-w-[1400px] mx-auto mt-10 space-y-4">
          {Array.from({ length: blockCount }).map((_, index) => (
            <div
              key={`${sectionId}-${index}`}
              className={`border p-8 transition-all duration-300 ${isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-2 h-2 rounded-full ${variant.accent}`} />
                <div
                  className={`h-px flex-1 ${isDark ? "bg-white/15" : "bg-black/15"}`}
                />
              </div>
              <p
                className={`text-[9px] font-mono uppercase tracking-[0.4em] mb-3 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
              >
                {variant.title} {String(index + 1).padStart(2, "0")}
              </p>
              <div
                className={`h-px w-16 mb-4 ${isDark ? "bg-white/20" : "bg-black/20"}`}
              />
              <p className={`${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {variant.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminSectionBlocks;
