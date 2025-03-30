import React, { useState, useEffect } from 'react';

const AchievementsManager = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState(null);
  const [achievements, setAchievements] = useState(() => {
    // Load saved achievements from localStorage if available
    const saved = localStorage.getItem('retroverse_achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  // Check for any newly unlocked achievements
  useEffect(() => {
    // Simulate unlocking a random achievement for demo purposes
    // In a real app, this would be triggered by actual user actions
    const unlockRandomAchievement = () => {
      const lockedAchievements = achievements.filter(a => !a.unlocked);
      if (lockedAchievements.length > 0) {
        const randomIndex = Math.floor(Math.random() * lockedAchievements.length);
        const achievementToUnlock = lockedAchievements[randomIndex];
        
        const updatedAchievements = achievements.map(a => 
          a.id === achievementToUnlock.id ? {...a, unlocked: true, dateUnlocked: new Date().toISOString()} : a
        );
        
        setAchievements(updatedAchievements);
        setLatestAchievement(achievementToUnlock);
        setShowPopup(true);
        
        // Save to localStorage
        localStorage.setItem('retroverse_achievements', JSON.stringify(updatedAchievements));
        
        // Hide popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
    };
    
    // In a real app, this would be triggered by actual game events
    // For this demo, we'll add a button in the UI to simulate unlocking
  }, [achievements]);

  return {
    achievements,
    showAchievementPopup: (achievementId) => {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        setLatestAchievement(achievement);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
    },
    AchievementPopup: () => (
      <div className={`fixed top-20 right-0 z-50 transition-all duration-500 ${showPopup ? 'translate-x-0' : 'translate-x-full'}`}>
        {latestAchievement && (
          <div className="bg-black border-4 border-[#FFFF00] p-4 m-4 rounded-lg shadow-xl max-w-xs">
            <div className="text-[#FFFF00] text-xl font-bold mb-2">ACHIEVEMENT UNLOCKED!</div>
            <div className="flex items-center">
              <div className="w-16 h-16 mr-3 bg-[#FF00FF] rounded-full flex items-center justify-center text-2xl">
                {latestAchievement.icon}
              </div>
              <div>
                <div className="text-white font-bold">{latestAchievement.title}</div>
                <div className="text-gray-400 text-sm">{latestAchievement.description}</div>
                <div className="text-[#00FFFF] text-sm mt-1">+{latestAchievement.points} POINTS</div>
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    AchievementsGrid: ({ onClose }) => (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        <div className="bg-gray-900 border-4 border-[#00FFFF] p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#00FFFF] text-2xl font-bold">ACHIEVEMENTS</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-[#FF00FF] text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`border-2 p-3 rounded-lg ${achievement.unlocked ? 'border-[#FFFF00]' : 'border-gray-700 opacity-70'}`}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-14 h-14 mr-3 rounded-full flex items-center justify-center text-2xl ${achievement.unlocked ? 'bg-[#FF00FF]' : 'bg-gray-800'}`}
                  >
                    {achievement.unlocked ? achievement.icon : '?'}
                  </div>
                  <div>
                    <div className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-gray-400 text-sm">{achievement.description}</div>
                    {achievement.unlocked && (
                      <div className="text-[#00FFFF] text-xs mt-1">
                        +{achievement.points} POINTS • Unlocked {formatDate(achievement.dateUnlocked)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <div className="text-[#FFFF00] mb-2">ACHIEVEMENT PROGRESS</div>
            <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
              <div 
                className="bg-[#00FF00] h-full transition-all duration-500"
                style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-white mt-2">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
            </div>
          </div>
        </div>
      </div>
    ),
    unlockAchievement: (achievementId) => {
      const updatedAchievements = achievements.map(a => 
        a.id === achievementId && !a.unlocked ? 
          {...a, unlocked: true, dateUnlocked: new Date().toISOString()} : a
      );
      
      const newlyUnlocked = updatedAchievements.find(a => a.id === achievementId && a.unlocked);
      
      if (newlyUnlocked) {
        setAchievements(updatedAchievements);
        setLatestAchievement(newlyUnlocked);
        setShowPopup(true);
        
        // Save to localStorage
        localStorage.setItem('retroverse_achievements', JSON.stringify(updatedAchievements));
        
        // Hide popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
        
        return true;
      }
      
      return false;
    }
  };
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

// Initial achievements data
const initialAchievements = [
  {
    id: 'first_game',
    title: 'FIRST STEPS',
    description: 'Play your first retro game',
    icon: '🎮',
    points: 50,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'snake_master',
    title: 'SNAKE CHARMER',
    description: 'Reach a score of 100 in Snake',
    icon: '🐍',
    points: 100,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'space_hero',
    title: 'SPACE DEFENDER',
    description: 'Destroy 50 alien ships in Space Invaders',
    icon: '👾',
    points: 150,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'tetris_god',
    title: 'BLOCK MASTER',
    description: 'Clear 10 lines in Tetris',
    icon: '🧱',
    points: 150,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'pong_champion',
    title: 'PING PONG PRO',
    description: 'Win a game of Pong without missing',
    icon: '🏓',
    points: 200,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'daily_streak',
    title: 'DAILY PLAYER',
    description: 'Complete 3 daily challenges in a row',
    icon: '🔥',
    points: 250,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'konami_master',
    title: 'CODE BREAKER',
    description: 'Discover the Konami code Easter egg',
    icon: '🔑',
    points: 300,
    unlocked: false,
    dateUnlocked: null
  },
  {
    id: 'community_star',
    title: 'SOCIAL BUTTERFLY',
    description: 'Make your first post in the community',
    icon: '🦋',
    points: 100,
    unlocked: false,
    dateUnlocked: null
  }
];

export default AchievementsManager;