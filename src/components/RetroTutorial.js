import React, { useState, useEffect } from 'react';

const RetroTutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('retroverse_tutorial_completed') === 'true';
  });

  useEffect(() => {
    // Check if user has already seen the tutorial
    if (hasSeenTutorial) {
      setIsVisible(false);
      return;
    }
  }, [hasSeenTutorial]);

  const tutorialSteps = [
    {
      title: "WELCOME TO RETROVERSE",
      content: "Step into our retro gaming universe! This quick tour will help you discover all the awesome features.",
      position: "center",
      highlight: null
    },
    {
      title: "PLAY CLASSIC GAMES",
      content: "Check out our collection of retro games like Snake, Tetris, Pong, and Space Invaders. Each game has unique challenges and achievements!",
      position: "right",
      highlight: "games-menu-item"
    },
    {
      title: "DAILY CHALLENGES",
      content: "Complete daily challenges to earn points and badges. They refresh every 24 hours, so check back daily!",
      position: "bottom",
      highlight: "daily-challenges"
    },
    {
      title: "TRACK YOUR PROGRESS",
      content: "Your profile shows your level, points, high scores, and badges. Try to unlock all achievements!",
      position: "left",
      highlight: "profile-button"
    },
    {
      title: "JOIN THE COMMUNITY",
      content: "Connect with other retro gamers, share your high scores, and see what others are achieving in the community feed.",
      position: "right",
      highlight: "community-menu-item"
    },
    {
      title: "READY TO PLAY?",
      content: "You're all set! Dive in and enjoy the nostalgic gaming experience of RetroVerse!",
      position: "center",
      highlight: null
    }
  ];

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    localStorage.setItem('retroverse_tutorial_completed', 'true');
    setHasSeenTutorial(true);
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const skipTutorial = () => {
    localStorage.setItem('retroverse_tutorial_completed', 'true');
    setHasSeenTutorial(true);
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const resetTutorial = () => {
    localStorage.removeItem('retroverse_tutorial_completed');
    setHasSeenTutorial(false);
    setCurrentStep(0);
    setIsVisible(true);
  };

  // Handle highlighting elements
  useEffect(() => {
    const currentHighlight = tutorialSteps[currentStep]?.highlight;
    
    // Remove any existing highlight classes
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    
    // Add highlight to the current element
    if (currentHighlight) {
      const elementToHighlight = document.getElementById(currentHighlight);
      if (elementToHighlight) {
        elementToHighlight.classList.add('tutorial-highlight');
      }
    }
  }, [currentStep]);

  if (!isVisible) return null;

  const currentTutorialStep = tutorialSteps[currentStep];
  
  // Determine the position class for the tooltip
  const getPositionClass = () => {
    switch (currentTutorialStep.position) {
      case 'left': return 'right-full mr-4';
      case 'right': return 'left-full ml-4';
      case 'bottom': return 'top-full mt-4';
      case 'top': return 'bottom-full mb-4';
      default: return ''; // center
    }
  };

  // For center position, show a modal
  if (currentTutorialStep.position === 'center') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        <div className="bg-gray-900 border-4 border-[#FF00FF] p-6 rounded-lg max-w-md text-center">
          <div className="text-[#FFFF00] text-2xl font-bold mb-4">{currentTutorialStep.title}</div>
          <div className="text-white mb-6">{currentTutorialStep.content}</div>
          
          <div className="flex justify-between items-center">
            {currentStep > 0 ? (
              <button 
                onClick={handlePrevStep}
                className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                BACK
              </button>
            ) : (
              <button 
                onClick={skipTutorial}
                className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                SKIP
              </button>
            )}
            
            <button 
              onClick={handleNextStep}
              className="bg-[#00FF00] text-black py-2 px-4 rounded font-bold hover:bg-opacity-90"
            >
              {currentStep === tutorialSteps.length - 1 ? 'FINISH' : 'NEXT'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For positioned tooltips
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="relative w-full h-full">
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Tooltip positioned near the highlighted element */}
        <div className={`absolute ${getPositionClass()} bg-gray-900 border-4 border-[#00FFFF] p-4 rounded-lg pointer-events-auto max-w-xs`}>
          <div className="text-[#00FFFF] text-xl font-bold mb-2">{currentTutorialStep.title}</div>
          <div className="text-white mb-4">{currentTutorialStep.content}</div>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={currentStep > 0 ? handlePrevStep : skipTutorial}
              className="bg-gray-800 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
            >
              {currentStep > 0 ? 'BACK' : 'SKIP'}
            </button>
            
            <button 
              onClick={handleNextStep}
              className="bg-[#00FF00] text-black py-1 px-3 rounded text-sm font-bold hover:bg-opacity-90"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
      
      {/* Add a small utility class for styling the highlighted elements */}
      <style jsx>{`
        .tutorial-highlight {
          position: relative;
          z-index: 51;
          animation: pulse 2s infinite;
          box-shadow: 0 0 0 4px rgba(255, 0, 255, 0.6);
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 0, 255, 0.6); }
          70% { box-shadow: 0 0 0 10px rgba(255, 0, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 0, 255, 0); }
        }
      `}</style>
    </div>
  );
};

export default RetroTutorial;