import React from 'react';
import Leaderboard from '../components/Leaderboard';
import { Link } from 'react-router-dom';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Retro Header */}
      <div className="bg-[#550000] border-b-4 border-[#FF0000] p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#FF0000]">
            {/* Animated title letters */}
            {'LEADERBOARDS'.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <div className="text-center text-[#FFFF00] blink-slow">COMPETE • DOMINATE • CONQUER</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Leaderboard />
        
        {/* Achievement Stats */}
        <div className="max-w-2xl mx-auto mt-12 border-4 border-[#FF0000] p-6 rounded-lg">
          <h3 className="text-2xl text-center text-[#FF0000] mb-4">ACHIEVEMENT STATS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-[#00FFFF] text-2xl font-bold">512</div>
              <div className="text-sm">TOP SCORES</div>
            </div>
            <div className="text-center">
              <div className="text-[#FFFF00] text-2xl font-bold">96</div>
              <div className="text-sm">CHAMPIONS</div>
            </div>
            <div className="text-center">
              <div className="text-[#00FF00] text-2xl font-bold">24</div>
              <div className="text-sm">RECORDS</div>
            </div>
            <div className="text-center">
              <div className="text-[#FF00FF] text-2xl font-bold">8</div>
              <div className="text-sm">PERFECT</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            to="/"
            className="py-2 px-6 bg-[#550000] text-white rounded inline-block hover:bg-[#330000] transition-colors border-2 border-[#FF0000]"
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

export default LeaderboardPage;