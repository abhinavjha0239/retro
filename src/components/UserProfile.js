import React, { useState, useContext, createContext } from 'react';

// Create a context for user profile
const UserProfileContext = createContext();

// Custom hook to use the user profile
export const useUserProfile = () => useContext(UserProfileContext);

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('retroverse_user_profile');
    return saved ? JSON.parse(saved) : defaultUserProfile;
  });

  // Save profile data whenever it changes
  const saveProfile = (newProfile) => {
    const updatedProfile = { ...userProfile, ...newProfile };
    setUserProfile(updatedProfile);
    localStorage.setItem('retroverse_user_profile', JSON.stringify(updatedProfile));
  };

  // Toggle profile modal
  const toggleProfile = () => {
    setShowProfileModal(!showProfileModal);
  };

  // Add points to the user profile - will be used in future development
  // eslint-disable-next-line no-unused-vars
  const addPoints = (amount) => {
    const newPoints = userProfile.points + amount;
    const newLevel = Math.floor(newPoints / 1000) + 1; // Level up every 1000 points
    
    saveProfile({
      points: newPoints,
      level: newLevel > userProfile.level ? newLevel : userProfile.level
    });
    
    // Return true if user leveled up
    return newLevel > userProfile.level;
  };

  // Update high score if the new score is higher
  // eslint-disable-next-line no-unused-vars
  const updateHighScore = (game, score) => {
    const currentHighScore = userProfile.highScores[game] || 0;
    
    if (score > currentHighScore) {
      const newHighScores = {
        ...userProfile.highScores,
        [game]: score
      };
      
      saveProfile({ highScores: newHighScores });
      return true; // Score was updated
    }
    
    return false; // Score was not updated
  };

  // Add a badge to the user profile
  // eslint-disable-next-line no-unused-vars
  const addBadge = (badge) => {
    // Don't add if badge already exists
    if (userProfile.badges.some(b => b.id === badge.id)) {
      return false;
    }
    
    const newBadges = [...userProfile.badges, badge];
    saveProfile({ badges: newBadges });
    return true;
  };

  // Increment games played counter
  // eslint-disable-next-line no-unused-vars
  const incrementGamesPlayed = () => {
    saveProfile({ gamesPlayed: userProfile.gamesPlayed + 1 });
  };

  // Profile Modal Component
  const ProfileModal = () => {
    if (!showProfileModal) return null;

    const { username, level, points, highScores, badges, gamesPlayed } = userProfile;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        <div className="bg-gray-900 border-4 border-[#00FF00] p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#00FF00] text-2xl font-bold">PLAYER PROFILE</h2>
            <button 
              onClick={toggleProfile}
              className="text-white hover:text-[#FF00FF] text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6 flex items-center">
            <div className="w-20 h-20 bg-[#FF00FF] mr-4 flex items-center justify-center rounded-full">
              <div className="text-3xl">👾</div>
            </div>
            <div>
              <div className="text-white text-xl font-bold">{username}</div>
              <div className="text-[#00FFFF]">LEVEL {level}</div>
              <div className="text-[#FFFF00]">{points} POINTS</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-[#FF00FF] mb-2 font-bold">BADGES</div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <div 
                  key={index} 
                  className="w-10 h-10 bg-black border-2 border-[#FF00FF] rounded-full flex items-center justify-center"
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
              {badges.length === 0 && (
                <div className="text-gray-500 text-sm">No badges yet. Keep playing to earn them!</div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-[#00FFFF] mb-2 font-bold">HIGH SCORES</div>
            <div className="bg-black p-3 rounded">
              {Object.entries(highScores).length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 py-1">GAME</th>
                      <th className="text-right text-gray-400 py-1">SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(highScores).map(([game, score]) => (
                      <tr key={game} className="border-b border-gray-900">
                        <td className="py-2 text-white">{game}</td>
                        <td className="py-2 text-[#FFFF00] text-right">{score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 text-sm py-2">Play games to set high scores!</div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-[#FFFF00] mb-2 font-bold">STATS</div>
            <div className="bg-black p-3 rounded">
              <div className="flex justify-between py-1">
                <span className="text-white">Games Played</span>
                <span className="text-[#00FF00]">{gamesPlayed}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white">Win Rate</span>
                <span className="text-[#00FF00]">68%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white">Time Played</span>
                <span className="text-[#00FF00]">4h 32m</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={toggleProfile}
              className="bg-[#00FF00] text-black py-2 px-6 rounded font-bold hover:bg-opacity-90"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Value to be provided by context
  const contextValue = {
    userProfile,
    ProfileModal,
    toggleProfile,
    saveProfile,
    addPoints,
    updateHighScore,
    addBadge,
    incrementGamesPlayed
  };
  
  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Default user profile
const defaultUserProfile = {
  username: "PLAYER1",
  level: 1,
  points: 0,
  highScores: {},
  badges: [],
  gamesPlayed: 0
};

export default UserProfileProvider;