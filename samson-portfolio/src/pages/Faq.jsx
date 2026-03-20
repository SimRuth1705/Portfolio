import React from 'react';
import { motion } from 'framer-motion';

const Faq = () => {
  const faqs = [
    {
      question: "What is your primary tech stack?",
      answer: "I specialize in the MERN stack (MongoDB, Express, React, Node.js), utilizing Tailwind CSS for styling and Framer Motion for complex, high-performance UI animations."
    },
    {
      question: "Are you available for freelance work?",
      answer: "Yes, I am currently accepting select enterprise-grade freelance projects. Please use the contact form on the home page to initiate a transmission."
    },
    {
      question: "What is the typical timeline for a web application?",
      answer: "Timelines vary wildly based on scope. A static portfolio might take a week, while a full-scale e-commerce engine like Pallet takes several months of dedicated engineering."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 px-10 max-w-[800px] mx-auto mb-32"
    >
      <div className="text-[10px] text-zinc-500 font-mono mb-6">[ DATA.QUERY ]</div>
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">F.A.Q.</h1>
      
      <div className="space-y-12">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-white/10 pb-8">
            <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{faq.answer}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Faq;