import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import QuickPlayMiniGame from '../components/QuickPlayMiniGame';
import { Link } from 'react-router-dom';

const Home = ({ DailyChallengesComponent, CommunityFeedComponent }) => {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <main id="main-content" className="flex-1 relative pt-16 md:pt-20">
        {/* Retro Header */}
        <div className="bg-[#330033] border-b-4 border-[#FFFF00] p-4">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-[#FFFF00]">
              {/* Animated title letters */}
              {'RETROVERSE'.split('').map((letter, index) => (
                <span 
                  key={index} 
                  className="inline-block animate-pulse"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <div className="text-center text-[#00FFFF] blink-slow">WELCOME TO THE FUTURE OF RETRO</div>
          </div>
        </div>

        <Hero />
        
        {/* Main Content Sections */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Daily Challenges */}
              <div className="bg-black border-4 border-[#00FFFF] rounded-lg p-6 mb-8">
                <h2 className="text-3xl text-[#FFFF00] mb-4 flex items-center" id="daily-challenges">
                  <span className="text-3xl mr-2">🗓️</span> DAILY CHALLENGES
                </h2>
                {DailyChallengesComponent}
              </div>
              
              {/* Community Feed */}
              <div className="bg-black border-4 border-[#FF00FF] rounded-lg p-6">
                <h2 className="text-3xl text-[#FF00FF] mb-4 flex items-center">
                  <span className="text-3xl mr-2">👾</span> COMMUNITY FEED
                </h2>
                {CommunityFeedComponent}
              </div>
            </div>
            
            <div>
              {/* Quick Play Mini Game */}
              <div className="bg-black border-4 border-[#00FF00] rounded-lg p-6 mb-8">
                <h2 className="text-3xl text-[#00FF00] mb-4 flex items-center">
                  <span className="text-3xl mr-2">🎮</span> INSTANT PLAY
                </h2>
                <QuickPlayMiniGame />
              </div>
            </div>
          </div>
        </div>
        
        <Features />

        {/* Quick Access Grid */}
        <div className="container mx-auto px-6 py-12 mb-12">
          <h2 className="text-3xl text-[#00FFFF] mb-6 text-center">EXPLORE RETROVERSE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/games" className="group bg-black border-4 border-[#00FF00] p-6 rounded-lg hover:bg-[#001100] transition-all" id="games-menu-item">
              <h3 className="text-[#00FF00] text-2xl mb-2">GAMES</h3>
              <p className="text-gray-400">Play classic arcade games</p>
            </Link>
            <Link to="/gallery" className="group bg-black border-4 border-[#00FFFF] p-6 rounded-lg hover:bg-[#001111] transition-all">
              <h3 className="text-[#00FFFF] text-2xl mb-2">GALLERY</h3>
              <p className="text-gray-400">Explore pixel artworks</p>
            </Link>
            <Link to="/collectibles" className="group bg-black border-4 border-[#FF00FF] p-6 rounded-lg hover:bg-[#110011] transition-all">
              <h3 className="text-[#FF00FF] text-2xl mb-2">COLLECTIBLES</h3>
              <p className="text-gray-400">Discover digital treasures</p>
            </Link>
            <Link to="/community" className="group bg-black border-4 border-[#FFFF00] p-6 rounded-lg hover:bg-[#111100] transition-all" id="community-menu-item">
              <h3 className="text-[#FFFF00] text-2xl mb-2">COMMUNITY</h3>
              <p className="text-gray-400">Join fellow enthusiasts</p>
            </Link>
          </div>
        </div>
      </main>

      {/* CRT Effect Overlay - Restored with enhanced visuals */}
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
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default Home;