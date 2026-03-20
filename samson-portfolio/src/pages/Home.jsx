import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Layout Components
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Timeline from '../components/Timeline';
import DevLog from '../components/DevLog';
import GitHubStats from '../components/GitHubStats';
import Lab from '../components/Lab';
import SystemSpecs from '../components/SystemSpecs';
import ApiStatus from '../components/ApiStatus';
import Contact from '../components/Contact';

// Admin Components
import AdminSettingsButton from '../components/AdminSettingsButton';
import AddProjectModal from '../components/AddProjectModal';
import AddTimelineModal from '../components/AddTimelineModal';
import AddTestimonialModal from '../components/AddTestimonialModal';
import AddDevLogModal from '../components/AddDevLogModal';

import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../constants';

const Home = () => {
  const { isAdmin } = useAuth();
  const [modals, setModals] = useState({
    project: false,
    timeline: false,
    testimonial: false,
    devlog: false
  });

  const toggleModal = (type, state) => setModals(prev => ({ ...prev, [type]: state }));

  const handleCreate = async (endpoint, data, modalType) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toggleModal(modalType, false);
        // Dispatch refresh event for components to reload data
        window.dispatchEvent(new CustomEvent('content-updated'));
      }
    } catch (err) {
      console.error(`Failed to create ${modalType}:`, err);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={sectionVariants}
      className="relative z-10"
    >
      <motion.div variants={itemVariants}><Hero /></motion.div>
      <motion.div variants={itemVariants}><About /></motion.div>
      <motion.div variants={itemVariants}><Skills /></motion.div>
      <motion.div variants={itemVariants}><Projects /></motion.div>
      <motion.div variants={itemVariants}><Timeline /></motion.div>
      <motion.div variants={itemVariants}><GitHubStats /></motion.div>
      <motion.div variants={itemVariants}><DevLog /></motion.div>
      <motion.div variants={itemVariants}><Lab /></motion.div>
      <motion.div variants={itemVariants}><SystemSpecs /></motion.div>
      <motion.div variants={itemVariants}><ApiStatus /></motion.div>
      <motion.div variants={itemVariants}><Contact /></motion.div>


          <AddProjectModal
            isOpen={modals.project}
            onClose={() => toggleModal('project', false)}
            onSubmit={(data) => handleCreate('/api/projects', data, 'project')}
          />
          <AddTimelineModal
            isOpen={modals.timeline}
            onClose={() => toggleModal('timeline', false)}
            onSubmit={(data) => handleCreate('/api/timeline', data, 'timeline')}
          />
          <AddTestimonialModal
            isOpen={modals.testimonial}
            onClose={() => toggleModal('testimonial', false)}
            onSubmit={(data) => handleCreate('/api/testimonials', data, 'testimonial')}
          />
          <AddDevLogModal
            isOpen={modals.devlog}
            onClose={() => toggleModal('devlog', false)}
            onSubmit={(data) => handleCreate('/api/devlogs', data, 'devlog')}
          />
    </motion.div>
  );
};

export default Home;