import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Code } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AddDevLogModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    snippet: '',
    content: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      title: formData.title,
      snippet: formData.snippet,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(submissionData);
    onClose();
    setFormData({ title: '', snippet: '', content: '', tags: '' });
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
        layoutId="log-modal-container"
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-8 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-[#f5f5f0] border-black/10'} shadow-2xl`}
        onClick={e => e.stopPropagation()}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="w-full h-full text-left"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Code size={20} className="text-orange-500" />
              <h2 className={`text-2xl font-display font-black ${isDark ? 'text-white' : 'text-black'}`}>
                Add Dev Log
              </h2>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="New feature implementation"
              />
            </div>
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Snippet *</label>
              <input
                type="text"
                required
                value={formData.snippet}
                onChange={(e) => handleInputChange('snippet', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="Summary"
              />
            </div>
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Content *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="Full content..."
              />
            </div>
            <div className="flex justify-end pt-6">
              <button type="submit" className="px-8 py-3 rounded-lg font-mono uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600">
                Add Dev Log
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AddDevLogModal;
