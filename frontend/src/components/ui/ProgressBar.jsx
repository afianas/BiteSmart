import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value, label, percentageLabel = true, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {label && <span className="text-sm font-medium text-[#64748b]">{label}</span>}
        {percentageLabel && <span className="text-xs font-bold text-[#1e293b]">{Math.round(value)}%</span>}
      </div>
      <div className="h-2.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
