import React from 'react';

const RetroLoader = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block relative">
          <div className="w-16 h-16 border-4 border-[#00FFFF] animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#FF0000] animate-ping"></div>
        </div>
        <p className="text-[#00FF00] font-mono mt-4 animate-pulse">LOADING...</p>
        <div className="flex gap-2 justify-center mt-4">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-[#FFFF00]"
              style={{
                animation: `bounce 0.8s ${i * 0.2}s infinite`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetroLoader;