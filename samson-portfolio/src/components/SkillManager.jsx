import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';

const SkillManager = ({
  category,
  skills,
  onAddSkill,
  onDeleteSkill,
  onUpdateSkill,
  isAdmin
}) => {
  const { isDark } = useTheme();
  const { showConfirm } = useDialog();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill(category, newSkill.trim());
      setNewSkill('');
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const confirmed = await showConfirm('Are you sure you want to delete this skill?');
    if (confirmed) {
      onDeleteSkill(skillId);
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill.id);
    setEditValue(skill.name);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editingSkill) {
      onUpdateSkill(editingSkill, editValue.trim());
      setEditingSkill(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    setEditValue('');
  };

  return (
    <div className={`group border p-6 transition-all duration-500 ${isDark ? 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]' : 'border-black/5 hover:border-black/20 hover:bg-black/[0.02]'}`}>
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <p className={`font-mono text-[9px] uppercase tracking-[0.4em] transition-colors duration-300 ${isDark ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`}>
          {category}
        </p>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            {!isAdding ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(true)}
                className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-black/10 text-zinc-400 hover:text-black'}`}
                title="Add skill"
              >
                <Plus size={14} />
              </motion.button>
            ) : (
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSkill}
                  className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-green-500/20 text-green-500' : 'hover:bg-green-500/20 text-green-600'}`}
                  title="Save"
                >
                  <Save size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsAdding(false);
                    setNewSkill('');
                  }}
                  className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-red-500/20 text-red-600'}`}
                  title="Cancel"
                >
                  <X size={14} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="flex flex-wrap gap-2">
        {/* Add New Skill Input */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="New skill..."
                className={`text-sm font-bold border px-3 py-1 transition-all duration-300 ${isDark ? 'text-white border-white/20 bg-white/5 focus:border-white/40' : 'text-black border-black/20 bg-black/5 focus:border-black/40'} focus:outline-none`}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Skills */}
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            layout
            className="relative group"
          >
            {editingSkill === skill.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  className={`text-sm font-bold border px-3 py-1 transition-all duration-300 ${isDark ? 'text-white border-white/20 bg-white/5 focus:border-white/40' : 'text-black border-black/20 bg-black/5 focus:border-black/40'} focus:outline-none`}
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-green-500/20 text-green-500' : 'hover:bg-green-500/20 text-green-600'}`}
                  title="Save"
                >
                  <Save size={12} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-red-500/20 text-red-600'}`}
                  title="Cancel"
                >
                  <X size={12} />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-bold border px-3 py-1 cursor-default transition-all duration-300 ${isDark ? 'text-zinc-400 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/5' : 'text-zinc-500 border-black/10 hover:border-black/40 hover:text-black hover:bg-black/5'}`}
                >
                  {skill.name}
                </span>

                {/* Admin Controls for Individual Skills */}
                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditSkill(skill)}
                      className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-blue-500/20 text-blue-500' : 'hover:bg-blue-500/20 text-blue-600'}`}
                      title="Edit skill"
                    >
                      <Edit2 size={10} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteSkill(skill.id)}
                      className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-red-500/20 text-red-600'}`}
                      title="Delete skill"
                    >
                      <Trash2 size={10} />
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillManager;
