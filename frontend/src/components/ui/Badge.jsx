import React from 'react';

const Badge = ({ children, variant = 'info', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-rose-50 text-rose-700 border border-rose-100",
    orange: "bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]",
    neutral: "bg-slate-50 text-slate-600 border border-slate-100",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
