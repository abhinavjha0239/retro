import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const PongGame = () => {
  // Canvas settings
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [highScore, setHighScore] = useState(0);
  const [winScore, setWinScore] = useState(5);
  const [paused, setPaused] = useState(false);
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  
  // Game settings
  const [paddle1, setPaddle1] = useState({ x: 10, y: 200, width: 10, height: 80, speed: 8 });
  const [paddle2, setPaddle2] = useState({ x: 580, y: 200, width: 10, height: 80, speed: 5 });
  const [ball, setBall] = useState({ 
    x: 300, 
    y: 200, 
    radius: 8, 
    speedX: 5, 
    speedY: 5, 
    initialSpeedX: 5,
    initialSpeedY: 5
  });
  
  // Retro colors
  const colors = {
    background: '#000000',
    paddles: '#FFFF00',
    ball: '#00FFFF',
    net: '#FFFFFF',
    text: '#00FF00',
    gameOver: '#FF00FF'
  };
  
  // Initialize canvas and game
  useEffect(() => {
    if (canvasRef.current) {
      // Check if there's a stored high score
      const storedHighScore = localStorage.getItem('pongHighScore');
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
      
      // Set difficulty-based speed settings
      if (difficulty === 'easy') {
        setPaddle2(prev => ({ ...prev, speed: 3 }));
      } else if (difficulty === 'hard') {
        setPaddle2(prev => ({ ...prev, speed: 7 }));
      }
    }
  }, [difficulty]);
  
  // Reset ball
  const resetBall = () => {
    // Set ball to center
    setBall(prev => ({
      ...prev,
      x: 300,
      y: 200,
      speedX: prev.initialSpeedX * (Math.random() > 0.5 ? 1 : -1),
      speedY: prev.initialSpeedY * (Math.random() > 0.5 ? 1 : -1)
    }));
  };
  
  // Reset game
  const resetGame = () => {
    setPaddle1({ x: 10, y: 200, width: 10, height: 80, speed: 8 });
    setPaddle2({ x: 580, y: 200, width: 10, height: 80, speed: 5 });
    setScore({ player: 0, computer: 0 });
    setGameOver(false);
    resetBall();
    setGameStarted(false);
  };

  // Update paddles based on AI (for computer player)
  const updateComputer = () => {
    // AI paddle movement
    const paddleCenter = paddle2.y + paddle2.height / 2;
    const ballCenter = ball.y;
    
    // Add some reaction delay and error based on difficulty
    const reactionDelay = 
      difficulty === 'easy' ? 50 : 
      difficulty === 'medium' ? 25 : 10;
    
    // Add some randomness to make it feel more human
    const randomError = 
      difficulty === 'easy' ? Math.random() * 20 - 10 : 
      difficulty === 'medium' ? Math.random() * 10 - 5 : 
      Math.random() * 5 - 2.5;
    
    // Only move if ball is moving toward AI
    if (ball.speedX > 0) {
      // Move toward the ball with some error
      if (paddleCenter < ballCenter - reactionDelay + randomError) {
        // Move down
        setPaddle2(prev => ({
          ...prev,
          y: Math.min(prev.y + prev.speed, canvasRef.current.height - prev.height)
        }));
      } else if (paddleCenter > ballCenter + reactionDelay + randomError) {
        // Move up
        setPaddle2(prev => ({
          ...prev,
          y: Math.max(prev.y - prev.speed, 0)
        }));
      }
    } else {
      // When ball is moving away, slowly return to center
      if (paddleCenter < canvasRef.current.height / 2 - 20) {
        setPaddle2(prev => ({
          ...prev,
          y: Math.min(prev.y + prev.speed / 2, canvasRef.current.height - prev.height)
        }));
      } else if (paddleCenter > canvasRef.current.height / 2 + 20) {
        setPaddle2(prev => ({
          ...prev,
          y: Math.max(prev.y - prev.speed / 2, 0)
        }));
      }
    }
  };
  
  // Check collision with paddles
  const checkCollision = () => {
    // Check collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvasRef.current.height) {
      // Play wall bounce sound
      playSound(150, 0.1, 'square');
      setBall(prev => ({ ...prev, speedY: -prev.speedY }));
    }
    
    // Check collision with paddles
    const checkPaddleCollision = (paddle) => {
      if (
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.x + ball.radius >= paddle.x &&
        ball.y >= paddle.y &&
        ball.y <= paddle.y + paddle.height
      ) {
        // Calculate where ball hit the paddle (normalized from -1 to 1)
        const hitPosition = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        
        // Change angle based on where ball hit paddle (middle = straight, edges = angled)
        const bounceAngle = hitPosition * Math.PI / 4; // Max 45 degree angle
        
        // Increase speed slightly on every hit
        const speed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
        const newSpeed = Math.min(speed * 1.05, 15); // Cap max speed
        
        // Set new velocities
        const direction = paddle === paddle1 ? 1 : -1;
        setBall(prev => ({
          ...prev,
          speedX: direction * newSpeed * Math.cos(bounceAngle),
          speedY: newSpeed * Math.sin(bounceAngle)
        }));
        
        // Play paddle hit sound
        playSound(300, 0.2, 'sine');
        
        return true;
      }
      return false;
    };
    
    // Check paddle collisions
    return checkPaddleCollision(paddle1) || checkPaddleCollision(paddle2);
  };
  
  // Update ball position and check for scoring
  const updateBall = () => {
    setBall(prev => ({
      ...prev,
      x: prev.x + prev.speedX,
      y: prev.y + prev.speedY
    }));
    
    // Check if player scored
    if (ball.x > canvasRef.current.width) {
      setScore(prev => {
        const newPlayerScore = prev.player + 1;
        
        // Update high score if needed
        if (newPlayerScore > highScore) {
          setHighScore(newPlayerScore);
          localStorage.setItem('pongHighScore', newPlayerScore.toString());
        }
        
        // Play score sound
        playSound(700, 0.3, 'sawtooth');
        
        // Check if game is over
        if (newPlayerScore >= winScore) {
          setGameOver(true);
          return { ...prev, player: newPlayerScore };
        }
        
        // Reset ball
        resetBall();
        return { ...prev, player: newPlayerScore };
      });
    }
    
    // Check if computer scored
    if (ball.x < 0) {
      setScore(prev => {
        const newComputerScore = prev.computer + 1;
        
        // Play score sound
        playSound(400, 0.3, 'sawtooth');
        
        // Check if game is over
        if (newComputerScore >= winScore) {
          setGameOver(true);
          return { ...prev, computer: newComputerScore };
        }
        
        // Reset ball
        resetBall();
        return { ...prev, computer: newComputerScore };
      });
    }
  };

  // Play sounds using Web Audio API
  const playSound = (frequency, duration, type = 'sine') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error("Audio error:", error);
    }
  };
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || paused || !canvasRef.current) return;
    
    const gameLoop = setInterval(() => {
      updateComputer();
      updateBall();
      checkCollision();
    }, 1000 / 60); // 60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, paused, ball, paddle1, paddle2]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted && !gameOver && (e.key === ' ' || e.key === 'Enter')) {
        setGameStarted(true);
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
      
      // Paddle movement
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setPaddle1(prev => ({
            ...prev,
            y: Math.max(prev.y - prev.speed, 0)
          }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setPaddle1(prev => ({
            ...prev,
            y: Math.min(prev.y + prev.speed, canvasRef.current.height - prev.height)
          }));
          break;
        case '1':
          setDifficulty('easy');
          break;
        case '2':
          setDifficulty('medium');
          break;
        case '3':
          setDifficulty('hard');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, paused, resetGame]);
  
  // Draw game
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw middle line (net)
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = colors.net;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = colors.paddles;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
    // Draw ball
    ctx.fillStyle = colors.ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw score
    ctx.font = '48px VT323, monospace';
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.fillText(score.player.toString(), canvas.width / 4, 60);
    ctx.fillText(score.computer.toString(), 3 * canvas.width / 4, 60);
    
    // Draw game start screen
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '48px VT323, monospace';
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'center';
      ctx.fillText('PONG', canvas.width / 2, canvas.height / 3);
      
      ctx.font = '24px VT323, monospace';
      ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Use W/S or ↑/↓ to move', canvas.width / 2, canvas.height * 2/3);
      ctx.fillText('P to pause, R to restart', canvas.width / 2, canvas.height * 2/3 + 25);
      
      // Draw difficulty selection
      ctx.font = '16px VT323, monospace';
      ctx.fillText('Select Difficulty: 1-Easy, 2-Medium, 3-Hard', canvas.width / 2, canvas.height * 2/3 + 60);
      
      // Show current difficulty
      ctx.fillStyle = colors.ball;
      ctx.fillText(`Current: ${difficulty.toUpperCase()}`, canvas.width / 2, canvas.height * 2/3 + 85);
    }
    
    // Draw pause screen
    if (paused && gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '48px VT323, monospace';
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
      
      ctx.font = '48px VT323, monospace';
      ctx.fillStyle = colors.gameOver;
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);
      
      if (score.player > score.computer) {
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 3 + 60);
      } else {
        ctx.fillText('COMPUTER WINS!', canvas.width / 2, canvas.height / 3 + 60);
      }
      
      ctx.font = '24px VT323, monospace';
      ctx.fillStyle = colors.text;
      ctx.fillText(`Final Score: ${score.player} - ${score.computer}`, canvas.width / 2, canvas.height / 2 + 20);
      
      if (score.player > highScore) {
        ctx.fillStyle = '#FFFF00';
        ctx.fillText(`NEW HIGH SCORE: ${score.player}!`, canvas.width / 2, canvas.height / 2 + 60);
      } else {
        ctx.fillStyle = colors.text;
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 60);
      }
      
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height * 2/3 + 40);
    }
    
    // Draw high score and difficulty level
    ctx.font = '16px VT323, monospace';
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'left';
    ctx.fillText(`High Score: ${highScore}`, 10, 25);
    ctx.textAlign = 'right';
    ctx.fillText(`Difficulty: ${difficulty.toUpperCase()}`, canvas.width - 10, 25);
    
  }, [
    colors, paddle1, paddle2, ball, score, gameStarted, 
    gameOver, highScore, paused, difficulty
  ]);
  
  // Handle touch controls for mobile
  const handleTouchStart = (e) => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
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
    
    // Get touch position
    const touch = e.touches[0];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const touchY = touch.clientY - canvasRect.top;
    
    // Move paddle to touch position
    if (touchY > 0 && touchY < canvasRef.current.height) {
      setPaddle1(prev => ({
        ...prev,
        y: Math.min(
          Math.max(touchY - prev.height / 2, 0),
          canvasRef.current.height - prev.height
        )
      }));
    }
  };
  
  const handleTouchMove = (e) => {
    if (!gameStarted || gameOver || paused) return;
    
    // Get touch position
    const touch = e.touches[0];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const touchY = touch.clientY - canvasRect.top;
    
    // Move paddle to touch position
    if (touchY > 0 && touchY < canvasRef.current.height) {
      setPaddle1(prev => ({
        ...prev,
        y: Math.min(
          Math.max(touchY - prev.height / 2, 0),
          canvasRef.current.height - prev.height
        )
      }));
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-2xl">
        {/* Game title */}
        <h1 className="text-4xl text-center mb-4 text-[#FFFF00] font-mono">PONG</h1>
        
        {/* Canvas for game */}
        <div className="relative border-4 border-[#FFFF00] mb-4">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className="bg-black block w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          />
          
          {/* CRT scan line effect */}
          <div className="absolute inset-0 pointer-events-none z-10 crt-lines"></div>
        </div>
        
        {/* Controls info */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-[#00FFFF]">CONTROLS</div>
            <div className="text-xs">W/S or ↑/↓: Move</div>
            <div className="text-xs">P: Pause</div>
            <div className="text-xs">R: Restart</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-[#00FFFF]">DIFFICULTY</div>
            <div className="text-xs">1: Easy</div>
            <div className="text-xs">2: Medium</div>
            <div className="text-xs">3: Hard</div>
          </div>
        </div>
        
        {/* Back to games button */}
        <div className="text-center mb-4">
          <Link 
            to="/games" 
            className="inline-block bg-[#FFFF00] text-black font-bold py-2 px-4 rounded hover:bg-[#AAAA00] transition-colors"
          >
            BACK TO GAMES
          </Link>
        </div>
      </div>
      
      {/* CSS for scan lines */}
      <style jsx="true">{`
        .crt-lines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PongGame;