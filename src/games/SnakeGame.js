import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SnakeGame = () => {
  // Canvas settings
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [paused, setPaused] = useState(false);
  
  // Game settings
  const gridSize = 20;
  const initialSnake = [{ x: 10, y: 10 }];
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 0, y: 0 });
  
  // Retro colors
  const colors = {
    background: '#000000',
    snake: '#00FF00',
    food: '#FF0000',
    border: '#FFFFFF',
    text: '#00FFFF',
    gameOver: '#FF00FF'
  };
  
  // Initialize canvas and game
  useEffect(() => {
    if (canvasRef.current) {
      // Check if there's a stored high score
      const storedHighScore = localStorage.getItem('snakeHighScore');
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    }
  }, []);
  
  // Generate food in random position
  const generateFood = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const maxX = Math.floor(canvas.width / gridSize) - 1;
    const maxY = Math.floor(canvas.height / gridSize) - 1;
    
    let newFood = {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    };
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      // Try again if food is on snake
      return generateFood();
    } else {
      setFood(newFood);
    }
  }, [snake]);
  
  // Reset game
  const resetGame = useCallback(() => {
    setSnake(initialSnake);
    setDirection({ x: 0, y: 0 });
    setNextDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    
    if (canvasRef.current) {
      generateFood();
    }
    
    setGameStarted(false);
  }, [generateFood]);
  
  // Generate food on game start
  useEffect(() => {
    if (canvasRef.current && !gameStarted) {
      generateFood();
    }
  }, [generateFood, gameStarted, canvasRef]);
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || paused || !canvasRef.current) return;
    
    const gameLoop = setInterval(() => {
      moveSnake();
    }, 1000 / speed);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, snake, direction, food, speed, paused]);
  
  // Check for game over conditions
  const checkCollision = useCallback(() => {
    if (!canvasRef.current || snake.length === 0) return false;
    
    const head = snake[0];
    const canvas = canvasRef.current;
    
    // Check if snake hit the wall
    if (
      head.x < 0 ||
      head.x >= Math.floor(canvas.width / gridSize) ||
      head.y < 0 ||
      head.y >= Math.floor(canvas.height / gridSize)
    ) {
      return true;
    }
    
    // Check if snake hit itself
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    
    return false;
  }, [snake]);
  
  // Move snake
  const moveSnake = useCallback(() => {
    if (!canvasRef.current) return;
    
    // Apply the queued direction change
    setDirection(nextDirection);
    
    const newSnake = [...snake];
    const head = { 
      x: newSnake[0].x + nextDirection.x,
      y: newSnake[0].y + nextDirection.y
    };
    
    newSnake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => {
        const newScore = prevScore + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        
        // Increase speed every 5 points
        if (newScore % 5 === 0) {
          setSpeed(prevSpeed => Math.min(prevSpeed + 1, 20));
        }
        
        return newScore;
      });
      
      generateFood();
    } else {
      newSnake.pop();
    }
    
    setSnake(newSnake);
    
    // Check for collisions
    if (checkCollision()) {
      setGameOver(true);
      
      // Play retro game over sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const playGameOverSound = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 1);
        };
        
        playGameOverSound();
      } catch (error) {
        console.error("Audio error:", error);
      }
    }
  }, [snake, food, nextDirection, generateFood, checkCollision, highScore]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted && !gameOver && (e.key === ' ' || e.key === 'Enter')) {
        setGameStarted(true);
        setNextDirection({ x: 1, y: 0 }); // Start moving right
        return;
      }
      
      if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev);
        return;
      }
      
      if (gameOver && (e.key === 'r' || e.key === 'R')) {
        resetGame();
        return;
      }
      
      if (paused) return;
      
      // Don't allow 180-degree turns
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, direction, resetGame, paused]);
  
  // Draw game
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFF00' : colors.snake; // Yellow head
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
      
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000000';
        
        // Adjust eye position based on direction
        if (direction.x === 1) { // Right
          ctx.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.3, gridSize * 0.2, gridSize * 0.2);
          ctx.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.7, gridSize * 0.2, gridSize * 0.2);
        } else if (direction.x === -1) { // Left
          ctx.fillRect(segment.x * gridSize + gridSize * 0.1, segment.y * gridSize + gridSize * 0.3, gridSize * 0.2, gridSize * 0.2);
          ctx.fillRect(segment.x * gridSize + gridSize * 0.1, segment.y * gridSize + gridSize * 0.7, gridSize * 0.2, gridSize * 0.2);
        } else if (direction.y === -1) { // Up
          ctx.fillRect(segment.x * gridSize + gridSize * 0.3, segment.y * gridSize + gridSize * 0.1, gridSize * 0.2, gridSize * 0.2);
          ctx.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.1, gridSize * 0.2, gridSize * 0.2);
        } else if (direction.y === 1) { // Down
          ctx.fillRect(segment.x * gridSize + gridSize * 0.3, segment.y * gridSize + gridSize * 0.7, gridSize * 0.2, gridSize * 0.2);
          ctx.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.7, gridSize * 0.2, gridSize * 0.2);
        } else { // Default eyes if not moving
          ctx.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.3, gridSize * 0.2, gridSize * 0.2);
          ctx.fillRect(segment.x * gridSize + gridSize * 0.7, segment.y * gridSize + gridSize * 0.7, gridSize * 0.2, gridSize * 0.2);
        }
      }
      
      // Add grid-like pattern to snake body
      if (index > 0) {
        ctx.strokeStyle = '#008800';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          segment.x * gridSize + 2,
          segment.y * gridSize + 2,
          gridSize - 4,
          gridSize - 4
        );
      }
    });
    
    // Draw food (apple)
    ctx.fillStyle = colors.food;
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
    
    // Add stem to apple
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(
      food.x * gridSize + gridSize * 0.4,
      food.y * gridSize - gridSize * 0.2,
      gridSize * 0.2,
      gridSize * 0.3
    );
    
    // Draw leaf
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(
      food.x * gridSize + gridSize * 0.7, 
      food.y * gridSize - gridSize * 0.1,
      gridSize * 0.3,
      gridSize * 0.15,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw game start screen
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '30px VT323, monospace';
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE', canvas.width / 2, canvas.height / 3);
      
      ctx.font = '20px VT323, monospace';
      ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Use arrow keys or WASD to move', canvas.width / 2, canvas.height * 2/3);
      ctx.fillText('P to pause', canvas.width / 2, canvas.height * 2/3 + 25);
    }
    
    // Draw pause screen
    if (paused && gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '30px VT323, monospace';
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 40);
    }
    
    // Draw game over screen
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '30px VT323, monospace';
      ctx.fillStyle = colors.gameOver;
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);
      
      ctx.font = '20px VT323, monospace';
      ctx.fillStyle = colors.text;
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 10);
      
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height * 2/3);
    }
    
    // Draw score
    ctx.font = '16px VT323, monospace';
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 150, 20);
    
  }, [snake, food, gameStarted, gameOver, score, highScore, colors, direction, paused]);
  
  // Play a sound when food is eaten
  useEffect(() => {
    if (score > 0) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const playEatSound = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
        };
        
        playEatSound();
      } catch (error) {
        console.error("Audio error:", error);
      }
    }
  }, [score]);
  
  // Handle touch controls for mobile
  const handleTouchStart = useRef({ x: 0, y: 0 });
  const handleTouchEnd = useRef({ x: 0, y: 0 });
  
  const onTouchStart = (e) => {
    handleTouchStart.current.x = e.touches[0].clientX;
    handleTouchStart.current.y = e.touches[0].clientY;
  };
  
  const onTouchEnd = (e) => {
    handleTouchEnd.current.x = e.changedTouches[0].clientX;
    handleTouchEnd.current.y = e.changedTouches[0].clientY;
    
    const deltaX = handleTouchEnd.current.x - handleTouchStart.current.x;
    const deltaY = handleTouchEnd.current.y - handleTouchStart.current.y;
    
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
      setNextDirection({ x: 1, y: 0 }); // Start moving right
      return;
    }
    
    if (gameOver) {
      resetGame();
      return;
    }
    
    if (paused) {
      setPaused(false);
      return;
    }
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && direction.x !== -1) {
        setNextDirection({ x: 1, y: 0 }); // Right
      } else if (deltaX < 0 && direction.x !== 1) {
        setNextDirection({ x: -1, y: 0 }); // Left
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && direction.y !== -1) {
        setNextDirection({ x: 0, y: 1 }); // Down
      } else if (deltaY < 0 && direction.y !== 1) {
        setNextDirection({ x: 0, y: -1 }); // Up
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      {/* Retro Header */}
      <header className="bg-[#000066] p-4 border-b-4 border-[#00FF00]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#00FF00]">SNAKE</h1>
          <Link to="/games" className="text-[#FFFF00] hover:underline">
            &lt; Back to Games
          </Link>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Game Canvas */}
        <div className="relative border-4 border-[#00FFFF] bg-black p-2 m-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="bg-black"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
          
          {/* CRT scan line effect */}
          <div className="absolute inset-0 pointer-events-none crt-overlay"></div>
        </div>
        
        {/* Controls */}
        <div className="max-w-md w-full bg-gray-900 border-2 border-[#FFFF00] p-4 mb-6 rounded">
          <h2 className="text-xl text-center text-[#FFFF00] mb-3">CONTROLS</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#00FFFF] mb-1">Keyboard:</p>
              <ul className="text-white text-sm">
                <li>Arrow Keys / WASD: Move</li>
                <li>P: Pause</li>
                <li>R: Restart (after game over)</li>
                <li>Space/Enter: Start</li>
              </ul>
            </div>
            <div>
              <p className="text-[#00FFFF] mb-1">Mobile:</p>
              <ul className="text-white text-sm">
                <li>Swipe: Change Direction</li>
                <li>Tap: Start / Restart</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Mobile controls */}
        <div className="md:hidden w-full max-w-md mb-6">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div></div>
            <button 
              onClick={() => {
                if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
              }}
              className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center"
            >
              ▲
            </button>
            <div></div>
            
            <button 
              onClick={() => {
                if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
              }}
              className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center"
            >
              ◀
            </button>
            <button 
              onClick={() => {
                if (paused) setPaused(false);
                else if (gameOver) resetGame();
                else if (!gameStarted) {
                  setGameStarted(true);
                  setNextDirection({ x: 1, y: 0 });
                } else setPaused(true);
              }}
              className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center"
            >
              {paused ? '▶' : gameOver ? 'R' : !gameStarted ? 'Start' : '❚❚'}
            </button>
            <button 
              onClick={() => {
                if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
              }}
              className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center"
            >
              ▶
            </button>
            
            <div></div>
            <button 
              onClick={() => {
                if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
              }}
              className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center"
            >
              ▼
            </button>
            <div></div>
          </div>
        </div>
      </div>
      
      {/* Retro Footer */}
      <footer className="bg-gray-900 text-white p-4 text-center text-sm border-t-2 border-[#FFFF00]">
        <p>© 2023 RetroVerse - Snake v1.0</p>
        <p className="text-gray-500 text-xs">Insert Coin To Continue...</p>
      </footer>
      
      {/* CSS for CRT effect */}
      <style jsx>{`
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        
        @font-face {
          font-family: 'VT323';
          src: url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        }
      `}</style>
    </div>
  );
};

export default SnakeGame;