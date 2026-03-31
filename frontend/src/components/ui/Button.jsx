import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "bg-[#f97316] text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-[#ea580c] active:scale-95",
    secondary: "bg-[#0f172a] text-white hover:bg-[#1e293b] active:scale-95",
    outline: "border-2 border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc] active:scale-95",
    ghost: "text-[#64748b] hover:bg-[#f1f5f9] active:scale-95",
    danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] active:scale-95",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
