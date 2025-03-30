import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Retro Header */}
      <div className="bg-[#AA0000] border-b-4 border-[#FF0000] p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#FF0000]">
            {/* Animated title letters */}
            {'ERROR 404'.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <div className="text-center text-[#FFFF00] blink-slow">GAME OVER - INSERT COIN TO CONTINUE</div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 text-center">
        <div className="glitch-text text-6xl md:text-8xl font-bold mb-8 text-[#FF0000]">404</div>
        
        <div className="text-2xl mb-8 text-[#00FFFF]">PLAYER NOT FOUND</div>
        
        <div className="mb-12 text-lg">
          <span className="text-[#FF00FF]">MISSION FAILED:</span> The page you're looking for has been moved to another castle!
        </div>
        
        <div className="space-y-6">
          <Link
            to="/"
            className="inline-block bg-[#FF0000] hover:bg-[#AA0000] text-white font-mono py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 border-b-4 border-[#880000]"
          >
            RETURN TO HOME BASE
          </Link>
          
          <div className="mt-8">
            <span>Try playing one of our retro games instead! </span>
            <Link to="/games" className="text-[#FFFF00] hover:underline">Visit Games Section</Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="pixel-art text-4xl">👾</div>
          <div className="pixel-art text-4xl">🕹️</div>
          <div className="pixel-art text-4xl">👻</div>
        </div>
      </div>

      {/* CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 crt-overlay"></div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      {/* CSS for effects */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .blink-slow {
          animation: blink 2s ease-in-out infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        
        .glitch-text {
          animation: glitch 0.5s infinite;
        }
        
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
        }
        
        .bg-grid {
          background-image: radial-gradient(#FF0000 1px, transparent 1px);
          background-size: 32px 32px;
        }
        
        .pixel-art {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
};

export default NotFound;