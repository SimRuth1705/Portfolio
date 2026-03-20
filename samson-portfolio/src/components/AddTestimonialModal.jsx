import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AddTestimonialModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    avatar: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ name: '', role: '', quote: '', avatar: '' });
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
        layoutId="voices-modal-container"
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
              <MessageSquare size={20} className="text-purple-500" />
              <h2 className={`text-2xl font-display font-black ${isDark ? 'text-white' : 'text-black'}`}>
                Add Testimonial
              </h2>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Quote *</label>
              <textarea
                required
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="Amazing work!"
              />
            </div>
            <div className="flex justify-end pt-6">
              <button type="submit" className="px-8 py-3 rounded-lg font-mono uppercase tracking-widest bg-purple-500 text-white hover:bg-purple-600">
                Add Testimonial
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AddTestimonialModal;
