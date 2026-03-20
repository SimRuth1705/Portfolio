import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CustomDropdown from './CustomDropdown';

const AddTimelineModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    type: 'milestone'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      year: '',
      title: '',
      description: '',
      type: 'milestone'
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
            <h2 className={`text-2xl font-display font-black ${isDark ? 'text-white' : 'text-black'}`}>
              Add Timeline Event
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
            {/* Year */}
            <div>
              <label htmlFor="timeline-year" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Year *
              </label>
              <input
                type="text"
                id="timeline-year"
                name="year"
                required
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="2025"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="timeline-title" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Title *
              </label>
              <input
                type="text"
                id="timeline-title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="Event Title"
              />
            </div>

            {/* Type */}
            <CustomDropdown
              label="Type *"
              value={formData.type}
              onChange={(value) => handleInputChange('type', value)}
              options={[
                { value: 'education', label: 'Education' },
                { value: 'milestone', label: 'Milestone' },
                { value: 'project', label: 'Project' },
                { value: 'internship', label: 'Internship' }
              ]}
            />

            {/* Description */}
            <div>
              <label htmlFor="timeline-description" className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Description *
              </label>
              <textarea
                id="timeline-description"
                name="description"
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-black/5 border-black/10 text-black focus:border-black/30'} focus:outline-none`}
                placeholder="Describe this event..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg font-mono uppercase tracking-widest transition-all duration-300 ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'}`}
              >
                Add Event
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTimelineModal;
