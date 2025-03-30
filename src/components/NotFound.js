import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8 relative">
          <h1 className="text-8xl font-bold">
            <span className="text-[#FF0000]">4</span>
            <span className="text-[#00FFFF]">0</span>
            <span className="text-[#00FF00]">4</span>
          </h1>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFFF00] animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#FF0000] animate-pulse"></div>
        </div>
        
        <p className="text-2xl font-mono text-white mb-8">
          GAME OVER - PAGE NOT FOUND
        </p>
        
        <div className="space-y-4">
          <p className="text-gray-400 font-mono">
            [PRESS START] to return to home
          </p>
          
          <a 
            href="/"
            className="inline-block bg-[#00FFFF] text-black px-8 py-3 font-bold hover:bg-[#00FFFF]/80 transition-colors"
          >
            CONTINUE → HOME
          </a>
        </div>

        {/* Pixel Art Decoration */}
        <div className="mt-12 flex justify-center space-x-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-[#00FF00]"
              style={{
                animation: `bounce 0.5s ${i * 0.1}s infinite`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;