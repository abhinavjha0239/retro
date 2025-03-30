import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, paused, gameOver
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [direction, setDirection] = useState('right');
  const [nextDirection, setNextDirection] = useState('right');
  const [gameSpeed, setGameSpeed] = useState(100);
  const [difficulty, setDifficulty] = useState('normal');
  const [gridSize] = useState({ width: 20, height: 20 });
  const [cellSize] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlMode, setControlMode] = useState('arrows'); // arrows or swipe
  const [showControls, setShowControls] = useState(true);

  const colors = useMemo(() => ({
    snake: '#00FF00',
    food: '#FF0000',
    wall: '#333333',
    background: '#000000',
    text: '#FFFFFF',
    grid: '#111111'
  }), []);

  const initialSnake = useMemo(() => [
    { x: Math.floor(gridSize.width / 2), y: Math.floor(gridSize.height / 2) },
    { x: Math.floor(gridSize.width / 2) - 1, y: Math.floor(gridSize.height / 2) }
  ], [gridSize]);

  const getDifficultySpeed = useCallback((diff) => {
    switch (diff) {
      case 'easy': return 120;
      case 'hard': return 80;
      default: return 100;
    }
  }, []);

  const spawnFood = useCallback(() => {
    const generateFood = () => ({
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height)
    });

    const isOverlappingSnake = (food) => 
      snake.some(segment => segment.x === food.x && segment.y === food.y);

    let newFood = generateFood();
    while (isOverlappingSnake(newFood)) {
      newFood = generateFood();
    }
    setFood(newFood);
  }, [gridSize, snake]);

  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    setSnake(currentSnake => {
      const head = { ...currentSnake[0] };
      
      switch (direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
        default: break;
      }

      if (head.x < 0 || head.x >= gridSize.width ||
          head.y < 0 || head.y >= gridSize.height ||
          currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameOver');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return currentSnake;
      }

      const newSnake = [head, ...currentSnake];
      
      if (food && head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        spawnFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, direction, gridSize, food, score, highScore, spawnFood]);

  const resetGame = useCallback(() => {
    setSnake(initialSnake);
    setDirection('right');
    setNextDirection('right');
    setScore(0);
    setGameState('waiting');
    spawnFood();
    setGameSpeed(getDifficultySpeed(difficulty));
  }, [initialSnake, difficulty, getDifficultySpeed, spawnFood]);

  const drawGame = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, gridSize.width * cellSize, gridSize.height * cellSize);

    ctx.strokeStyle = colors.grid;
    for (let i = 0; i <= gridSize.width; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, gridSize.height * cellSize);
      ctx.stroke();
    }
    for (let i = 0; i <= gridSize.height; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(gridSize.width * cellSize, i * cellSize);
      ctx.stroke();
    }

    ctx.fillStyle = colors.snake;
    snake.forEach(({ x, y }) => {
      ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
    });

    if (food) {
      ctx.fillStyle = colors.food;
      ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);
    }

    ctx.fillStyle = colors.text;
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${score}`, 10, gridSize.height * cellSize + 30);
    ctx.fillText(`High Score: ${highScore}`, gridSize.width * cellSize - 150, gridSize.height * cellSize + 30);
  }, [colors, gridSize, cellSize, snake, food, score, highScore]);

  useEffect(() => {
    let gameLoop;
    
    if (gameState === 'playing') {
      gameLoop = setInterval(() => {
        moveSnake();
      }, gameSpeed);
    }

    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, [gameState, gameSpeed, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'gameOver') {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      if (gameState === 'waiting' && (e.key === ' ' || e.key === 'Enter')) {
        setGameState('playing');
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        setGameState(prev => prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev);
        return;
      }

      if (gameState !== 'playing') return;

      let newDirection = nextDirection;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'down') newDirection = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'up') newDirection = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'right') newDirection = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'left') newDirection = 'right';
          break;
        default:
          break;
      }
      setNextDirection(newDirection);
      setDirection(newDirection);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, direction, nextDirection, resetGame]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const render = () => {
      drawGame();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }, [drawGame]);

  const handleTouchStart = useCallback((e) => {
    if (controlMode !== 'swipe') return;
    const touch = e.touches[0];
    const touchStartX = touch.clientX;
    const touchStartY = touch.clientY;

    const handleTouchMove = (e) => {
      if (gameState !== 'playing') return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== 'left') setDirection('right');
        else if (deltaX < 0 && direction !== 'right') setDirection('left');
      } else {
        if (deltaY > 0 && direction !== 'up') setDirection('down');
        else if (deltaY < 0 && direction !== 'down') setDirection('up');
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, { once: true });
  }, [controlMode, gameState, direction]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await canvasRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      <header className="bg-[#000066] p-4 border-b-4 border-[#00FF00]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#00FF00]">SNAKE</h1>
          <div className="flex gap-4">
            <button
              onClick={toggleFullscreen}
              className="bg-[#00FF00] text-black px-4 py-2 rounded hover:bg-[#00CC00]"
            >
              {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
            </button>
            <Link to="/games" className="text-[#FFFF00] hover:underline">
              &lt; Back to Games
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative border-4 border-[#00FF00] bg-black p-2 m-4">
          <canvas
            ref={canvasRef}
            width={gridSize.width * cellSize}
            height={gridSize.height * cellSize + 40}
            className="bg-black"
            onTouchStart={handleTouchStart}
          />
        </div>

        {showSettings && (
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <h2 className="text-[#00FF00] text-xl mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setGameSpeed(getDifficultySpeed(e.target.value));
                  }}
                  className="bg-black border border-[#00FF00] p-2 rounded w-full"
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Control Mode:</label>
                <select
                  value={controlMode}
                  onChange={(e) => setControlMode(e.target.value)}
                  className="bg-black border border-[#00FF00] p-2 rounded w-full"
                >
                  <option value="arrows">Arrows</option>
                  <option value="swipe">Swipe (Mobile)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {showControls && !isFullscreen && (
          <div className="max-w-md w-full bg-gray-900 border-2 border-[#00FF00] p-4 rounded">
            <h2 className="text-xl text-center text-[#00FF00] mb-3">CONTROLS</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#00FFFF] mb-1">Keyboard:</p>
                <ul className="text-sm">
                  <li>Arrow Keys / WASD: Move</li>
                  <li>P: Pause</li>
                  <li>Space/Enter: Start/Restart</li>
                </ul>
              </div>
              <div>
                <p className="text-[#00FFFF] mb-1">Mobile:</p>
                <ul className="text-sm">
                  <li>Swipe: Change Direction</li>
                  <li>Tap: Start/Restart</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => setShowSettings(prev => !prev)}
            className="bg-[#00FF00] text-black px-4 py-2 rounded hover:bg-[#00CC00] mr-4"
          >
            {showSettings ? 'HIDE SETTINGS' : 'SHOW SETTINGS'}
          </button>
          <button
            onClick={() => setShowControls(prev => !prev)}
            className="bg-[#00FF00] text-black px-4 py-2 rounded hover:bg-[#00CC00]"
          >
            {showControls ? 'HIDE CONTROLS' : 'SHOW CONTROLS'}
          </button>
        </div>

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-gray-900 border-4 border-[#FF0000] p-6 rounded-lg text-center">
              <h2 className="text-[#FF0000] text-3xl mb-4">GAME OVER</h2>
              <p className="text-xl mb-2">Score: {score}</p>
              <p className="text-xl mb-4">High Score: {highScore}</p>
              <button
                onClick={resetGame}
                className="bg-[#00FF00] text-black px-6 py-2 rounded text-xl hover:bg-[#00CC00]"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-gray-900 border-4 border-[#00FF00] p-6 rounded-lg text-center">
              <h2 className="text-[#00FF00] text-3xl mb-4">SNAKE</h2>
              <p className="text-xl mb-4">Press Space or Enter to Start</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-gray-900 border-4 border-[#FFFF00] p-6 rounded-lg text-center">
              <h2 className="text-[#FFFF00] text-3xl mb-4">PAUSED</h2>
              <p className="text-xl mb-4">Press P to Continue</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;