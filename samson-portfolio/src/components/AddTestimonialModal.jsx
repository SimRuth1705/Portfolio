import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    setFormData({
      name: '',
      role: '',
      quote: '',
      avatar: ''
    });
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
          className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-8 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-[#f5f5f0] border-black/10'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                <MessageSquare size={20} className="text-purple-500" />
              </div>
              <h2 className={`text-2xl font-display font-black ${isDark ? 'text-white' : 'text-black'}`}>
                Add Testimonial
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'}`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="testimonial-name" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Name *
              </label>
              <input
                type="text"
                id="testimonial-name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                autoComplete="name"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="John Doe"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="testimonial-role" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Role *
              </label>
              <input
                type="text"
                id="testimonial-role"
                name="role"
                required
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="Software Engineer"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="testimonial-avatar" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Avatar URL
              </label>
              <input
                type="text"
                id="testimonial-avatar"
                name="avatar"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Quote */}
            <div>
              <label htmlFor="testimonial-quote" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Testimonial (Quote) *
              </label>
              <textarea
                id="testimonial-quote"
                name="quote"
                required
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="Amazing work! Highly recommended..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg font-mono uppercase tracking-widest transition-all duration-300 ${isDark ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
              >
                Add Testimonial
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTestimonialModal;
