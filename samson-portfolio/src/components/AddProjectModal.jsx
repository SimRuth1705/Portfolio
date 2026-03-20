import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';
import { API_BASE } from '../constants';

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { showAlert } = useDialog();
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
      live_url: '',
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
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                />
              </div>
            </div>

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
    </motion.div>
  );
};

export default AddProjectModal;
