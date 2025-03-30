import React, { useState, useEffect, useRef } from 'react';
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
  const [level, setLevel] = useState(1);
  const [viewDimensions, setViewDimensions] = useState({ width: 500, height: 500 });

  const BULLET_SPEED = 15;
  const MAX_BULLETS = 4;
  const BULLET_COOLDOWN = 80;
  const GAME_SPEED = 1000 / 75;
  const ENEMY_BULLET_SPEED = 3;
  const ENEMY_SPEED = 1;
  const ENEMY_DROP_DISTANCE = 20;
  const ENEMY_FIRE_RATE = 0.01;
  const SHIELD_WIDTH = 60;
  const SHIELD_HEIGHT = 20;
  const POWER_UP_TYPES = ['rapidFire', 'shield', 'multiShot'];
  const POWER_UP_DURATION = 10000;

  const lastBulletFiredRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
      handleResize();
    };

    const handleResize = () => {
      const containerWidth = containerRef.current.clientWidth;
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
  }, []);

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
  }, [gameStarted, gameOver]);

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
  }, [keysPressed, gameStarted, gameOver, paused, player, bullets, powerUpActive]);

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
  }, [gameStarted, gameOver, paused, player, bullets, enemies, enemyBullets, powerUps, powerUpActive, viewDimensions]);

  const updateBullets = () => {
    setBullets(prev => prev
      .map(bullet => {
        const xMove = bullet.angle ? BULLET_SPEED * Math.sin(bullet.angle) : 0;
        return {
          ...bullet,
          x: bullet.x + xMove,
          y: bullet.y - BULLET_SPEED
        };
      })
      .filter(bullet => bullet.y > 0)
    );
  };

  const createEnemies = () => {
    const numRows = Math.min(3 + Math.floor(level / 2), 5);
    const numCols = Math.min(6 + Math.floor(level / 3), 10);
    const enemyWidth = 30;
    const enemyHeight = 20;
    const padding = 15;
    const offsetTop = 50;

    const newEnemies = [];

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const enemyType = row <= 1 ? 'advanced' : row === 2 ? 'medium' : 'basic';
        const points = row <= 1 ? 30 : row === 2 ? 20 : 10;

        newEnemies.push({
          x: col * (enemyWidth + padding) + padding,
          y: row * (enemyHeight + padding) + offsetTop,
          width: enemyWidth,
          height: enemyHeight,
          type: enemyType,
          points,
          direction: 1
        });
      }
    }

    setEnemies(newEnemies);
  };

  const createShields = () => {
    const shieldCount = 4;
    const spacing = canvasRef.current.width / (shieldCount + 1);

    const newShields = [];
    for (let i = 0; i < shieldCount; i++) {
      newShields.push({
        x: spacing * (i + 1) - SHIELD_WIDTH / 2,
        y: canvasRef.current.height - 100,
        width: SHIELD_WIDTH,
        height: SHIELD_HEIGHT,
        health: 3
      });
    }
    setShields(newShields);
  };

  const resetGame = () => {
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
  };

  const spawnPowerUp = () => {
    if (Math.random() < 0.01 && powerUps.length < 1) {
      const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
      setPowerUps([{
        x: Math.random() * (canvasRef.current.width - 20),
        y: 50,
        width: 20,
        height: 20,
        type,
        speed: 2
      }]);
    }
  };

  const updatePowerUps = () => {
    setPowerUps(prev => prev
      .map(powerUp => ({
        ...powerUp,
        y: powerUp.y + powerUp.speed
      }))
      .filter(powerUp => powerUp.y < canvasRef.current.height)
    );
  };

  const checkPowerUpCollisions = () => {
    powerUps.forEach(powerUp => {
      if (
        powerUp.x < player.x + player.width &&
        powerUp.x + powerUp.width > player.x &&
        powerUp.y < player.y + player.height &&
        powerUp.y + powerUp.height > player.y
      ) {
        setPowerUpActive(powerUp.type);
        setPowerUps([]);
        playSound('powerup', 0.4);

        setTimeout(() => {
          setPowerUpActive(null);
        }, POWER_UP_DURATION);
      }
    });
  };

  const updateGame = () => {
    updateBullets();
    updateEnemies();
    updateEnemyBullets();
    checkCollisions();

    if (enemies.length === 0) {
      nextLevel();
    }
  };

  const updateEnemies = () => {
    let needsToDropAndReverse = false;

    enemies.forEach(enemy => {
      if (
        (enemy.x + enemy.width + ENEMY_SPEED >= canvasRef.current.width && enemy.direction === 1) ||
        (enemy.x - ENEMY_SPEED <= 0 && enemy.direction === -1)
      ) {
        needsToDropAndReverse = true;
      }
    });

    setEnemies(prev => {
      if (needsToDropAndReverse) {
        return prev.map(enemy => ({
          ...enemy,
          y: enemy.y + ENEMY_DROP_DISTANCE,
          direction: enemy.direction * -1
        }));
      } else {
        return prev.map(enemy => ({
          ...enemy,
          x: enemy.x + (ENEMY_SPEED * enemy.direction)
        }));
      }
    });

    const enemyReachedBottom = enemies.some(enemy => 
      enemy.y + enemy.height >= player.y
    );

    if (enemyReachedBottom) {
      setGameOver(true);
    }

    enemies.forEach(enemy => {
      if (Math.random() < ENEMY_FIRE_RATE) {
        fireEnemyBullet(enemy);
      }
    });
  };

  const fireEnemyBullet = (enemy) => {
    setEnemyBullets(prev => [
      ...prev,
      {
        x: enemy.x + enemy.width / 2,
        y: enemy.y + enemy.height,
        width: 3,
        height: 10
      }
    ]);

    playSound('enemyShoot', 0.2);
  };

  const updateEnemyBullets = () => {
    setEnemyBullets(prev => prev
      .map(bullet => ({ ...bullet, y: bullet.y + ENEMY_BULLET_SPEED }))
      .filter(bullet => bullet.y < canvasRef.current.height)
    );
  };

  const checkCollisions = () => {
    bullets.forEach(bullet => {
      enemies.forEach((enemy, index) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          setScore(prev => prev + enemy.points);
          setEnemies(prev => prev.filter((_, i) => i !== index));
          setBullets(prev => prev.filter(b => b !== bullet));

          playSound('explosion', 0.3);
        }
      });
    });

    enemyBullets.forEach((bullet, index) => {
      if (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        setLives(prev => prev - 1);
        setEnemyBullets(prev => prev.filter((_, i) => i !== index));

        playSound('playerHit', 0.4);

        if (lives <= 1) {
          endGame();
        }
      }
    });

    shields.forEach((shield, shieldIndex) => {
      enemyBullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < shield.x + shield.width &&
          bullet.x + bullet.width > shield.x &&
          bullet.y < shield.y + shield.height &&
          bullet.y + bullet.height > shield.y
        ) {
          setShields(prev => {
            const updatedShields = [...prev];
            updatedShields[shieldIndex].health -= 1;
            return updatedShields.filter(shield => shield.health > 0);
          });
          setEnemyBullets(prev => prev.filter((_, i) => i !== bulletIndex));
        }
      });
    });
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    createEnemies();
    setBullets([]);
    setEnemyBullets([]);

    playSound('levelUp', 0.5);
  };

  const endGame = () => {
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('spaceInvadersHighScore', score.toString());
    }

    playSound('gameOver', 0.5);
  };

  const playSound = (type, volume = 0.5) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.value = volume;

      switch (type) {
        case 'shoot':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        case 'enemyShoot':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        case 'explosion':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.3);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'playerHit':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(830, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.2);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'levelUp':
          oscillator.type = 'sine';

          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3);

          gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
          break;

        case 'gameOver':
          oscillator.type = 'sawtooth';

          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(415, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.4);
          oscillator.frequency.setValueAtTime(370, audioContext.currentTime + 0.6);
          oscillator.frequency.setValueAtTime(349, audioContext.currentTime + 0.8);

          gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

          oscillator.start();
          oscillator.stop(audioContext.currentTime + 1);
          break;

        case 'powerup':
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const drawGame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarfield(ctx, canvas);

    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(player.x + player.width / 2 - 2, player.y - 10, 4, 10);

    ctx.fillStyle = '#FFFF00';
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.forEach(enemy => {
      drawEnemy(ctx, enemy);
    });

    ctx.fillStyle = '#FF0000';
    enemyBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    ctx.fillStyle = '#00FF00';
    shields.forEach(shield => {
      const opacity = shield.health * 0.3;
      ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
      ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
    });

    powerUps.forEach(powerUp => {
      ctx.fillStyle = powerUp.type === 'rapidFire' ? '#FFFF00' :
                     powerUp.type === 'shield' ? '#00FF00' : '#FF00FF';
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });

    if (powerUpActive) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`POWER-UP: ${powerUpActive.toUpperCase()}`, 10, 40);
    }

    ctx.font = '16px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 10, 20);
    ctx.fillText(`LEVEL: ${level}`, canvas.width / 2 - 30, 20);

    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${'❤️'.repeat(lives)}`, canvas.width - 10, 20);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '30px monospace';
      ctx.fillStyle = '#FF00FF';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);

      ctx.font = '20px monospace';
      ctx.fillStyle = '#00FFFF';
      ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText(`HIGH SCORE: ${highScore}`, canvas.width / 2, canvas.height / 2 + 10);

      ctx.font = '16px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('PRESS SPACE TO PLAY AGAIN', canvas.width / 2, canvas.height * 2/3);
    }

    if (!gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '30px monospace';
      ctx.fillStyle = '#00FFFF';
      ctx.textAlign = 'center';
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3 - 20);

      drawRetroLogo(ctx, canvas.width / 2 - 40, canvas.height / 3, 80);

      ctx.font = '20px monospace';
      ctx.fillStyle = '#FFFF00';
      ctx.fillText('PRESS SPACE TO START', canvas.width / 2, canvas.height * 2/3);

      ctx.font = '16px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('ARROWS OR WASD TO MOVE', canvas.width / 2, canvas.height * 2/3 + 30);
      ctx.fillText('SPACE TO SHOOT', canvas.width / 2, canvas.height * 2/3 + 50);
      ctx.fillText('P TO PAUSE', canvas.width / 2, canvas.height * 2/3 + 70);
    }

    if (paused && gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '30px monospace';
      ctx.fillStyle = '#00FFFF';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

      ctx.font = '16px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('PRESS P TO RESUME', canvas.width / 2, canvas.height / 2 + 40);
    }
  };

  const drawRetroLogo = (ctx, x, y, size) => {
    const pixelSize = size / 10;

    const pattern = [
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
    ];

    ctx.fillStyle = '#FF00FF';

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === 1) {
          ctx.fillRect(
            x + col * pixelSize, 
            y + row * pixelSize, 
            pixelSize, 
            pixelSize
          );
        }
      }
    }
  };

  const drawStarfield = (ctx, canvas) => {
    for (let i = 0; i < 100; i++) {
      const starX = Math.random() * canvas.width;
      const starY = Math.random() * canvas.height;
      const starSize = Math.random() * 2;
      const brightness = Math.random();

      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fillRect(starX, starY, starSize, starSize);
    }
  };

  const drawEnemy = (ctx, enemy) => {
    switch (enemy.type) {
      case 'advanced':
        ctx.fillStyle = '#FF00FF';
        break;
      case 'medium':
        ctx.fillStyle = '#00FF00';
        break;
      default:
        ctx.fillStyle = '#FF0000';
        break;
    }

    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    ctx.fillStyle = '#000000';

    if (enemy.type === 'advanced') {
      ctx.fillRect(enemy.x + 5, enemy.y + 5, 4, 4);
      ctx.fillRect(enemy.x + 13, enemy.y + 5, 4, 4);
      ctx.fillRect(enemy.x + 21, enemy.y + 5, 4, 4);

      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(enemy.x + enemy.width / 2 - 1, enemy.y - 4, 2, 4);
    } else if (enemy.type === 'medium') {
      ctx.fillRect(enemy.x + 7, enemy.y + 5, 4, 4);
      ctx.fillRect(enemy.x + 19, enemy.y + 5, 4, 4);

      ctx.fillRect(enemy.x + 2, enemy.y + 12, 6, 3);
      ctx.fillRect(enemy.x + 22, enemy.y + 12, 6, 3);
    } else {
      ctx.fillRect(enemy.x + 10, enemy.y + 5, 10, 5);
      ctx.fillRect(enemy.x + 5, enemy.y + 12, 20, 3);
    }
  };

  const handleTouchMove = (e) => {
    if (paused || gameOver || !gameStarted) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;

    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(canvas.width - prev.width, touchX - prev.width / 2))
    }));
  };

  const handleTouchStart = (e) => {
    if (!gameStarted) {
      setGameStarted(true);
      if (gameOver) {
        resetGame();
      }
      return;
    }

    if (paused) {
      setPaused(false);
      return;
    }

    if (gameOver) {
      resetGame();
      setGameStarted(true);
      return;
    }

    handleShoot();
  };

  const handleShoot = () => {
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
  };

  const handleCanvasClick = () => {
    if (!gameStarted) {
      setGameStarted(true);
      if (gameOver) {
        resetGame();
      }
      return;
    }

    if (paused) {
      setPaused(false);
      return;
    }

    if (gameOver) {
      resetGame();
      setGameStarted(true);
      return;
    }
  };

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