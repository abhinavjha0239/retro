import React, { useState, useEffect } from 'react';

const UserProfile = ({ onClose, isOpen }) => {
  const [profile, setProfile] = useState(() => {
    // Load profile from localStorage or use default values
    const savedProfile = localStorage.getItem('retroverse_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      username: 'PLAYER1',
      avatar: '👾',
      level: 1,
      points: 0,
      joinDate: new Date().toISOString(),
      gamesPlayed: 0,
      highScores: {
        snake: 0,
        pong: 0,
        tetris: 0,
        'space-invaders': 0
      },
      badges: []
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile.username,
    avatar: profile.avatar
  });
  
  // Available avatars for selection
  const avatarOptions = ['👾', '🤖', '👽', '🎮', '🕹️', '👑', '🚀', '🌌', '🎲', '🎯'];
  
  useEffect(() => {
    // Save profile to localStorage whenever it changes
    localStorage.setItem('retroverse_profile', JSON.stringify(profile));
  }, [profile]);
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      username: editForm.username || 'PLAYER1',
      avatar: editForm.avatar
    });
    setIsEditing(false);
  };
  
  const addPoints = (points) => {
    const newPoints = profile.points + points;
    const newLevel = Math.floor(newPoints / 1000) + 1;
    
    setProfile({
      ...profile,
      points: newPoints,
      level: newLevel
    });
    
    return {
      newPoints,
      newLevel,
      levelUp: newLevel > profile.level
    };
  };
  
  const updateHighScore = (game, score) => {
    if (score > profile.highScores[game]) {
      setProfile({
        ...profile,
        highScores: {
          ...profile.highScores,
          [game]: score
        }
      });
      return true;
    }
    return false;
  };
  
  const addBadge = (badge) => {
    if (!profile.badges.some(b => b.id === badge.id)) {
      setProfile({
        ...profile,
        badges: [...profile.badges, badge]
      });
      return true;
    }
    return false;
  };
  
  const incrementGamesPlayed = () => {
    setProfile({
      ...profile,
      gamesPlayed: profile.gamesPlayed + 1
    });
  };
  
  if (!isOpen) return null;
  
  // Format join date 
  const formatJoinDate = () => {
    const date = new Date(profile.joinDate);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-gray-900 border-4 border-[#00FF00] p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#00FF00] text-2xl font-bold">YOUR PROFILE</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#FF00FF] text-xl"
          >
            ✕
          </button>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-[#FFFF00] mb-2">USERNAME</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                maxLength={15}
                className="w-full bg-black border-2 border-[#00FFFF] text-white p-2 rounded font-mono"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-[#FFFF00] mb-2">AVATAR</label>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setEditForm({...editForm, avatar})}
                    className={`text-3xl h-12 flex items-center justify-center rounded ${
                      editForm.avatar === avatar ? 'bg-[#FF00FF] border-2 border-white' : 'bg-gray-800'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-[#00FF00] text-black font-bold py-2 px-4 rounded"
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-800 text-white font-bold py-2 px-4 rounded"
              >
                CANCEL
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="text-center">
              <div className="h-32 w-32 rounded-full bg-[#FF00FF] flex items-center justify-center mx-auto">
                <span className="text-6xl">{profile.avatar}</span>
              </div>
              
              <div className="mt-3 text-center">
                <div className="text-xl text-white font-bold">{profile.username}</div>
                <div className="text-[#00FFFF]">Level {profile.level}</div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-[#FFFF00] hover:underline text-sm"
                >
                  EDIT PROFILE
                </button>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-gray-700 p-3 rounded bg-black">
                <div className="text-[#FFFF00] text-sm mb-1">POINTS</div>
                <div className="text-white text-xl font-mono">{profile.points.toLocaleString()}</div>
              </div>
              
              <div className="border border-gray-700 p-3 rounded bg-black">
                <div className="text-[#FFFF00] text-sm mb-1">GAMES PLAYED</div>
                <div className="text-white text-xl font-mono">{profile.gamesPlayed}</div>
              </div>
              
              <div className="border border-gray-700 p-3 rounded bg-black">
                <div className="text-[#FFFF00] text-sm mb-1">BADGES</div>
                <div className="text-white text-xl font-mono">{profile.badges.length}</div>
              </div>
              
              <div className="border border-gray-700 p-3 rounded bg-black">
                <div className="text-[#FFFF00] text-sm mb-1">JOINED</div>
                <div className="text-white text-sm font-mono">{formatJoinDate()}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress to next level */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[#00FFFF]">LEVEL {profile.level}</div>
            <div className="text-gray-400 text-sm">
              {profile.points % 1000}/{1000} to level {profile.level + 1}
            </div>
          </div>
          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-[#00FF00] h-full transition-all duration-500"
              style={{ width: `${(profile.points % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
        
        {/* High Scores */}
        <div className="mb-8">
          <h3 className="text-[#00FFFF] text-xl mb-3">HIGH SCORES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-black border border-gray-700 p-3 rounded">
              <div className="text-[#00FF00] mb-1">SNAKE</div>
              <div className="text-white font-mono">{profile.highScores.snake}</div>
            </div>
            <div className="bg-black border border-gray-700 p-3 rounded">
              <div className="text-[#FFFF00] mb-1">PONG</div>
              <div className="text-white font-mono">{profile.highScores.pong}</div>
            </div>
            <div className="bg-black border border-gray-700 p-3 rounded">
              <div className="text-[#FF00FF] mb-1">TETRIS</div>
              <div className="text-white font-mono">{profile.highScores.tetris}</div>
            </div>
            <div className="bg-black border border-gray-700 p-3 rounded">
              <div className="text-[#00FFFF] mb-1">INVADERS</div>
              <div className="text-white font-mono">{profile.highScores["space-invaders"]}</div>
            </div>
          </div>
        </div>
        
        {/* Recent Badges */}
        <div>
          <h3 className="text-[#00FFFF] text-xl mb-3">RECENT BADGES</h3>
          {profile.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profile.badges.slice(0, 4).map(badge => (
                <div key={badge.id} className="bg-black border border-gray-700 p-3 rounded text-center">
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="text-white text-sm">{badge.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4 border border-gray-800 rounded">
              Complete achievements to earn badges!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const useUserProfile = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const ProfileModal = () => (
    <UserProfile 
      isOpen={isProfileOpen} 
      onClose={() => setIsProfileOpen(false)} 
    />
  );
  
  return {
    ProfileModal,
    openProfile: () => setIsProfileOpen(true),
    closeProfile: () => setIsProfileOpen(false),
    toggleProfile: () => setIsProfileOpen(prev => !prev)
  };
};

export default UserProfile;