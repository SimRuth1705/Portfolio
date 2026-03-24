import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';
import { API_BASE } from '../constants';

const getDirectImageUrl = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([-\w]{25,})/) || url.match(/[?&]id=([-\w]{25,})/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
};

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { showAlert } = useDialog();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    repoLink: '',
    liveUrl: '',
    tech: '',
    problem: '',
    techChoice: '',
    outcome: '',
    category: ''
  });

  const [errors, setErrors] = useState({});

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('samson_admin_token');
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: uploadData
      });

      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      
      // The backend returns a relative URL like /static/uploads/filename
      handleInputChange('image', data.url);
      showAlert("Image uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to upload image. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
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
      image: getDirectImageUrl(formData.image.trim()) || '/api/placeholder/1200/800',
      tags: formData.tech.split(',').map(t => t.trim()).filter(t => t),
      github_url: formData.repoLink.trim(),
      live_url: formData.liveUrl.trim(),
      problem: formData.problem.trim(),
      tech_choice: formData.techChoice.trim(),
      outcome: formData.outcome.trim(),
      category: formData.category.trim() || "Project"
    };

    onSubmit(projectData);
    onClose();
    setFormData({
      title: '',
      description: '',
      image: '',
      repoLink: '',
      liveUrl: '',
      tech: '',
      problem: '',
      techChoice: '',
      outcome: '',
      category: ''
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`}
      onClick={onClose}
    >
      <motion.div
        layoutId="project-modal-container"
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-[#f5f5f0] border-black/10'} shadow-2xl`}
        onClick={e => e.stopPropagation()}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="w-full h-full"
        >
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Category / Head</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack, AI Project"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Tech Stack (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, MongoDB"
                  value={formData.tech}
                  onChange={(e) => handleInputChange('tech', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>GitHub Repo URL</label>
                <input
                  type="text"
                  value={formData.repoLink}
                  onChange={(e) => handleInputChange('repoLink', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Live Demo URL</label>
                <input
                  type="text"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Image Cover</label>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className={`block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold transition-all duration-300 ${isDark 
                      ? 'file:bg-white/10 file:text-white hover:file:bg-white/20 text-zinc-400' 
                      : 'file:bg-black/5 file:text-black hover:file:bg-black/10 text-zinc-600'}`}
                  />
                  {isUploading && <span className="text-sm font-mono text-emerald-500 animate-pulse flex items-center">Uploading...</span>}
                </div>
                <input
                  type="text"
                  placeholder="Or paste an image URL here (https://example.com/image.jpg)"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
                {formData.image && (
                  <div className="mt-4 aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/20 relative group">
                    <img
                      src={getDirectImageUrl(formData.image)}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/1200/800';
                        e.target.className = "w-full h-full object-cover opacity-20 grayscale";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <span className="text-[10px] font-mono text-white/60">LIVE PREVIEW</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>The Problem Statement</label>
                <textarea
                  value={formData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Tech Choices & Architecture</label>
                <textarea
                  value={formData.techChoice}
                  onChange={(e) => handleInputChange('techChoice', e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Project Outcome</label>
                <textarea
                  value={formData.outcome}
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isUploading}
                className={`px-8 py-3 rounded-lg font-mono uppercase tracking-widest transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed text-zinc-500 bg-zinc-800' : isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'}`}
              >
                {isUploading ? 'Uploading...' : 'Create Project'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AddProjectModal;
