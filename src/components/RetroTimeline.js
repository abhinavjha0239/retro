import React, { useState } from 'react';

const RetroTimeline = () => {
  const [activeEra, setActiveEra] = useState(null);
  
  const timelineEras = [
    {
      id: 'early',
      title: 'EARLY ERA',
      years: '1970-1979',
      description: 'The birth of arcade and home video gaming.',
      color: '#FF0000',
      icon: '🕰️'
    },
    {
      id: 'golden',
      title: 'GOLDEN AGE',
      years: '1980-1989',
      description: 'Arcade popularity peaks and home consoles flourish.',
      color: '#FFFF00',
      icon: '🏆'
    },
    {
      id: 'bit-wars',
      title: '16-BIT WARS',
      years: '1990-1995',
      description: 'Console wars heat up with advanced 16-bit systems.',
      color: '#00FF00',
      icon: '⚔️'
    },
    {
      id: 'transition',
      title: '3D TRANSITION',
      years: '1996-2000',
      description: 'The move from 2D pixel art to primitive 3D graphics.',
      color: '#00FFFF',
      icon: '📊'
    }
  ];
  
  const milestones = {
    'early': [
      { year: '1971', title: 'Computer Space', description: 'First commercial arcade video game' },
      { year: '1972', title: 'Pong', description: 'Arcade phenomenon that launched Atari' },
      { year: '1975', title: 'Gunfight', description: 'First arcade game with a microprocessor' },
      { year: '1977', title: 'Atari 2600', description: 'Home console that popularized cartridge gaming' },
      { year: '1978', title: 'Space Invaders', description: 'Japanese arcade game that became a global sensation' }
    ],
    'golden': [
      { year: '1980', title: 'Pac-Man', description: 'Iconic maze chase game that defined the era' },
      { year: '1981', title: 'Donkey Kong', description: 'Introduced Mario (as Jumpman) to the world' },
      { year: '1983', title: 'Video Game Crash', description: 'Industry recession in North America' },
      { year: '1985', title: 'NES/Famicom', description: 'Nintendo revitalized the home console market' },
      { year: '1989', title: 'Game Boy', description: 'Handheld console that dominated portable gaming' }
    ],
    'bit-wars': [
      { year: '1990', title: 'Super Famicom', description: 'Nintendo\'s 16-bit powerhouse console' },
      { year: '1991', title: 'Sonic the Hedgehog', description: 'Sega\'s mascot and answer to Mario' },
      { year: '1992', title: 'Mortal Kombat', description: 'Controversial fighting game that sparked debate' },
      { year: '1993', title: 'DOOM', description: 'Revolutionary first-person shooter' },
      { year: '1995', title: 'PlayStation', description: 'Sony enters the console market' }
    ],
    'transition': [
      { year: '1996', title: 'Nintendo 64', description: '3D gaming with analog control' },
      { year: '1997', title: 'Final Fantasy VII', description: 'RPG that pushed narrative in gaming' },
      { year: '1998', title: 'The Legend of Zelda: OoT', description: 'Revolutionized 3D adventure games' },
      { year: '1999', title: 'Dreamcast', description: 'Sega\'s final console with online capabilities' },
      { year: '2000', title: 'PlayStation 2', description: 'Best-selling console of all time' }
    ]
  };

  return (
    <div className="py-12 bg-black text-white font-mono">
      <div className="container mx-auto px-4">
        {/* Retro Header */}
        <div className="bg-[#220022] border-b-4 border-[#FFCC00] p-6 mb-12 rounded-t-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#FFCC00]">
            {/* Animated title letters */}
            {'RETRO TIMELINE'.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
          <div className="text-center text-[#00FFFF] blink-slow">HISTORY • EVOLUTION • NOSTALGIA</div>
        </div>

        {/* Eras Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {timelineEras.map(era => (
            <div
              key={era.id}
              className="border-4 border-dashed hover:border-solid p-4 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{ borderColor: era.color }}
              onClick={() => setActiveEra(era.id === activeEra ? null : era.id)}
            >
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center h-full flex flex-col hover:bg-gray-800 transition-colors duration-300">
                <div 
                  className="text-6xl mb-4 mx-auto bg-black w-20 h-20 flex items-center justify-center rounded-lg"
                  style={{ color: era.color }}
                >
                  {era.icon}
                </div>
                
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: era.color }}
                >
                  {era.title}
                </h2>
                
                <div className="text-sm mb-2">{era.years}</div>
                
                <p className="text-gray-400 mb-4 flex-grow">{era.description}</p>
                
                <div 
                  className="mt-4 py-2 px-4 rounded-lg font-bold text-black"
                  style={{ backgroundColor: era.color }}
                >
                  {activeEra === era.id ? 'HIDE EVENTS' : 'SHOW EVENTS'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline View */}
        {activeEra && (
          <div 
            className="border-4 p-6 rounded-lg mb-12 animate-fadeIn"
            style={{ borderColor: timelineEras.find(e => e.id === activeEra)?.color }}
          >
            <h3 
              className="text-2xl text-center mb-6"
              style={{ color: timelineEras.find(e => e.id === activeEra)?.color }}
            >
              {timelineEras.find(e => e.id === activeEra)?.title} ({timelineEras.find(e => e.id === activeEra)?.years})
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div 
                className="absolute left-0 sm:left-1/2 transform sm:translate-x-[-50%] top-0 bottom-0 w-1 h-full"
                style={{ backgroundColor: timelineEras.find(e => e.id === activeEra)?.color }}
              ></div>
              
              {/* Timeline Events */}
              <div className="space-y-12 relative">
                {milestones[activeEra].map((event, index) => (
                  <div key={index} className={`flex flex-col sm:flex-row items-center ${index % 2 === 0 ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                    <div className="sm:w-1/2 sm:px-8 z-10">
                      <div 
                        className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-2"
                        style={{ borderColor: timelineEras.find(e => e.id === activeEra)?.color }}
                      >
                        <div 
                          className="text-xl font-bold mb-1"
                          style={{ color: timelineEras.find(e => e.id === activeEra)?.color }}
                        >
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">{event.year}</div>
                        <p>{event.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline Node */}
                    <div
                      className="w-8 h-8 rounded-full z-10 flex items-center justify-center relative my-4 sm:my-0"
                      style={{ 
                        backgroundColor: timelineEras.find(e => e.id === activeEra)?.color,
                        boxShadow: `0 0 10px ${timelineEras.find(e => e.id === activeEra)?.color}`
                      }}
                    >
                      <span className="text-black font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="sm:w-1/2 hidden sm:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gaming Facts */}
        <div className="border-4 border-[#FF00FF] p-6 rounded-lg mb-12">
          <h3 className="text-2xl text-center text-[#FF00FF] mb-6">GAMING TRIVIA</h3>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b md:border-b-0 md:border-r border-gray-700 p-4">
                <h4 className="text-[#FFFF00] font-bold mb-2">HIGHEST SELLING CONSOLES</h4>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-sm">
                  <li className="text-gray-300">PlayStation 2 (155 million)</li>
                  <li className="text-gray-300">Nintendo DS (154 million)</li>
                  <li className="text-gray-300">Game Boy/Color (118 million)</li>
                  <li className="text-gray-300">PlayStation 4 (117 million)</li>
                  <li className="text-gray-300">PlayStation (102 million)</li>
                </ol>
              </div>
              
              <div className="p-4">
                <h4 className="text-[#00FFFF] font-bold mb-2">ARCADE REVENUE LEGENDS</h4>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-sm">
                  <li className="text-gray-300">Pac-Man ($2.5+ billion)</li>
                  <li className="text-gray-300">Space Invaders ($2.0+ billion)</li>
                  <li className="text-gray-300">Street Fighter II ($1.5+ billion)</li>
                  <li className="text-gray-300">Donkey Kong ($800+ million)</li>
                  <li className="text-gray-300">Ms. Pac-Man ($800+ million)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Console Evolution Slider */}
        <div className="border-4 border-[#00FF00] p-6 rounded-lg mb-12">
          <h3 className="text-2xl text-center text-[#00FF00] mb-6">CONSOLE EVOLUTION</h3>
          
          <div className="overflow-x-auto">
            <div className="console-slider flex space-x-4 py-4 min-w-max">
              {[
                { name: 'Atari 2600', year: '1977', bits: '8-bit', icon: '🎮' },
                { name: 'NES', year: '1985', bits: '8-bit', icon: '🎮' },
                { name: 'SEGA Genesis', year: '1989', bits: '16-bit', icon: '🎮' },
                { name: 'SNES', year: '1990', bits: '16-bit', icon: '🎮' },
                { name: 'PlayStation', year: '1994', bits: '32-bit', icon: '🎮' },
                { name: 'N64', year: '1996', bits: '64-bit', icon: '🎮' },
                { name: 'Dreamcast', year: '1998', bits: '128-bit', icon: '🎮' },
                { name: 'PS2', year: '2000', bits: '128-bit', icon: '🎮' }
              ].map((console, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-28 text-center bg-gray-900 p-3 rounded-lg border-2 border-gray-700 hover:border-[#00FF00] transition-colors"
                >
                  <div className="text-3xl mb-2">{console.icon}</div>
                  <div className="font-bold text-sm">{console.name}</div>
                  <div className="text-xs text-gray-400">{console.year}</div>
                  <div className="text-xs text-[#00FF00] mt-1">{console.bits}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSS for animations */}
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
          
          .console-slider::-webkit-scrollbar {
            height: 8px;
          }
          
          .console-slider::-webkit-scrollbar-track {
            background: #222;
            border-radius: 4px;
          }
          
          .console-slider::-webkit-scrollbar-thumb {
            background: #00FF00;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default RetroTimeline;