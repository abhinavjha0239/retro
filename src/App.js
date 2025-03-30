import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RetroLoader from './components/RetroLoader';
import RetroTutorial from './components/RetroTutorial';
import DailyChallenges from './components/DailyChallenges';
import AchievementsManager from './components/AchievementsManager';
import { useUserProfile } from './components/UserProfile';
import CommunityFeed from './components/CommunityFeed';
import NotificationsProvider, { useNotifications } from './components/NotificationsProvider';
import useKonamiCode from './hooks/useKonamiCode';

// Pages
import Home from './pages/Home';
import Games from './pages/Games';
import NotFound from './pages/NotFound';
import CollectiblesPage from './pages/CollectiblesPage';
import CommunityPage from './pages/CommunityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GalleryPage from './pages/GalleryPage';
import ArcadeMuseumPage from './pages/ArcadeMuseumPage';
import RetroMusicPage from './pages/RetroMusicPage';
import RetroTimelinePage from './pages/RetroTimelinePage';

// Games
import SnakeGame from './games/SnakeGame';
import SpaceInvaders from './games/SpaceInvaders';

import './App.css';

// Wrap app content with notification context
const AppContent = () => {
  const konamiCodeSuccess = useKonamiCode();
  const [showLoader, setShowLoader] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const { ProfileModal, openProfile, toggleProfile } = useUserProfile();
  const achievementsManager = AchievementsManager();
  const { AchievementPopup, unlockAchievement, AchievementsGrid } = achievementsManager;
  const [showAchievements, setShowAchievements] = useState(false);
  const { addNotification, NotificationBell } = useNotifications();
  
  // Check if it's the user's first visit
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('retroverse_visited');
    if (isFirstVisit) {
      localStorage.setItem('retroverse_visited', 'true');
      setShowTutorial(true);
      
      // Unlock the first achievement for new users
      setTimeout(() => {
        const achievementUnlocked = unlockAchievement('first_game');
        if (achievementUnlocked) {
          addNotification({
            type: 'achievement',
            title: 'Achievement Unlocked',
            message: 'Welcome to RetroVerse! You earned your first achievement.',
            action: {
              label: 'VIEW ACHIEVEMENTS',
              onClick: () => setShowAchievements(true)
            }
          });
        }
      }, 5000);
    }
  }, []);
  
  useEffect(() => {
    if (konamiCodeSuccess) {
      setShowLoader(true);
      // Simulate loading time for the easter egg
      setTimeout(() => {
        setShowLoader(false);
        const achievementUnlocked = unlockAchievement('konami_master');
        if (achievementUnlocked) {
          addNotification({
            type: 'achievement',
            title: 'Secret Code Discovered',
            message: 'You found the Konami Code! Special achievement unlocked.',
            action: {
              label: 'VIEW ACHIEVEMENT',
              onClick: () => setShowAchievements(true)
            }
          });
        }
      }, 2000);
    }
  }, [konamiCodeSuccess]);
  
  // Layout wrapper for pages that need header and footer
  const PageLayout = ({ children }) => (
    <div className="antialiased text-gray-800 min-h-screen flex flex-col">
      <RetroLoader show={showLoader} />
      
      {/* Show tutorial for first-time visitors */}
      {showTutorial && (
        <RetroTutorial onComplete={() => setShowTutorial(false)} />
      )}
      
      {/* Achievement popup component */}
      <AchievementPopup />
      
      {/* Achievements modal */}
      {showAchievements && (
        <AchievementsGrid onClose={() => setShowAchievements(false)} />
      )}
      
      {/* Profile modal */}
      <ProfileModal />
      
      <a href="#main-content" 
         className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black">
        Skip to main content
      </a>
      <Header 
        onProfileClick={toggleProfile}
        onAchievementsClick={() => setShowAchievements(true)}
        NotificationBell={NotificationBell}
      />
      <main id="main-content" className="flex-1 relative h-full">
        {children}
      </main>
      <Footer />
      
      {/* Points Counter Widget */}
      <div 
        className="fixed bottom-6 right-6 bg-black border-2 border-[#00FF00] p-3 z-40 hidden md:block cursor-pointer hover:bg-gray-900 transition-colors"
        onClick={toggleProfile}
        id="profile-button"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#FFFF00] mr-3 flex items-center justify-center">
            <div className="w-6 h-6 bg-black"></div>
          </div>
          <div>
            <div className="text-[#00FF00] font-mono font-bold">1,250 PTS</div>
            <div className="text-xs text-white">LEVEL 8</div>
          </div>
        </div>
      </div>
      
      {/* Achievements Button */}
      <div 
        className="fixed bottom-6 left-20 bg-black border-2 border-[#FF00FF] p-2 z-40 hidden md:flex items-center cursor-pointer hover:bg-gray-900 transition-colors"
        onClick={() => setShowAchievements(true)}
      >
        <div className="text-[#FF00FF] font-mono text-sm">ACHIEVEMENTS</div>
      </div>
      
      {/* Back to Top Button */}
      <a href="#hero" 
         className="fixed bottom-6 left-6 w-12 h-12 bg-black border-2 border-[#00FFFF] flex items-center justify-center z-40 hover:bg-neutral-900 hidden md:flex">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>
    </div>
  );
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PageLayout>
            <Home 
              DailyChallengesComponent={<DailyChallenges />}
              CommunityFeedComponent={<CommunityFeed />}
            />
          </PageLayout>
        } />
        <Route path="/collectibles" element={<PageLayout><CollectiblesPage /></PageLayout>} />
        <Route path="/community" element={<PageLayout><CommunityPage /></PageLayout>} />
        <Route path="/leaderboard" element={<PageLayout><LeaderboardPage /></PageLayout>} />
        <Route path="/gallery" element={<PageLayout><GalleryPage /></PageLayout>} />
        <Route path="/games" element={<PageLayout><Games /></PageLayout>} />
        <Route path="/arcade-museum" element={<PageLayout><ArcadeMuseumPage /></PageLayout>} />
        <Route path="/retro-music" element={<PageLayout><RetroMusicPage /></PageLayout>} />
        <Route path="/retro-timeline" element={<PageLayout><RetroTimelinePage /></PageLayout>} />
        <Route path="/games/snake" element={<SnakeGame />} />
        <Route path="/games/space-invaders" element={<SpaceInvaders />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <NotificationsProvider>
      <AppContent />
    </NotificationsProvider>
  );
}

export default App;
