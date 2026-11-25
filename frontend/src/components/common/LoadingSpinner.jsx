import React from 'react';

const LoadingSpinner = ({ size = 'md', text = null }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-blue-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <p className="text-sm text-slate-500 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
