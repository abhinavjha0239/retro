import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const resizeObserver = useRef(null);
  const [keysPressed, setKeysPressed] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [shields, setShields] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [powerUpActive, setPowerUpActive] = useState(null);
  const [player, setPlayer] = useState({
    x: 0,
    y: 0,
    width: 40,
    height: 20,
    speed: 5
  });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [level, setLevel] = useState(1);
  const [viewDimensions, setViewDimensions] = useState({ width: 500, height: 500 });

  const BULLET_SPEED = 15;
  const MAX_BULLETS = 4;
  const BULLET_COOLDOWN = 80;
  const GAME_SPEED = useMemo(() => 1000 / 75, []);
  const ENEMY_BULLET_SPEED = 3;
  const ENEMY_SPEED = 1;
  const ENEMY_DROP_DISTANCE = 20;
  const ENEMY_FIRE_RATE = 0.01;
  const SHIELD_WIDTH = 60;
  const SHIELD_HEIGHT = 20;
  const POWER_UP_TYPES = useMemo(() => ['rapidFire', 'shield', 'multiShot'], []);
  const POWER_UP_DURATION = 10000;

  const lastBulletFiredRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const checkCollision = useCallback((rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const createShields = useCallback(() => {
    const shieldPositions = [
      { x: viewDimensions.width * 0.2, y: viewDimensions.height - 100 },
      { x: viewDimensions.width * 0.4, y: viewDimensions.height - 100 },
      { x: viewDimensions.width * 0.6, y: viewDimensions.height - 100 },
      { x: viewDimensions.width * 0.8, y: viewDimensions.height - 100 }
    ];

    setShields(shieldPositions.map(pos => ({
      ...pos,
      width: SHIELD_WIDTH,
      height: SHIELD_HEIGHT,
      health: 100
    })));
  }, [viewDimensions.width, viewDimensions.height, SHIELD_WIDTH, SHIELD_HEIGHT]);

  const createEnemies = useCallback(() => {
    const rows = 5;
    const cols = 11;
    const enemyWidth = 30;
    const enemyHeight = 20;
    const padding = 15;
    const offsetTop = 50;

    const newEnemies = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newEnemies.push({
          x: col * (enemyWidth + padding) + padding,
          y: row * (enemyHeight + padding) + offsetTop,
          width: enemyWidth,
          height: enemyHeight,
          type: row,
          health: 1
        });
      }
    }
    setEnemies(newEnemies);
  }, []);

  const resetGame = useCallback(() => {
    setBullets([]);
    setEnemyBullets([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setPowerUps([]);
    setPowerUpActive(null);
    createEnemies();
    createShields();
  }, [createEnemies, createShields]);

  const playSound = useCallback((type, volume = 1) => {
    console.log('Playing sound:', type, 'at volume:', volume);
  }, []);

  const handleShoot = useCallback(() => {
    if (gameStarted && !paused && !gameOver) {
      const now = Date.now();
      const cooldown = powerUpActive === 'rapidFire' ? BULLET_COOLDOWN / 2 : BULLET_COOLDOWN;
      const maxBullets = powerUpActive === 'rapidFire' ? MAX_BULLETS * 2 : MAX_BULLETS;

      if (now - lastBulletFiredRef.current > cooldown && bullets.length < maxBullets) {
        lastBulletFiredRef.current = now;

        if (powerUpActive === 'multiShot') {
          setBullets(prev => [
            ...prev,
            {
              x: player.x + player.width / 2 - 2,
              y: player.y - 10,
              width: 4,
              height: 10,
              angle: -0.2
            },
            {
              x: player.x + player.width / 2 - 2,
              y: player.y - 10,
              width: 4,
              height: 10,
              angle: 0
            },
            {
              x: player.x + player.width / 2 - 2,
              y: player.y - 10,
              width: 4,
              height: 10,
              angle: 0.2
            }
          ].slice(0, maxBullets));
        } else {
          setBullets(prev => [
            ...prev,
            {
              x: player.x + player.width / 2 - 2,
              y: player.y - 10,
              width: 4,
              height: 10,
              angle: 0
            }
          ].slice(0, maxBullets));
        }

        playSound('shoot', 0.3);
      }
    }
  }, [gameStarted, paused, gameOver, powerUpActive, bullets.length, player, BULLET_COOLDOWN, MAX_BULLETS, playSound]);

  const drawGame = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, viewDimensions.width, viewDimensions.height);

    ctx.fillStyle = '#00FF00';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#FFFF00';
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    ctx.fillStyle = '#FF0000';
    enemyBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.forEach(enemy => {
      ctx.fillStyle = enemy.type === 0 ? '#FF00FF' : 
                     enemy.type === 1 ? '#00FFFF' : '#FFFF00';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    shields.forEach(shield => {
      const opacity = shield.health / 100;
      ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
      ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
    });

    powerUps.forEach(powerUp => {
      ctx.fillStyle = '#FF00FF';
      ctx.beginPath();
      ctx.arc(powerUp.x, powerUp.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px monospace';
    ctx.fillText(`SCORE: ${score}`, 10, 30);
    ctx.fillText(`HIGH SCORE: ${highScore}`, viewDimensions.width - 200, 30);
    ctx.fillText(`LIVES: ${lives}`, 10, viewDimensions.height - 10);
    if (powerUpActive) {
      ctx.fillStyle = '#00FFFF';
      ctx.fillText(`POWER UP: ${powerUpActive}`, viewDimensions.width / 2 - 70, 30);
    }
  }, [viewDimensions, player, bullets, enemyBullets, enemies, shields, powerUps, powerUpActive, score, highScore, lives]);

  const updateGame = useCallback(() => {
    setBullets(prev => prev.map(bullet => ({
      ...bullet,
      y: bullet.y - BULLET_SPEED,
      x: bullet.x + Math.sin(bullet.angle || 0) * 2
    })).filter(bullet => bullet.y > 0));

    setEnemyBullets(prev => prev.map(bullet => ({
      ...bullet,
      y: bullet.y + ENEMY_BULLET_SPEED
    })).filter(bullet => bullet.y < viewDimensions.height));

    const direction = enemies.length > 0 && 
      enemies.some(enemy => enemy.x > viewDimensions.width - 40) ? -1 :
      enemies.some(enemy => enemy.x < 10) ? 1 : null;

    if (direction !== null) {
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + ENEMY_DROP_DISTANCE
      })));
    } else {
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        x: enemy.x + ENEMY_SPEED
      })));
    }

    enemies.forEach(enemy => {
      if (Math.random() < ENEMY_FIRE_RATE) {
        setEnemyBullets(prev => [...prev, {
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height,
          width: 4,
          height: 10
        }]);
      }
    });
  }, [BULLET_SPEED, ENEMY_BULLET_SPEED, ENEMY_SPEED, ENEMY_DROP_DISTANCE, ENEMY_FIRE_RATE, enemies, viewDimensions.width, viewDimensions.height]);

  const spawnPowerUp = useCallback(() => {
    if (Math.random() < 0.001) {
      setPowerUps(prev => [...prev, {
        x: Math.random() * (viewDimensions.width - 20) + 10,
        y: 0,
        type: POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)]
      }]);
    }
  }, [viewDimensions.width, POWER_UP_TYPES]);

  const updatePowerUps = useCallback(() => {
    setPowerUps(prev => prev.map(powerUp => ({
      ...powerUp,
      y: powerUp.y + 2
    })).filter(powerUp => powerUp.y < viewDimensions.height));
  }, [viewDimensions.height]);

  const checkPowerUpCollisions = useCallback(() => {
    powerUps.forEach(powerUp => {
      const playerHit = checkCollision(powerUp, player);
      if (playerHit) {
        setPowerUpActive(powerUp.type);
        setPowerUps(prev => prev.filter(p => p !== powerUp));
        
        setTimeout(() => {
          setPowerUpActive(null);
        }, POWER_UP_DURATION);
      }
    });
  }, [powerUps, player, POWER_UP_DURATION, checkCollision]);

  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    let animationFrameId;

    const gameLoop = (timestamp) => {
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;
      frameCountRef.current++;

      if (deltaTime >= GAME_SPEED) {
        updateGame();

        if (frameCountRef.current % 3 === 0) {
          spawnPowerUp();
          updatePowerUps();
          checkPowerUpCollisions();
        }

        lastFrameTimeRef.current = timestamp;
      }

      drawGame();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      frameCountRef.current = 0;
      lastFrameTimeRef.current = 0;
    };
  }, [
    gameStarted, gameOver, paused, GAME_SPEED,
    updateGame, spawnPowerUp, updatePowerUps, checkPowerUpCollisions, drawGame
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    // eslint-disable-next-line no-unused-vars
    const ctx = canvas.getContext('2d', { alpha: false });

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
      handleResize();
    };

    const handleResize = () => {
      // eslint-disable-next-line no-unused-vars
      const containerWidth = containerRef.current.clientWidth;
      // eslint-disable-next-line no-unused-vars
      const containerHeight = containerRef.current.clientHeight;

      let newWidth, newHeight;

      if (document.fullscreenElement) {
        const aspectRatio = 1;
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 120;

        if (maxWidth / aspectRatio <= maxHeight) {
          newWidth = maxWidth;
          newHeight = maxWidth / aspectRatio;
        } else {
          newHeight = maxHeight;
          newWidth = maxHeight * aspectRatio;
        }
      } else {
        newWidth = 500;
        newHeight = 500;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      setViewDimensions({
        width: newWidth,
        height: newHeight
      });

      setPlayer(prev => ({
        ...prev,
        x: newWidth / 2 - prev.width / 2,
        y: newHeight - prev.height - 20
      }));

      if (gameStarted && !gameOver) {
        createShields();
        repositionEnemies();
      }
    };

    const repositionEnemies = () => {
      const enemyWidth = 30;
      const enemyHeight = 20;
      const padding = 15;
      const offsetTop = 50;

      setEnemies(prev => {
        if (prev.length === 0) return prev;

        const rows = [...new Set(prev.map(e => e.y))].length;
        const cols = prev.length / rows;

        return prev.map((enemy, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;

          return {
            ...enemy,
            x: col * (enemyWidth + padding) + padding,
            y: row * (enemyHeight + padding) + offsetTop
          };
        });
      });
    };

    resizeObserver.current = new ResizeObserver(handleResize);
    resizeObserver.current.observe(containerRef.current);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);

    handleResize();
    const savedHighScore = localStorage.getItem('spaceInvadersHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    resetGame();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [gameStarted, gameOver, resetGame, createShields]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          setGameStarted(true);
          if (gameOver) {
            resetGame();
          }
          return;
        }
      }

      if (e.key === 'p' || e.key === 'P') {
        if (gameStarted && !gameOver) {
          setPaused(prev => !prev);
        }
        return;
      }

      setKeysPressed(prev => new Set([...prev, e.key.toLowerCase()]));
    };

    const handleKeyUp = (e) => {
      setKeysPressed(prev => {
        const newKeys = new Set([...prev]);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, resetGame]);

  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const processKeys = () => {
      if (keysPressed.has('arrowleft') || keysPressed.has('a')) {
        setPlayer(prev => ({
          ...prev,
          x: Math.max(0, prev.x - prev.speed)
        }));
      }
      if (keysPressed.has('arrowright') || keysPressed.has('d')) {
        setPlayer(prev => ({
          ...prev,
          x: Math.min(canvasRef.current.width - player.width, prev.x + prev.speed)
        }));
      }
      if (keysPressed.has(' ')) {
        handleShoot();
      }
    };

    const keyInterval = setInterval(processKeys, 10);
    return () => clearInterval(keyInterval);
  }, [keysPressed, gameStarted, gameOver, paused, player, bullets, powerUpActive, handleShoot]);

  const toggleFullscreen = async () => {
    try {
      if (gameStarted && !gameOver && !paused) {
        setPaused(true);
      }

      if (!document.fullscreenElement) {
        const elem = containerRef.current;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }

      setTimeout(() => {
        if (gameStarted && !gameOver) {
          setPaused(false);
        }
      }, 300);
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleTouchMove = useCallback((e) => {
    if (!gameStarted || gameOver || paused) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - player.width / 2;
    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, viewDimensions.width - player.width))
    }));
  }, [gameStarted, gameOver, paused, player.width, viewDimensions.width]);

  const handleTouchStart = useCallback((e) => {
    if (!gameStarted) {
      setGameStarted(true);
    } else if (gameOver) {
      resetGame();
    } else if (paused) {
      setPaused(false);
    } else {
      handleShoot();
    }
  }, [gameStarted, gameOver, paused, handleShoot, resetGame]);

  const handleCanvasClick = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    } else if (gameOver) {
      resetGame();
    } else if (paused) {
      setPaused(false);
    } else {
      handleShoot();
    }
  }, [gameStarted, gameOver, paused, handleShoot, resetGame]);

  return (
    <div 
      className="min-h-screen bg-black text-white font-mono flex flex-col" 
      ref={containerRef}
      style={{ touchAction: 'none' }}
    >
      <header className="bg-[#000066] p-4 border-b-4 border-[#FF00FF] z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#00FFFF]">SPACE INVADERS</h1>
          <div className="flex gap-4">
            <button
              onClick={toggleFullscreen}
              className="bg-[#FF00FF] text-white px-4 py-2 rounded hover:bg-[#CC00CC]"
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
        <div className="relative border-4 border-[#FF00FF] bg-black p-2 m-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="bg-black"
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onClick={handleCanvasClick}
          />
          
          <div className="absolute inset-0 pointer-events-none crt-overlay"></div>
        </div>
        
        {!isFullscreen && (
          <>
            <div className="max-w-md w-full bg-gray-900 border-2 border-[#FFFF00] p-4 mb-6 rounded">
              <h2 className="text-xl text-center text-[#FFFF00] mb-3">CONTROLS</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#00FFFF] mb-1">Keyboard:</p>
                  <ul className="text-white text-sm">
                    <li>Arrow Keys / AD: Move</li>
                    <li>Space: Shoot</li>
                    <li>P: Pause</li>
                    <li>Space/Enter: Start/Restart</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[#00FFFF] mb-1">Mobile:</p>
                  <ul className="text-white text-sm">
                    <li>Touch and move: Control ship</li>
                    <li>Tap: Shoot</li>
                    <li>Tap: Start/Restart/Unpause</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="md:hidden w-full max-w-md mb-6">
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    if (paused) setPaused(false);
                    else if (gameOver) {
                      resetGame();
                      setGameStarted(true);
                    }
                    else if (!gameStarted) setGameStarted(true);
                    else setPaused(true);
                  }}
                  className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center"
                >
                  {paused ? 'RESUME' : gameOver ? 'RESTART' : !gameStarted ? 'START' : 'PAUSE'}
                </button>
                
                <div></div>
                
                <button 
                  onClick={handleShoot}
                  className="bg-[#FF0000] text-white p-4 rounded-lg flex items-center justify-center"
                >
                  SHOOT
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {!isFullscreen && (
        <footer className="bg-gray-900 text-white p-4 text-center text-sm border-t-2 border-[#FFFF00]">
          <p>© 2023 RetroVerse - Space Invaders v1.0</p>
          <p className="text-gray-500 text-xs">Insert Coin To Continue...</p>
        </footer>
      )}
      
      <style jsx>{`
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default SpaceInvaders;