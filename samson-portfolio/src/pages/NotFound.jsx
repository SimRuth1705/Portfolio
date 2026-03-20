import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-10 text-center"
    >
      <div className="text-[10px] text-zinc-500 font-mono mb-6">[ SYS.ERROR.404 ]</div>
      <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none mb-4 text-transparent w-text-stroke" style={{ WebkitTextStroke: '2px rgba(255,255,255,1)' }}>
        404
      </h1>
      <p className="text-zinc-400 text-sm tracking-[0.4em] uppercase mb-12">
        Sector not found
      </p>
      <Link 
        to="/" 
        className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-300 transition-colors"
      >
        Return to Base
      </Link>
    </motion.div>
  );
};

export default NotFound;