import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ArcadeCabinets = () => {
  const [activeArcade, setActiveArcade] = useState(null);
  
  const arcadeMachines = [
    {
      id: 'classic-upright',
      name: 'CLASSIC UPRIGHT',
      year: '1978',
      description: 'The iconic standing arcade cabinet found in arcades everywhere. Houses games like Pac-Man, Galaga, and more.',
      color: '#FF0000',
      icon: '🕹️'
    },
    {
      id: 'cocktail-table',
      name: 'COCKTAIL TABLE',
      year: '1980',
      description: 'Two-player sit-down cabinet with controls on each side. Perfect for head-to-head games like Pong and puzzlers.',
      color: '#00FFFF',
      icon: '🎮'
    },
    {
      id: 'vector-cabinet',
      name: 'VECTOR CABINET',
      year: '1979',
      description: 'Specialized cabinets featuring vector graphics displays, used for games like Asteroids and Tempest.',
      color: '#FFFF00',
      icon: '📺'
    },
    {
      id: 'mini-cabinet',
      name: 'MINI CABINET',
      year: '1982',
      description: 'Compact versions of popular arcade games, often found in pizza parlors and small venues.',
      color: '#00FF00',
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Retro Header */}
      <div className="bg-[#220066] border-b-4 border-[#FF5500] p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#FF5500]">
            {/* Animated title letters */}
            {'ARCADE MUSEUM'.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
          <div className="text-center text-[#FFFF00] blink-slow">EXPLORE • LEARN • REMINISCE</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Arcade Machine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {arcadeMachines.map(machine => (
            <div
              key={machine.id}
              className="border-4 border-dashed hover:border-solid p-4 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{ borderColor: machine.color }}
              onClick={() => setActiveArcade(machine.id === activeArcade ? null : machine.id)}
            >
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center h-full flex flex-col hover:bg-gray-800 transition-colors duration-300">
                <div 
                  className="text-6xl mb-4 mx-auto bg-black w-20 h-20 flex items-center justify-center rounded-lg"
                  style={{ color: machine.color }}
                >
                  {machine.icon}
                </div>
                
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: machine.color }}
                >
                  {machine.name}
                </h2>
                
                <div className="text-xs mb-2 text-gray-500">EST. {machine.year}</div>
                
                <p className="text-gray-400 mb-4 flex-grow">{machine.description}</p>
                
                <div 
                  className="mt-4 py-2 px-4 rounded-lg font-bold text-black"
                  style={{ backgroundColor: machine.color }}
                >
                  {activeArcade === machine.id ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Arcade Details */}
        {activeArcade && (
          <div className="border-4 border-[#FF5500] p-6 rounded-lg mb-12 animate-fadeIn">
            <h3 className="text-2xl text-center text-[#FF5500] mb-6">
              {arcadeMachines.find(m => m.id === activeArcade)?.name} SHOWCASE
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg arcade-cabinet-showcase">
                {/* Placeholder for cabinet image or pixel art representation */}
                <div className="h-64 flex items-center justify-center text-9xl">
                  {arcadeMachines.find(m => m.id === activeArcade)?.icon}
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-xl mb-4 text-[#FFFF00]">TECHNICAL SPECS</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">DISPLAY:</span>
                    <span>19" CRT MONITOR</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">CONTROLS:</span>
                    <span>JOYSTICK + BUTTONS</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">CPU:</span>
                    <span>Z80 @ 3.072 MHZ</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">SOUND:</span>
                    <span>8-BIT MONO</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">DIMENSIONS:</span>
                    <span>68" x 25" x 33"</span>
                  </li>
                </ul>
                
                <h4 className="text-xl mt-6 mb-4 text-[#00FFFF]">POPULAR GAMES</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 bg-black rounded-lg border border-gray-700 flex items-center justify-center text-lg">
                        {['👾', '🚀', '🐍', '🏓', '👻', '🧱'][i % 6]}
                      </div>
                      <div className="text-xs truncate">{['GALAGA', 'ASTEROIDS', 'SNAKE', 'PONG', 'PAC-MAN', 'TETRIS'][i % 6]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scan Lines Animation */}
        <div className="fixed inset-0 pointer-events-none z-10 crt-lines"></div>
        
        {/* Did You Know Section */}
        <div className="border-4 border-[#00FFFF] p-6 rounded-lg mb-12">
          <h3 className="text-2xl text-center text-[#00FFFF] mb-6">DID YOU KNOW?</h3>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-center mb-2">The first commercial arcade video game was <span className="text-[#FFFF00]">Computer Space</span> released in 1971.</p>
            <p className="text-center mb-2">The golden age of arcade video games lasted from the late 1970s to the mid-1980s.</p>
            <p className="text-center">The highest-grossing arcade game of all time is <span className="text-[#FF00FF]">Pac-Man</span>, which has generated over $2.5 billion in revenue.</p>
          </div>
        </div>
        
        {/* Back to Home */}
        <div className="text-center mb-8">
          <Link 
            to="/"
            className="py-2 px-6 bg-[#220066] text-white rounded inline-block hover:bg-[#110033] transition-colors border-2 border-[#FF5500]"
          >
            &lt; RETURN TO LOBBY
          </Link>
        </div>
      </div>

      {/* CSS for effects */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .blink-slow {
          animation: blink 2s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .crt-lines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        
        .arcade-cabinet-showcase {
          background-color: rgba(25, 25, 35, 0.9);
          background-image: radial-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default ArcadeCabinets;