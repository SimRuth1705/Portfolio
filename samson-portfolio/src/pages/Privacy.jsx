import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen pt-40 px-10 max-w-[800px] mx-auto"
    >
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
      <div className="text-zinc-400 space-y-6 leading-relaxed">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>This is the official privacy policy for Samson Global Enterprises. Here you can detail how you handle user data, contact form submissions, and analytics.</p>
        {/* Add more content here later */}
      </div>
    </motion.div>
  );
};

export default Privacy;