import React from 'react';

const Collectibles = () => {
  const collectibleSets = [
    {
      id: 'pixel-badges',
      title: 'PIXEL BADGES',
      description: 'Earn badges by completing game challenges and achievements.',
      color: '#FF00FF',
      icon: '🏅'
    },
    {
      id: 'game-cards',
      title: 'GAME CARDS',
      description: 'Collect digital trading cards featuring classic game characters and scenes.',
      color: '#00FFFF',
      icon: '🃏'
    },
    {
      id: 'retro-avatars',
      title: 'RETRO AVATARS',
      description: 'Unlock pixelated avatars to represent yourself in the community.',
      color: '#FFFF00',
      icon: '👾'
    }
  ];

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {collectibleSets.map(set => (
          <div 
            key={set.id}
            className="border-4 border-dashed hover:border-solid p-4 rounded-lg transition-colors duration-300"
            style={{ borderColor: set.color }}
          >
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center h-full flex flex-col hover:bg-gray-800 transition-colors duration-300">
              <div 
                className="text-6xl mb-4 mx-auto bg-black w-20 h-20 flex items-center justify-center rounded-lg"
                style={{ color: set.color }}
              >
                {set.icon}
              </div>
              
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: set.color }}
              >
                {set.title}
              </h2>
              
              <p className="text-gray-400 mb-4 flex-grow">{set.description}</p>
              
              <div 
                className="mt-4 py-2 px-4 rounded-lg font-bold text-black blink-slow cursor-pointer"
                style={{ backgroundColor: set.color }}
              >
                VIEW COLLECTION
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Example Collectibles Preview */}
      <div className="border-4 border-[#00FF00] p-6 rounded-lg mb-12">
        <h3 className="text-2xl text-center text-[#00FF00] mb-6">LATEST UNLOCKABLES</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-2 pixel-art pixel-item-${i+1} border-2 border-gray-700 rounded-lg`}></div>
              <div className="text-xs text-[#00FF00]">NEW!</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="border-4 border-[#FFFF00] p-6 rounded-lg">
        <h3 className="text-2xl text-center text-[#FFFF00] mb-6">ACHIEVEMENT PROGRESS</h3>
        <div className="space-y-4 max-w-xl mx-auto">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Master Collector</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4">
              <div className="bg-[#FFFF00] h-4 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Arcade Legend</span>
              <span>35%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4">
              <div className="bg-[#FF00FF] h-4 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>8-Bit Enthusiast</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4">
              <div className="bg-[#00FFFF] h-4 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for pixel art items */}
      <style jsx>{`
        .pixel-art {
          image-rendering: pixelated;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #000;
        }
        
        .pixel-item-1 {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAKElEQVRYhe3OMQEAIADDsIF/z4MhHBQkjdZp7WY2g0AQCAKBIPiPYAHnzwRjgitJpwAAAABJRU5ErkJggg==');
        }
        
        .pixel-item-2 {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAK0lEQVRYhe3OsQkAMAwDQZn9h3YVUgRS+RrwHai+OqCTmcxkCASBIBAEwn8EL/CvBGN9G9chAAAAAElFTkSuQmCC');
        }
        
        .pixel-item-3 {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAK0lEQVRYhe3OMQEAIADDsIF/z5MgHBQkjdZp7WY2g0AQCAKBIPiPYAHnzwRjnc8EY/COdgAAAABJRU5ErkJggg==');
        }
        
        .pixel-item-4 {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAK0lEQVRYhe3OIQEAMAADsEr/nteCEC4Kkkbr5CazGASCQBAIAsF/BAuYPxOMmV0EY5KF8k0AAAAASUVORK5CYII=');
        }
        
        .pixel-item-5 {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAK0lEQVRYhe3OsQ0AIBDDsIP/nyPehAGQ7FhwllyrOt3MTGYyCASBIBAEwn8EE5TnBGO3Y6ZWAAAAAElFTkSuQmCC');
        }
      `}</style>
    </div>
  );
};

export default Collectibles;