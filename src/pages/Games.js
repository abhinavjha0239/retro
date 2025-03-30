import React from 'react';
import { Link } from 'react-router-dom';

const Games = () => {
  const gamesList = [
    {
      id: 'snake',
      title: 'SNAKE',
      description: 'Classic snake game. Eat the food, grow longer, don\'t hit the walls or yourself!',
      color: '#00FF00',
      thumbnail: '🐍'
    },
    {
      id: 'pong',
      title: 'PONG',
      description: 'The original arcade classic. Bounce the ball past your opponent\'s paddle.',
      color: '#FFFF00',
      thumbnail: '🏓'
    },
    {
      id: 'tetris',
      title: 'TETRIS',
      description: 'Arrange falling blocks to create complete rows. How many rows can you clear?',
      color: '#FF00FF',
      thumbnail: '🧱'
    },
    {
      id: 'space-invaders',
      title: 'SPACE INVADERS',
      description: 'Defend Earth from descending alien attackers!',
      color: '#00FFFF',
      thumbnail: '👾'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Retro Header */}
      <div className="bg-[#000066] border-b-4 border-[#FF00FF] p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#00FFFF]">
            <span className="inline-block animate-pulse">R</span>
            <span className="inline-block animate-pulse delay-100">E</span>
            <span className="inline-block animate-pulse delay-200">T</span>
            <span className="inline-block animate-pulse delay-300">R</span>
            <span className="inline-block animate-pulse delay-400">O</span>
            <span className="inline-block"> </span>
            <span className="inline-block animate-pulse delay-500">A</span>
            <span className="inline-block animate-pulse delay-600">R</span>
            <span className="inline-block animate-pulse delay-700">C</span>
            <span className="inline-block animate-pulse delay-800">A</span>
            <span className="inline-block animate-pulse delay-900">D</span>
            <span className="inline-block animate-pulse delay-1000">E</span>
          </h1>
          <div className="text-center text-[#FFFF00]">SELECT YOUR GAME</div>
        </div>
      </div>

      {/* Game Selection Grid */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {gamesList.map(game => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="group border-4 border-dashed hover:border-solid p-4 rounded-lg transition-colors duration-300"
              style={{ borderColor: game.color }}
            >
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center h-full flex flex-col hover:bg-gray-800 transition-colors duration-300">
                <div 
                  className="text-6xl mb-4 mx-auto bg-black w-20 h-20 flex items-center justify-center rounded-lg"
                  style={{ color: game.color }}
                >
                  {game.thumbnail}
                </div>
                
                <h2 
                  className="text-2xl font-bold mb-2 group-hover:underline"
                  style={{ color: game.color }}
                >
                  {game.title}
                </h2>
                
                <p className="text-gray-400 mb-4 flex-grow">{game.description}</p>
                
                <div 
                  className="mt-4 py-2 px-4 rounded-lg font-bold text-black blink-slow"
                  style={{ backgroundColor: game.color }}
                >
                  PLAY NOW
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pixelated Characters */}
        <div className="flex justify-center space-x-8 mb-12">
          <div className="text-center">
            <div className="pixel-art pixel-pacman h-12 w-12 mx-auto mb-2"></div>
            <div className="text-[#FFFF00]">CLASSIC</div>
          </div>
          <div className="text-center">
            <div className="pixel-art pixel-ghost h-12 w-12 mx-auto mb-2"></div>
            <div className="text-[#FF00FF]">ADDICTIVE</div>
          </div>
          <div className="text-center">
            <div className="pixel-art pixel-mario h-12 w-12 mx-auto mb-2"></div>
            <div className="text-[#FF0000]">NOSTALGIC</div>
          </div>
          <div className="text-center">
            <div className="pixel-art pixel-invader h-12 w-12 mx-auto mb-2"></div>
            <div className="text-[#00FF00]">CHALLENGING</div>
          </div>
        </div>
        
        {/* CRT lines effect */}
        <div className="fixed inset-0 pointer-events-none z-10 crt-overlay"></div>
        
        {/* Back to Home */}
        <div className="text-center mb-8">
          <Link 
            to="/"
            className="py-2 px-6 bg-[#0000FF] text-white rounded inline-block hover:bg-[#0000AA] transition-colors"
          >
            &lt; BACK TO HOME
          </Link>
        </div>
        
        {/* High Score Board */}
        <div className="max-w-2xl mx-auto border-4 border-[#00FFFF] p-6 rounded-lg">
          <h3 className="text-2xl text-center text-[#00FFFF] mb-4">HIGH SCORES</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-[#FFFF00]">
                  <th className="py-2">RANK</th>
                  <th className="py-2">PLAYER</th>
                  <th className="py-2">GAME</th>
                  <th className="py-2">SCORE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-center">1</td>
                  <td className="py-2 text-center text-[#FF00FF]">ACE</td>
                  <td className="py-2 text-center">TETRIS</td>
                  <td className="py-2 text-center">24,500</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-center">2</td>
                  <td className="py-2 text-center text-[#00FF00]">NEO</td>
                  <td className="py-2 text-center">SNAKE</td>
                  <td className="py-2 text-center">19,800</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-center">3</td>
                  <td className="py-2 text-center text-[#00FFFF]">PIXL</td>
                  <td className="py-2 text-center">PONG</td>
                  <td className="py-2 text-center">15,200</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-center">4</td>
                  <td className="py-2 text-center text-[#FFFF00]">8BIT</td>
                  <td className="py-2 text-center">INVADERS</td>
                  <td className="py-2 text-center">12,750</td>
                </tr>
                <tr>
                  <td className="py-2 text-center">5</td>
                  <td className="py-2 text-center text-[#FF0000]">MAX</td>
                  <td className="py-2 text-center">TETRIS</td>
                  <td className="py-2 text-center">10,300</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* CSS for pixel art and animations */}
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
        
        .pixel-art {
          image-rendering: pixelated;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        
        .pixel-pacman {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAlUlEQVR4Ae3UwQnDMBBE0ZHIBdKEq0gRKSHdJJcU4Q5cjTtwAy7Bi+DfbBYNeFqQMVjeA/swOAoRfRXCvdddIPMTUQvOYSgCJPpQHAAFLKALOAeBXj5Q3fKnyAG7n8V7eTonqFd+FxkZGRkZGRkZGf+LmZmZmZmZmf0KdF7xnpkxdUG98rtIQIDXgkUQ94p776/6APCMThQGSSIqAAAAAElFTkSuQmCC');
        }
        
        .pixel-ghost {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAcklEQVR4Ae2TsQ3DMAwEnQMXLsIFWIRbN+ndeQBPkRncZwwvkEJAmkj+Bx7gQOCdSJqm+QlJXpKXquqHXSQfkTRIWgGw+xlXSYckAfxmuAew+xkXSR5HrwDYDWCTtJwCHMHuZ1x+BnAGu59x+RlAswMVXTQU/ojEHgAAAABJRU5ErkJggg==');
        }
        
        .pixel-mario {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAApklEQVR4Ae3UsQ3CMBCF4WdIhWCEdGkZgA3STVgBJqBLSZsuI1BQUSDlY0UOFvLZJeRC8pculv2fTuecmZkV2GKHAwYr6HHBDes5wBsP5I9gE7wiFl0N0OIUdC4YscUeJyw9kGCFOw5+YI8rnnhbQa7S5ynK6wB9DZChLwrINZZVAX0jSIoWXRYw1gCywN+imwuIBWz+PtFcwFgD5DrHUtGlvzcbvgDgD1cUhBairQAAAABJRU5ErkJggg==');
        }
        
        .pixel-invader {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAS0lEQVR4Ae3SMQ0AMAgEwTOoAgUIwAQSMIKAtf4I2JvkcpO3TlLb+UQkIiIi8i+Q5Jb0JPskp6RH0ieZJNeXA3NJjyRJep8NSRsXWh4Eqo+VxAAAAABJRU5ErkJggg==');
        }
      `}</style>
    </div>
  );
};

export default Games;