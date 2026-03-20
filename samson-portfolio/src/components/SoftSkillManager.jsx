import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';

const SoftSkillManager = ({
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
      onAddSkill(newSkill.trim());
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
    <motion.div variants={{ hidden: {}, visible: {} }}>
      <div className="flex items-center justify-between mb-8">
        <p className={`font-mono text-[10px] uppercase tracking-[0.5em] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Soft Skills
        </p>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            {!isAdding ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(true)}
                className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? 'border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-500 hover:text-white' : 'border-black/10 hover:border-black/20 hover:bg-black/5 text-zinc-400 hover:text-black'}`}
                title="Add soft skill"
              >
                <Plus size={16} />
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSkill}
                  className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? 'border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10 text-green-500' : 'border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10 text-green-600'}`}
                  title="Save"
                >
                  <Save size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsAdding(false);
                    setNewSkill('');
                  }}
                  className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-500' : 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-600'}`}
                  title="Cancel"
                >
                  <X size={16} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
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
                placeholder="New soft skill..."
                className={`font-mono text-xs uppercase tracking-widest border-b pb-1 transition-all duration-300 ${isDark ? 'text-white border-white/20 focus:border-white/60' : 'text-black border-black/20 focus:border-black/60'} focus:outline-none`}
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  className={`font-mono text-xs uppercase tracking-widest border-b pb-1 transition-all duration-300 ${isDark ? 'text-white border-white/20 focus:border-white/60' : 'text-black border-black/20 focus:border-black/60'} focus:outline-none`}
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
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs uppercase tracking-widest border-b pb-1 cursor-default transition-all duration-300 ${isDark ? 'text-zinc-500 border-white/10 hover:text-white hover:border-white/60' : 'text-zinc-400 border-black/10 hover:text-black hover:border-black/60'}`}
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
    </motion.div>
  );
};

export default SoftSkillManager;
