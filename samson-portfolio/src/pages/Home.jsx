import React from 'react';
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

const Home = () => {
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
      <motion.div className="relative" variants={itemVariants}><Hero /></motion.div>
      <motion.div className="relative" variants={itemVariants}><About /></motion.div>
      <motion.div className="relative" variants={itemVariants}><Skills /></motion.div>
      <motion.div className="relative" variants={itemVariants}><Projects /></motion.div>
      <motion.div className="relative" variants={itemVariants}><Timeline /></motion.div>
      <motion.div className="relative" variants={itemVariants}><GitHubStats /></motion.div>
      <motion.div className="relative" variants={itemVariants}><DevLog /></motion.div>
      <motion.div className="relative" variants={itemVariants}><Lab /></motion.div>
      <motion.div className="relative" variants={itemVariants}><SystemSpecs /></motion.div>
      <motion.div className="relative" variants={itemVariants}><ApiStatus /></motion.div>
      <motion.div className="relative" variants={itemVariants}><Contact /></motion.div>
    </motion.div>
  );
};

export default Home;