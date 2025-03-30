import React from 'react';
import Collectibles from '../components/Collectibles';
import { Link } from 'react-router-dom';

const CollectiblesPage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Retro Header */}
      <div className="bg-[#660066] border-b-4 border-[#FF00FF] p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#FF00FF]">
            {/* Animated title letters */}
            {'DIGITAL COLLECTIBLES'.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <div className="text-center text-[#00FFFF] blink-slow">COLLECT • TRADE • SHOWCASE</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Collectibles />
        
        {/* Stats Section */}
        <div className="max-w-2xl mx-auto mt-12 border-4 border-[#FF00FF] p-6 rounded-lg">
          <h3 className="text-2xl text-center text-[#FF00FF] mb-4">COLLECTION STATS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-[#00FFFF] text-2xl font-bold">42</div>
              <div className="text-sm">TOTAL BADGES</div>
            </div>
            <div className="text-center">
              <div className="text-[#FFFF00] text-2xl font-bold">15</div>
              <div className="text-sm">RARE ITEMS</div>
            </div>
            <div className="text-center">
              <div className="text-[#FF0000] text-2xl font-bold">7</div>
              <div className="text-sm">LEGENDARY</div>
            </div>
            <div className="text-center">
              <div className="text-[#00FF00] text-2xl font-bold">20</div>
              <div className="text-sm">COMMON</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            to="/"
            className="py-2 px-6 bg-[#660066] text-white rounded inline-block hover:bg-[#440044] transition-colors border-2 border-[#FF00FF]"
          >
            &lt; RETURN TO BASE
          </Link>
        </div>
      </div>

      {/* CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 crt-overlay"></div>

      {/* CSS for effects */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .blink-slow {
          animation: blink 2s ease-in-out infinite;
        }
        
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default CollectiblesPage;