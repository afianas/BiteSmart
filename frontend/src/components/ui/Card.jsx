import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Card = ({ children, className = '', animate = true, delay = 0, ...props }) => {
  const baseStyles = "bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f1f5f9] overflow-hidden";
  
  if (!animate) {
    return (
      <div className={`${baseStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
