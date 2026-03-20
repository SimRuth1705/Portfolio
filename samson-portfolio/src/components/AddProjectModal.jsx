import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../constants';

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { showAlert } = useDialog();
  const { token } = useAuth(); // Actually not needed if we only use credentials: 'include'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    repoLink: '',
    category: '',
    tech: '',
    problem: '',
    techChoice: '',
    outcome: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.tech.trim()) newErrors.tech = "At least one technology is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || '/api/placeholder/1200/800',
      tags: formData.tech.split(',').map(t => t.trim()).filter(t => t),
      github_url: formData.repoLink.trim(),
      live_url: '', // Optional in backend
      problem: formData.problem.trim(),
      tech_choice: formData.techChoice.trim(),
      outcome: formData.outcome.trim()
    };

    onSubmit(projectData);
    onClose();
    setFormData({
      title: '',
      description: '',
      image: '',
      repoLink: '',
      category: '',
      tech: '',
      problem: '',
      techChoice: '',
      outcome: ''
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/80' : 'bg-black/60'}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-[#f5f5f0] border-black/10'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-display font-black ${isDark ? 'text-white' : 'text-black'}`}>
              Add New Project
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'}`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label htmlFor="project-title" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  id="project-title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.title ? 'border-red-500' : isDark ? 'border-white/10' : 'border-black/10'} ${isDark ? 'bg-white/5 text-white focus:border-white/30' : 'bg-black/5 text-black focus:border-black/30'} focus:outline-none`}
                  placeholder="Project Name"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 font-mono">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="project-category" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Category
                </label>
                <input
                  type="text"
                  id="project-category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.category ? 'border-red-500' : isDark ? 'border-white/10' : 'border-black/10'} ${isDark ? 'bg-white/5 text-white focus:border-white/30' : 'bg-black/5 text-black focus:border-black/30'} focus:outline-none`}
                  placeholder="e.g., Commerce, Enterprise"
                />
                {errors.category && <p className="text-red-500 text-xs mt-1 font-mono">{errors.category}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="project-description" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Description
                </label>
                <textarea
                  id="project-description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${errors.description ? 'border-red-500' : isDark ? 'border-white/10' : 'border-black/10'} ${isDark ? 'bg-white/5 text-white focus:border-white/30' : 'bg-black/5 text-black focus:border-black/30'} focus:outline-none`}
                  placeholder="Brief project description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1 font-mono">{errors.description}</p>}
              </div>

              {/* Repository Link */}
              <div>
                <label htmlFor="project-repoLink" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Repository Link
                </label>
                <input
                  type="url"
                  id="project-repoLink"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={(e) => handleInputChange('repoLink', e.target.value)}
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Image */}
              <div>
                <label htmlFor="project-image-url" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Project Image
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    id="project-image-url"
                    name="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                    placeholder="URL or upload below"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const formDataUpload = new FormData();
                        formDataUpload.append('file', file);

                        try {
                          const res = await fetch(`${API_BASE}/api/upload`, {
                            method: 'POST',
                            credentials: 'include',
                            body: formDataUpload
                          });
                          if (res.ok) {
                            const data = await res.json();
                            handleInputChange('image', `${API_BASE}${data.url}`);
                          } else {
                            showAlert('Upload failed');
                          }
                        } catch (err) {
                          console.error('Upload error:', err);
                          showAlert('Upload error');
                        }
                      }}
                      className="hidden"
                      id="project-image-upload"
                    />
                    <label
                      htmlFor="project-image-upload"
                      className={`flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDark ? 'border-white/20 hover:border-white/40 hover:bg-white/5' : 'border-black/20 hover:border-black/40 hover:bg-black/5'}`}
                    >
                      <Plus size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Upload local image</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="md:col-span-2">
                <label htmlFor="project-tech" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Technologies
                </label>
                <input
                  type="text"
                  id="project-tech"
                  name="tech"
                  value={formData.tech}
                  onChange={(e) => handleInputChange('tech', e.target.value)}
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.tech ? 'border-red-500' : isDark ? 'border-white/10' : 'border-black/10'} ${isDark ? 'bg-white/5 text-white focus:border-white/30' : 'bg-black/5 text-black focus:border-black/30'} focus:outline-none`}
                  placeholder="React, Node.js, MongoDB (comma separated)"
                />
                {errors.tech && <p className="text-red-500 text-xs mt-1 font-mono">{errors.tech}</p>}
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-6 pt-6 border-t border-dashed">
              <h3 className={`text-lg font-display font-black mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                Project Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="project-problem" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Problem
                  </label>
                  <textarea
                    id="project-problem"
                    name="problem"
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                    placeholder="What problem does this project solve?"
                  />
                </div>

                <div>
                  <label htmlFor="project-techChoice" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Technology Choice
                  </label>
                  <textarea
                    id="project-techChoice"
                    name="techChoice"
                    value={formData.techChoice}
                    onChange={(e) => handleInputChange('techChoice', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                    placeholder="Why were these technologies chosen?"
                  />
                </div>

                <div>
                  <label htmlFor="project-outcome" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Outcome
                  </label>
                  <textarea
                    id="project-outcome"
                    name="outcome"
                    value={formData.outcome}
                    onChange={(e) => handleInputChange('outcome', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                    placeholder="What was the result or impact?"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg font-mono uppercase tracking-widest transition-all duration-300 ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'}`}
              >
                Create Project
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddProjectModal;
