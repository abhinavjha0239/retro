import React, { useState, useEffect, useRef } from 'react';

const QuickPlayMiniGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [targets, setTargets] = useState([]);
  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const targetSpawnRef = useRef(null);
  
  // Reset the game state
  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameOver(false);
  };
  
  // Start the game
  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };
  
  // End the game
  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (targetSpawnRef.current) clearInterval(targetSpawnRef.current);
  };
  
  // Handle click on a target
  const handleTargetClick = (id) => {
    setScore(prevScore => prevScore + 10);
    setTargets(prevTargets => prevTargets.filter(target => target.id !== id));
  };
  
  // Game timer and mechanics
  useEffect(() => {
    if (isPlaying) {
      // Start the game timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      // Spawn targets periodically
      targetSpawnRef.current = setInterval(() => {
        if (gameAreaRef.current) {
          const gameArea = gameAreaRef.current.getBoundingClientRect();
          const newTarget = {
            id: Date.now(),
            x: Math.random() * (gameArea.width - 40),
            y: Math.random() * (gameArea.height - 40),
            size: Math.random() * 20 + 20,
            color: ['#00FF00', '#FF00FF', '#FFFF00', '#00FFFF'][Math.floor(Math.random() * 4)]
          };
          
          setTargets(prevTargets => [...prevTargets, newTarget]);
          
          // Remove targets after 2 seconds if not clicked
          setTimeout(() => {
            setTargets(prevTargets => prevTargets.filter(target => target.id !== newTarget.id));
          }, 2000);
        }
      }, 800);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (targetSpawnRef.current) clearInterval(targetSpawnRef.current);
      };
    }
  }, [isPlaying]);
  
  return (
    <div className="bg-gray-900 border-4 border-[#00FFFF] rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#00FFFF] text-xl font-bold">QUICK PLAY</h3>
        {isPlaying ? (
          <div className="flex items-center">
            <div className="text-[#FFFF00] mr-4">
              Score: <span className="font-bold">{score}</span>
            </div>
            <div className="text-[#FF00FF]">
              Time: <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={startGame}
            className="bg-[#00FF00] text-black px-4 py-1 rounded font-bold animate-pulse"
          >
            PLAY NOW
          </button>
        )}
      </div>
      
      <div 
        ref={gameAreaRef}
        className="relative bg-black border-2 border-gray-800 rounded w-full h-48 overflow-hidden"
        style={{ cursor: isPlaying ? 'crosshair' : 'default' }}
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#00FFFF] text-lg font-bold mb-2">TARGET PRACTICE</div>
              <div className="text-gray-400 text-sm mb-4">Click the targets as they appear!</div>
              <button 
                onClick={startGame}
                className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold hover:bg-opacity-80"
              >
                START GAME
              </button>
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="text-center">
              <div className="text-[#FF00FF] text-xl font-bold mb-2">GAME OVER</div>
              <div className="text-[#FFFF00] text-2xl font-bold mb-4">Score: {score}</div>
              <button 
                onClick={startGame}
                className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold hover:bg-opacity-80"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
        
        {/* Render targets */}
        {isPlaying && targets.map(target => (
          <div
            key={target.id}
            className="absolute rounded-full cursor-pointer animate-pulse"
            style={{
              left: `${target.x}px`,
              top: `${target.y}px`,
              width: `${target.size}px`,
              height: `${target.size}px`,
              backgroundColor: target.color
            }}
            onClick={() => handleTargetClick(target.id)}
          />
        ))}
      </div>
      
      {isPlaying && (
        <div className="mt-4 text-center">
          <button 
            onClick={endGame}
            className="text-gray-400 hover:text-white text-sm"
          >
            END GAME
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickPlayMiniGame;