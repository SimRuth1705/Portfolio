import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import LazySection from '../components/LazySection';

// Above the fold components are loaded synchronously
import Hero from '../components/Hero';

// Below the fold components are lazy loaded
const About = lazy(() => import('../components/About'));
const Skills = lazy(() => import('../components/Skills'));
const Projects = lazy(() => import('../components/Projects'));
const Timeline = lazy(() => import('../components/Timeline'));
const GitHubStats = lazy(() => import('../components/GitHubStats'));
const DevLog = lazy(() => import('../components/DevLog'));
const Lab = lazy(() => import('../components/Lab'));
const SystemSpecs = lazy(() => import('../components/SystemSpecs'));
const ApiStatus = lazy(() => import('../components/ApiStatus'));
const Contact = lazy(() => import('../components/Contact'));

const Fallback = () => <div className="h-[200px] w-full opacity-0" />;

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
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <About />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <Skills />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <Projects />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <Timeline />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <GitHubStats />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <DevLog />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <Lab />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <SystemSpecs />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <ApiStatus />
          </LazySection>
        </Suspense>
      </motion.div>
      
      <motion.div className="relative" variants={itemVariants}>
        <Suspense fallback={<Fallback />}>
          <LazySection>
            <Contact />
          </LazySection>
        </Suspense>
      </motion.div>
    </motion.div>
  );
};

export default Home;