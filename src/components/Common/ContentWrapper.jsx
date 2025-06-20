import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ContentWrapper = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="ml-64 p-6 min-h-screen bg-white"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
};

export default ContentWrapper;
