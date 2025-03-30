import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onProfileClick, onAchievementsClick, NotificationBell }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Close mobile menu on scroll
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      
      // Add background effect when scrolled
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Set active link based on current path
    const path = window.location.pathname;
    setActiveLink(path);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const getLinkClass = (path) => {
    const baseClass = "transition-colors relative overflow-hidden group";
    const isActive = activeLink === path;
    
    return `${baseClass} ${isActive ? 'text-[#00FF00]' : 'text-white hover:text-[#00FFFF]'}`;
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-lg border-b-2 border-[#00FF00]' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-white mr-2 flex items-center">
              <span className="text-[#FF0000]">Retro</span>
              <span className="text-[#00FFFF]">Verse</span>
              <div className="w-4 h-4 ml-2 bg-[#00FF00] animate-pulse hidden sm:block"></div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 text-white font-rubik">
            <li>
              <Link 
                to="/" 
                className={getLinkClass('/')}
                id="home-menu-item"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/games" 
                className={getLinkClass('/games')}
                id="games-menu-item"
              >
                Games
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/collectibles" 
                className={getLinkClass('/collectibles')}
              >
                Collectibles
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/arcade-museum" 
                className={getLinkClass('/arcade-museum')}
              >
                Arcade Museum
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/retro-music" 
                className={getLinkClass('/retro-music')}
              >
                Retro Audio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/retro-timeline" 
                className={getLinkClass('/retro-timeline')}
              >
                Timeline
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/community" 
                className={getLinkClass('/community')}
                id="community-menu-item"
              >
                Community
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/leaderboard" 
                className={getLinkClass('/leaderboard')}
              >
                Leaderboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFFF] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
          
          {/* User and Achievements Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Bell */}
            {NotificationBell && <NotificationBell />}
          
            <button
              onClick={onAchievementsClick}
              className="bg-[#330033] text-white px-3 py-1 rounded border-2 border-[#FF00FF] hover:bg-[#440044] transition-colors"
            >
              <span className="mr-1">🏆</span> Achievements
            </button>
            
            <button
              onClick={onProfileClick}
              id="profile-button"
              className="bg-[#003300] text-white px-3 py-1 rounded border-2 border-[#00FF00] hover:bg-[#004400] transition-colors"
            >
              <span className="mr-1">👤</span> Profile
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notification Bell */}
            {NotificationBell && <NotificationBell />}
            
            <button 
              className="text-[#00FFFF] focus:outline-none border border-[#00FFFF] p-1 rounded" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-95 z-50 transition-all duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
        >
          <div className="h-full flex flex-col items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-[#00FFFF] border border-[#00FFFF] p-1 rounded"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <ul className="flex flex-col space-y-6 text-xl text-white text-center mb-6">
              <li className="relative">
                <Link 
                  to="/" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/games" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  GAMES
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/collectibles" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  COLLECTIBLES
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/arcade-museum" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ARCADE MUSEUM
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/retro-music" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  RETRO AUDIO
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/retro-timeline" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  TIMELINE
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/community" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  COMMUNITY
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/leaderboard" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LEADERBOARD
                </Link>
              </li>
              <li className="relative">
                <Link 
                  to="/gallery" 
                  className="block px-4 py-2 hover:text-[#00FFFF] border-b-2 border-transparent hover:border-[#00FFFF]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  GALLERY
                </Link>
              </li>
            </ul>
              
            {/* Mobile Profile and Achievements Buttons */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onAchievementsClick();
                  setIsMenuOpen(false);
                }}
                className="bg-[#330033] text-white px-6 py-2 rounded border-2 border-[#FF00FF]"
              >
                <span className="mr-2">🏆</span> Achievements
              </button>
              <button
                onClick={() => {
                  onProfileClick();
                  setIsMenuOpen(false);
                }}
                className="bg-[#003300] text-white px-6 py-2 rounded border-2 border-[#00FF00]"
              >
                <span className="mr-2">👤</span> Profile
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;