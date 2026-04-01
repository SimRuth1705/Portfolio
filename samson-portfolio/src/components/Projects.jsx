import React, { useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import AdminSettingsButton from "./AdminSettingsButton";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import Editable from "./Editable";
import { API_BASE } from "../constants";

const Projects = () => {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteProject = async (projectId) => {
    const confirmed = await showConfirm("Are you sure you want to delete this project?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } else {
        showAlert("Failed to delete project. Please try again.");
      }
    } catch {
      showAlert("Failed to delete project. Please try again.");
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? updated : p))
        );
        showAlert("Project updated successfully!", "success");
      } else {
        showAlert("Failed to update project. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      showAlert("Failed to update project. Please try again.");
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setProjects(Array.isArray(data) ? data : []);
            setError(null);
          }
        } else {
          throw new Error(`Failed to fetch projects: ${res.status}`);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading projects:", err);
          setError(err.message);
          setProjects([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();

    const handleRefresh = () => load();
    window.addEventListener('content-updated', handleRefresh);

    return () => {
      ignore = true;
      window.removeEventListener('content-updated', handleRefresh);
    };
  }, []);

  return (
    <LayoutGroup>
      <section
        id="projects"
        className={`py-28 sm:py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b relative transition-colors duration-700 ${isDark ? "border-white/20" : "border-black/10"}`}
      >
        <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
          [ 03. WORKS ]
        </span>

        <div className="max-w-[1400px] mx-auto mt-10">
          {/* Section Header */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className={`h-px w-8 ${isDark ? "bg-white/20" : "bg-black/20"}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                <Editable id="projects_status" defaultContent="Selected Works" />
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? "text-white" : "text-black"}`}
            >
              <Editable id="projects_title" defaultContent="PROJECTS" />
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`h-px mt-6 ${isDark ? "bg-gradient-to-r from-white/40 via-white/10 to-transparent" : "bg-gradient-to-r from-black/40 via-black/10 to-transparent"}`}
            />
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className={`animate-spin rounded-full h-12 w-12 border-4 ${isDark ? "border-white/20 border-t-white" : "border-black/20 border-t-black"}`}></div>
            </div>
          )}

          {error && (
            <div className={`text-center py-20 ${isDark ? "text-red-400" : "text-red-600"}`}>
              <p className="mb-4">Failed to load projects</p>
              <button
                onClick={() => window.location.reload()}
                className={`px-4 py-2 border ${isDark ? "border-white/20 hover:border-white/40" : "border-black/20 hover:border-black/40"}`}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="relative grid md:grid-cols-2 gap-x-24 gap-y-40">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isOffset={index % 2 !== 0}
                  isLightMode={!isDark}
                  onOpen={() => setSelectedProject(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onEdit={() => setEditingProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <EditProjectModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleUpdateProject}
      />
    </LayoutGroup>
  );
};

export default Projects;
