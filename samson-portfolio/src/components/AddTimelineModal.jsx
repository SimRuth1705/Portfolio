import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`}
      onClick={onClose}
    >
      <motion.div
        layoutId="event-modal-container"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Year *</label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="2025"
              />
            </div>

            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="Event Title"
              />
            </div>

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

            <div>
              <label className={`block text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
                placeholder="Describe this event..."
              />
            </div>

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
    </motion.div>
  );
};

export default AddTimelineModal;
