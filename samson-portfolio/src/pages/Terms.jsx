import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 px-10 max-w-[800px] mx-auto mb-32"
    >
      <div className="text-[10px] text-zinc-500 font-mono mb-6">[ LEGAL.DOC ]</div>
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
      
      <div className="text-zinc-400 space-y-8 leading-relaxed text-sm md:text-base">
        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">01. Agreement to Terms</h2>
          <p>By accessing or using Samson Global Enterprises' portfolio and associated services, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the service.</p>
        </section>

        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">02. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Samson Raj and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
        </section>

        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-4">03. Project Inquiries</h2>
          <p>Submitting a request through the contact form does not constitute a binding contract. All enterprise development contracts will be negotiated and signed separately.</p>
        </section>
      </div>
    </motion.div>
  );
};

export default Terms;