import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CommunityFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch this data from a backend
    // For this demo, we'll generate fake data
    const generateFeed = () => {
      setIsLoading(true);
      
      // Sample usernames
      const usernames = ['RetroKing', 'PixelQueen', 'ArcadeMaster', '8BitHero', 'GameGuru', 
                         'NeoPro', 'VintagePlayer', 'PixelPuncher', 'JoystickJedi'];
      
      // Sample achievements and events
      const events = [
        { type: 'score', game: 'snake', message: 'just scored %points% in Snake!' },
        { type: 'score', game: 'tetris', message: 'cleared %points% lines in Tetris!' },
        { type: 'score', game: 'space-invaders', message: 'defeated %points% aliens in Space Invaders!' },
        { type: 'score', game: 'pong', message: 'won with %points% points in Pong!' },
        { type: 'achievement', title: 'First Steps', message: 'unlocked the First Steps achievement!' },
        { type: 'achievement', title: 'Snake Charmer', message: 'earned the Snake Charmer badge!' },
        { type: 'achievement', title: 'Space Defender', message: 'became a Space Defender!' },
        { type: 'achievement', title: 'Block Master', message: 'is now a Block Master!' },
        { type: 'challenge', message: 'completed today\'s daily challenge!' },
        { type: 'join', message: 'just joined RetroVerse! Welcome!' }
      ];
      
      // Generate random timestamps within the last 24 hours
      const now = new Date();
      const randomTimeInPast = () => {
        const hoursAgo = Math.random() * 24;
        const pastDate = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
        return pastDate.toISOString();
      };
      
      // Generate 20 random feed items
      const generatedItems = Array.from({ length: 20 }, (_, i) => {
        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const event = events[Math.floor(Math.random() * events.length)];
        const timestamp = randomTimeInPast();
        
        let message = event.message;
        if (event.type === 'score') {
          const points = Math.floor(Math.random() * 900) + 100;
          message = message.replace('%points%', points);
        }
        
        return {
          id: i,
          username,
          message,
          eventType: event.type,
          timestamp,
          avatar: ['👾', '🤖', '👽', '🎮', '🕹️'][Math.floor(Math.random() * 5)]
        };
      });
      
      // Sort by timestamp (newest first)
      generatedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setFeedItems(generatedItems);
      setIsLoading(false);
    };
    
    generateFeed();
    
    // Refresh feed every 2 minutes in a real app
    // For demo, we'll just set it once
  }, []);
  
  // Format timestamps to relative time (e.g., "5m ago")
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const itemDate = new Date(timestamp);
    const diffMinutes = Math.floor((now - itemDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  return (
    <div className="bg-black border-4 border-[#00FFFF] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#00FFFF] text-xl font-bold">LIVE COMMUNITY FEED</h2>
        <button className="bg-gray-900 text-white text-sm py-1 px-3 rounded hover:bg-gray-800">
          REFRESH
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-t-[#FF00FF] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="text-gray-400 mt-2">Loading feed...</div>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-2">
          {feedItems.map(item => (
            <div key={item.id} className="mb-3 border-b border-gray-800 pb-3 last:border-0">
              <div className="flex items-center">
                <div className="mr-3 w-10 h-10 bg-[#FF00FF] rounded-full flex items-center justify-center text-xl">
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[#FFFF00] font-bold">{item.username}</span>
                      <span className="text-gray-400 ml-2 text-sm">{formatRelativeTime(item.timestamp)}</span>
                    </div>
                    
                    {/* Event type badge */}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.eventType === 'score' ? 'bg-[#00FF00] text-black' :
                      item.eventType === 'achievement' ? 'bg-[#FF00FF] text-white' :
                      item.eventType === 'challenge' ? 'bg-[#FFFF00] text-black' :
                      'bg-blue-500 text-white'
                    }`}>
                      {item.eventType === 'score' ? 'SCORE' :
                      item.eventType === 'achievement' ? 'ACHIEVEMENT' :
                      item.eventType === 'challenge' ? 'CHALLENGE' :
                      'NEW USER'}
                    </span>
                  </div>
                  
                  <div className="text-white mt-1">{item.message}</div>
                  
                  {/* Interactive buttons */}
                  <div className="flex mt-2 text-xs">
                    <button className="text-gray-500 hover:text-[#00FFFF] mr-4 flex items-center">
                      <span className="mr-1">👍</span> LIKE
                    </button>
                    <button className="text-gray-500 hover:text-[#00FFFF] flex items-center">
                      <span className="mr-1">💬</span> COMMENT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Link 
          to="/community" 
          className="text-[#00FFFF] hover:underline text-sm"
        >
          VIEW FULL COMMUNITY PAGE →
        </Link>
      </div>
    </div>
  );
};

export default CommunityFeed;