import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Generate daily challenges based on the current day
  useEffect(() => {
    const generateChallenges = () => {
      const today = new Date();
      const seed = today.getDate() + (today.getMonth() * 30);
      
      // Random but deterministic challenges based on date
      const dailyChallenges = [
        {
          id: `snake-${seed}`,
          game: 'snake',
          title: 'SNAKE MASTER',
          description: 'Reach a score of 50 without hitting walls',
          points: 250,
          difficulty: 'medium',
          color: '#00FF00'
        },
        {
          id: `invaders-${seed}`,
          game: 'space-invaders',
          title: 'ALIEN HUNTER',
          description: 'Defeat the first wave in under 60 seconds',
          points: 300,
          difficulty: 'hard',
          color: '#00FFFF'
        },
        {
          id: `pong-${seed}`,
          game: 'pong',
          title: 'PERFECT PONG',
          description: 'Win a game without missing the ball',
          points: 200,
          difficulty: 'easy',
          color: '#FFFF00'
        }
      ];
      
      setChallenges(dailyChallenges);
    };
    
    generateChallenges();
    
    // Timer for challenges reset
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerInterval);
  }, []);
  
  return (
    <div className="border-4 border-[#FF00FF] p-4 rounded-lg mb-8 bg-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#FF00FF] text-xl font-bold">DAILY CHALLENGES</h2>
        <div className="text-white font-mono">
          <span className="text-[#FFFF00] mr-2">RESETS IN:</span>
          <span className="bg-gray-900 px-2 py-1 rounded">{timeLeft}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {challenges.map(challenge => (
          <Link 
            key={challenge.id}
            to={`/games/${challenge.game}`}
            className="border-2 border-dashed p-3 rounded-lg transition-all duration-300 hover:border-solid hover:scale-105"
            style={{ borderColor: challenge.color }}
          >
            <div className="bg-gray-900 p-3 rounded h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold" style={{ color: challenge.color }}>{challenge.title}</h3>
                <span className="text-xs px-2 py-1 rounded" 
                  style={{ 
                    backgroundColor: 
                      challenge.difficulty === 'easy' ? '#00FF00' : 
                      challenge.difficulty === 'medium' ? '#FFFF00' : '#FF0000',
                    color: 'black'
                  }}
                >
                  {challenge.difficulty.toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-2 flex-grow">{challenge.description}</p>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-[#00FFFF] font-mono text-sm">+{challenge.points} PTS</div>
                <div className="text-xs text-white">PLAY NOW</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenges;