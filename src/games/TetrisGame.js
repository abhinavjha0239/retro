import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const TetrisGame = () => {
  // Canvas settings
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [paused, setPaused] = useState(false);
  // Add hold piece state
  const [holdPiece, setHoldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [gameOverAnimation, setGameOverAnimation] = useState({ active: false, frames: [] });
  
  // Game constants
  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 20;
  const EMPTY = 0;
  
  // Tetromino shapes and colors
  const SHAPES = [
    // I
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    // J
    [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]
    ],
    // L
    [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0]
    ],
    // O
    [
      [4, 4],
      [4, 4]
    ],
    // S
    [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0]
    ],
    // T
    [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0]
    ],
    // Z
    [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ]
  ];
  
  const COLORS = [
    '#000000', // empty
    '#00FFFF', // I - cyan
    '#0000FF', // J - blue
    '#FF8800', // L - orange
    '#FFFF00', // O - yellow
    '#00FF00', // S - green
    '#FF00FF', // T - purple
    '#FF0000'  // Z - red
  ];
  
  // Game state
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [dropInterval, setDropInterval] = useState(800); // Starting slightly faster than before
  const [combo, setCombo] = useState(0);
  
  // Drop speed calculation function
  const calculateDropInterval = (level) => {
    // More granular speed progression
    // Starting at 800ms, gradually decreasing with diminishing returns
    return Math.max(100, Math.floor(800 * Math.pow(0.85, level - 1)));
  };
  
  // Initialize game
  useEffect(() => {
    if (canvasRef.current) {
      // Check for stored high score
      const storedHighScore = localStorage.getItem('tetrisHighScore');
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    }
  }, []);
  
  // Create a new piece
  const createPiece = (shape = null) => {
    // If no shape is provided, get a random one
    if (shape === null) {
      shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }
    
    // Return the piece object
    return {
      shape,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0,
    };
  };
  
  // Initialize new game
  const newGame = () => {
    // Clear the board
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
    
    // Create new pieces
    const newPiece = createPiece();
    const nextNewPiece = createPiece();
    
    setCurrentPiece(newPiece);
    setNextPiece(nextNewPiece);
    
    // Reset game state
    setScore(0);
    setLevel(1);
    setLines(0);
    setCombo(0);
    setDropInterval(800);
    setGameOver(false);
    setGameStarted(true);
    setPaused(false);
    setHoldPiece(null);
    setCanHold(true);
    setGameOverAnimation({ active: false, frames: [] });
  };
  
  // Collision detection
  const collides = (piece, board, offsetX = 0, offsetY = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const nextX = piece.x + x + offsetX;
          const nextY = piece.y + y + offsetY;
          
          // Check if piece is outside the game bounds or collides with another piece
          if (
            nextX < 0 || 
            nextX >= COLS || 
            nextY >= ROWS || 
            nextY < 0 ||
            (nextY >= 0 && board[nextY] && board[nextY][nextX] !== EMPTY)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };
  
  // Rotate a piece
  const rotatePiece = (piece, direction) => {
    // Create a new rotated shape
    const newShape = [];
    
    if (direction > 0) {
      // Rotate clockwise
      for (let y = 0; y < piece.shape[0].length; y++) {
        newShape.push([]);
        for (let x = piece.shape.length - 1; x >= 0; x--) {
          newShape[y].push(piece.shape[x][y]);
        }
      }
    } else {
      // Rotate counter-clockwise
      for (let y = 0; y < piece.shape[0].length; y++) {
        newShape.push([]);
        for (let x = 0; x < piece.shape.length; x++) {
          newShape[y].push(piece.shape[x][piece.shape[0].length - 1 - y]);
        }
      }
    }
    
    // Return new piece with rotated shape
    return {
      ...piece,
      shape: newShape
    };
  };
  
  // Try to rotate with wall kicks
  const tryRotate = (direction) => {
    if (!currentPiece) return;
    
    // Create a rotated piece
    const rotated = rotatePiece(currentPiece, direction);
    
    // Try different positions to see if rotation is possible (wall kick)
    const kicks = [
      { x: 0, y: 0 },     // Original position
      { x: 1, y: 0 },     // Right
      { x: -1, y: 0 },    // Left
      { x: 0, y: -1 },    // Up
      { x: 1, y: -1 },    // Up-right
      { x: -1, y: -1 },   // Up-left
    ];
    
    for (const kick of kicks) {
      if (!collides(rotated, board, kick.x, kick.y)) {
        // Found a valid rotation position
        setCurrentPiece({
          ...rotated,
          x: rotated.x + kick.x,
          y: rotated.y + kick.y
        });
        
        // Play rotation sound
        playSound(400, 0.1, 'sine');
        return true;
      }
    }
    
    // No valid rotation found
    return false;
  };
  
  // Move piece horizontally
  const movePieceHorizontal = (dir) => {
    if (!currentPiece || paused || gameOver) return;
    
    if (!collides(currentPiece, board, dir, 0)) {
      setCurrentPiece(prev => ({
        ...prev,
        x: prev.x + dir
      }));
      
      // Play move sound
      playSound(200, 0.05, 'sine');
    }
  };
  
  // Hard drop piece
  const hardDrop = () => {
    if (!currentPiece || paused || gameOver) return;
    
    let dropDistance = 0;
    
    // Calculate how far the piece can drop
    while (!collides(currentPiece, board, 0, dropDistance + 1)) {
      dropDistance++;
    }
    
    // Drop the piece
    if (dropDistance > 0) {
      setCurrentPiece(prev => ({
        ...prev,
        y: prev.y + dropDistance
      }));
      
      // Play hard drop sound
      playSound(600, 0.2, 'square');
      
      // Award points for hard drop
      setScore(prev => prev + dropDistance * 2);
      
      // Force piece to lock immediately
      lockPiece();
    }
  };
  
  // Hold the current piece
  const holdCurrentPiece = () => {
    if (!canHold || paused || gameOver) return;
    
    // If no piece is being held, store the current piece and get a new one
    if (holdPiece === null) {
      setHoldPiece(currentPiece.shape);
      setCurrentPiece(nextPiece);
      setNextPiece(createPiece());
    } else {
      // Swap current piece with hold piece
      const tempPiece = holdPiece;
      setHoldPiece(currentPiece.shape);
      setCurrentPiece(createPiece(tempPiece));
    }
    
    // Prevent multiple holds in succession
    setCanHold(false);
    
    // Play hold sound
    playSound(350, 0.1, 'sine');
  };

  // Lock the current piece in place and check for line clears
  const lockPiece = () => {
    if (!currentPiece) return;
    
    // Create a new board with the piece locked in place
    const newBoard = [...board.map(row => [...row])];
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== EMPTY) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          
          // Check if piece would be placed above the play area
          if (boardY < 0) {
            setGameOver(true);
            return;
          }
          
          newBoard[boardY][boardX] = currentPiece.shape[y][x];
        }
      }
    }
    
    // Check for completed lines
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== EMPTY)) {
        // Line is complete, remove it
        linesCleared++;
        
        // Remove the line and add an empty one at the top
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLS).fill(EMPTY));
        
        // Since we removed a line, we need to check the same index again
        y++;
      }
    }
    
    // Update game state based on lines cleared
    if (linesCleared > 0) {
      // Play line clear sound
      playSound(300 + linesCleared * 100, 0.3, 'sawtooth');
      
      // Update lines count
      setLines(prev => {
        const newLines = prev + linesCleared;
        
        // Check for level up - now requires more lines at higher levels
        const newLevel = Math.min(15, Math.floor(newLines / (10 + Math.floor(newLines / 50)))) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setDropInterval(calculateDropInterval(newLevel));
          // Play level up sound
          playSound(440 + (newLevel * 50), 0.3, 'square');
        }
        
        return newLines;
      });
      
      // Update combo
      setCombo(prev => prev + 1);
      
      // Award points for line clear
      // Points formula: (100 * linesCleared * level) * comboMultiplier
      const comboMultiplier = 1 + (combo * 0.1);
      const pointsBase = [0, 100, 300, 500, 800]; // 1, 2, 3, 4 lines
      const levelMultiplier = Math.pow(1.2, level - 1); // Exponential score scaling
      let points = (pointsBase[linesCleared] || 1000) * levelMultiplier * comboMultiplier;
      
      setScore(prev => {
        const newScore = prev + Math.floor(points);
        
        // Update high score if needed
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('tetrisHighScore', newScore.toString());
        }
        
        return newScore;
      });
    } else {
      // Reset combo if no lines cleared
      setCombo(0);
      
      // Play lock sound
      playSound(200, 0.2, 'triangle');
    }
    
    // Update the board
    setBoard(newBoard);
    
    // Reset canHold for the next piece
    setCanHold(true);
    
    // Create a new piece using the next piece and generate a new next piece
    setCurrentPiece(nextPiece);
    setNextPiece(createPiece());
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
    if (!gameStarted || paused) return;

    if (gameOver && !gameOverAnimation.active) {
      // Create falling blocks animation
      const frames = board.flat().map((cell, index) => ({
        value: cell,
        x: index % COLS,
        y: Math.floor(index / COLS),
        speed: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        opacity: 1
      }));
      setGameOverAnimation({ active: true, frames });
      playSound(150, 1.5, 'sawtooth'); // Game over sound
    }

    let lastFrameTime = 0;
    let animationId;
    
    const update = (time) => {
      const deltaTime = time - lastFrameTime;
      lastFrameTime = time;
      
      if (currentPiece && !collides(currentPiece, board, 0, 1)) {
        if (deltaTime > dropInterval) {
          setCurrentPiece(prev => ({
            ...prev,
            y: prev.y + 1
          }));
          lastFrameTime = time;
        }
      } else {
        lockPiece();
      }

      // Update game over animation
      if (gameOverAnimation.active) {
        setGameOverAnimation(prev => ({
          ...prev,
          frames: prev.frames.map(frame => ({
            ...frame,
            y: frame.y + frame.speed,
            rotation: frame.rotation + 2,
            opacity: Math.max(0, frame.opacity - 0.02)
          }))
        }));
      }
      
      animationId = requestAnimationFrame(update);
    };
    
    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, gameOver, paused, currentPiece, board, dropInterval, gameOverAnimation.active, lockPiece, collides]);
  
  // Draw the game
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }
    
    // Draw the board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== EMPTY) {
          const color = COLORS[board[y][x]];
          
          // Draw filled block
          ctx.fillStyle = color;
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          
          // Draw block outline
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          
          // Draw block highlight (3D effect)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.moveTo(x * BLOCK_SIZE, y * BLOCK_SIZE);
          ctx.lineTo((x + 1) * BLOCK_SIZE, y * BLOCK_SIZE);
          ctx.lineTo(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE);
          ctx.fill();
          
          // Draw block shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.moveTo((x + 1) * BLOCK_SIZE, y * BLOCK_SIZE);
          ctx.lineTo((x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE);
          ctx.lineTo(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE);
          ctx.fill();
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      // Draw ghost piece (preview of where piece will land)
      let ghostY = 0;
      while (!collides(currentPiece, board, 0, ghostY + 1)) {
        ghostY++;
      }
      
      // Draw ghost piece
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== EMPTY) {
            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y + ghostY;
            
            if (boardY >= 0) {
              // Draw ghost block (outline only)
              ctx.strokeStyle = COLORS[currentPiece.shape[y][x]];
              ctx.lineWidth = 1;
              ctx.strokeRect(
                boardX * BLOCK_SIZE, 
                boardY * BLOCK_SIZE, 
                BLOCK_SIZE, 
                BLOCK_SIZE
              );
            }
          }
        }
      }
      
      // Draw actual piece
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== EMPTY) {
            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y;
            
            if (boardY >= 0) {
              const color = COLORS[currentPiece.shape[y][x]];
              
              // Draw filled block
              ctx.fillStyle = color;
              ctx.fillRect(
                boardX * BLOCK_SIZE, 
                boardY * BLOCK_SIZE, 
                BLOCK_SIZE, 
                BLOCK_SIZE
              );
              
              // Draw block outline
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1;
              ctx.strokeRect(
                boardX * BLOCK_SIZE, 
                boardY * BLOCK_SIZE, 
                BLOCK_SIZE, 
                BLOCK_SIZE
              );
              
              // Draw block highlight (3D effect)
              ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.beginPath();
              ctx.moveTo(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE);
              ctx.lineTo((boardX + 1) * BLOCK_SIZE, boardY * BLOCK_SIZE);
              ctx.lineTo(boardX * BLOCK_SIZE, (boardY + 1) * BLOCK_SIZE);
              ctx.fill();
              
              // Draw block shadow
              ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
              ctx.beginPath();
              ctx.moveTo((boardX + 1) * BLOCK_SIZE, boardY * BLOCK_SIZE);
              ctx.lineTo((boardX + 1) * BLOCK_SIZE, (boardY + 1) * BLOCK_SIZE);
              ctx.lineTo(boardX * BLOCK_SIZE, (boardY + 1) * BLOCK_SIZE);
              ctx.fill();
            }
          }
        }
      }
    }
    
    // Draw next piece preview
    if (nextPiece) {
      // Draw next piece box
      ctx.fillStyle = '#000000';
      ctx.fillRect(
        COLS * BLOCK_SIZE + 10, 
        10, 
        6 * BLOCK_SIZE, 
        6 * BLOCK_SIZE
      );
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        COLS * BLOCK_SIZE + 10, 
        10, 
        6 * BLOCK_SIZE, 
        6 * BLOCK_SIZE
      );
      
      // Draw next piece text
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(
        'NEXT', 
        COLS * BLOCK_SIZE + 10 + 3 * BLOCK_SIZE, 
        5
      );
      
      // Draw the next piece
      for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
          if (nextPiece.shape[y][x] !== EMPTY) {
            const color = COLORS[nextPiece.shape[y][x]];
            
            // Calculate position for centered piece
            const offsetX = (6 - nextPiece.shape[0].length) / 2;
            const offsetY = (6 - nextPiece.shape.length) / 2;
            
            // Draw filled block
            ctx.fillStyle = color;
            ctx.fillRect(
              COLS * BLOCK_SIZE + 10 + (x + offsetX) * BLOCK_SIZE, 
              10 + (y + offsetY) * BLOCK_SIZE, 
              BLOCK_SIZE, 
              BLOCK_SIZE
            );
            
            // Draw block outline
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(
              COLS * BLOCK_SIZE + 10 + (x + offsetX) * BLOCK_SIZE, 
              10 + (y + offsetY) * BLOCK_SIZE, 
              BLOCK_SIZE, 
              BLOCK_SIZE
            );
            
            // Draw block highlight (3D effect)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.moveTo(COLS * BLOCK_SIZE + 10 + (x + offsetX) * BLOCK_SIZE, 10 + (y + offsetY) * BLOCK_SIZE);
            ctx.lineTo(COLS * BLOCK_SIZE + 10 + (x + offsetX + 1) * BLOCK_SIZE, 10 + (y + offsetY) * BLOCK_SIZE);
            ctx.lineTo(COLS * BLOCK_SIZE + 10 + (x + offsetX) * BLOCK_SIZE, 10 + (y + offsetY + 1) * BLOCK_SIZE);
            ctx.fill();
            
            // Draw block shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(COLS * BLOCK_SIZE + 10 + (x + offsetX + 1) * BLOCK_SIZE, 10 + (y + offsetY) * BLOCK_SIZE);
            ctx.lineTo(COLS * BLOCK_SIZE + 10 + (x + offsetX + 1) * BLOCK_SIZE, 10 + (y + offsetY + 1) * BLOCK_SIZE);
            ctx.lineTo(COLS * BLOCK_SIZE + 10 + (x + offsetX) * BLOCK_SIZE, 10 + (y + offsetY + 1) * BLOCK_SIZE);
            ctx.fill();
          }
        }
      }
    }
    
    // Draw hold piece preview
    if (holdPiece) {
      // Draw hold piece box
      ctx.fillStyle = '#000000';
      ctx.fillRect(
        -6 * BLOCK_SIZE - 10, 
        10, 
        6 * BLOCK_SIZE, 
        6 * BLOCK_SIZE
      );
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        -6 * BLOCK_SIZE - 10, 
        10, 
        6 * BLOCK_SIZE, 
        6 * BLOCK_SIZE
      );
      
      // Draw hold piece text
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(
        'HOLD', 
        -6 * BLOCK_SIZE - 10 + 3 * BLOCK_SIZE, 
        5
      );
      
      // Draw the hold piece
      for (let y = 0; y < holdPiece.length; y++) {
        for (let x = 0; x < holdPiece[y].length; x++) {
          if (holdPiece[y][x] !== EMPTY) {
            const color = COLORS[holdPiece[y][x]];
            
            // Calculate position for centered piece
            const offsetX = (6 - holdPiece[0].length) / 2;
            const offsetY = (6 - holdPiece.length) / 2;
            
            // Draw filled block
            ctx.fillStyle = color;
            ctx.fillRect(
              -6 * BLOCK_SIZE - 10 + (x + offsetX) * BLOCK_SIZE, 
              10 + (y + offsetY) * BLOCK_SIZE, 
              BLOCK_SIZE, 
              BLOCK_SIZE
            );
            
            // Draw block outline
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(
              -6 * BLOCK_SIZE - 10 + (x + offsetX) * BLOCK_SIZE, 
              10 + (y + offsetY) * BLOCK_SIZE, 
              BLOCK_SIZE, 
              BLOCK_SIZE
            );
            
            // Draw block highlight (3D effect)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.moveTo(-6 * BLOCK_SIZE - 10 + (x + offsetX) * BLOCK_SIZE, 10 + (y + offsetY) * BLOCK_SIZE);
            ctx.lineTo(-6 * BLOCK_SIZE - 10 + (x + offsetX + 1) * BLOCK_SIZE, 10 + (y + offsetY) * BLOCK_SIZE);
            ctx.lineTo(-6 * BLOCK_SIZE - 10 + (x + offsetX) * BLOCK_SIZE, 10 + (y + offsetY + 1) * BLOCK_SIZE);
            ctx.fill();
            
            // Draw block shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(-6 * BLOCK_SIZE - 10 + (x + offsetX + 1) * BLOCK_SIZE, 10 + (y + offsetY) * BLOCK_SIZE);
            ctx.lineTo(-6 * BLOCK_SIZE - 10 + (x + offsetX + 1) * BLOCK_SIZE, 10 + (y + offsetY + 1) * BLOCK_SIZE);
            ctx.lineTo(-6 * BLOCK_SIZE - 10 + (x + offsetX) * BLOCK_SIZE, 10 + (y + offsetY + 1) * BLOCK_SIZE);
            ctx.fill();
          }
        }
      }
    }
    
    // Draw game info
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px VT323, monospace';
    ctx.textAlign = 'left';
    
    ctx.fillText(`SCORE: ${score}`, COLS * BLOCK_SIZE + 10, 140);
    ctx.fillText(`LEVEL: ${level}`, COLS * BLOCK_SIZE + 10, 170);
    ctx.fillText(`LINES: ${lines}`, COLS * BLOCK_SIZE + 10, 200);
    ctx.fillText(`HIGH SCORE: ${highScore}`, COLS * BLOCK_SIZE + 10, 230);
    
    // If combo is active, show it
    if (combo > 1) {
      ctx.fillStyle = '#FFFF00';
      ctx.fillText(`COMBO x${combo}`, COLS * BLOCK_SIZE + 10, 260);
    }
    
    // Draw controls info
    ctx.fillStyle = '#00FFFF';
    ctx.fillText('CONTROLS:', COLS * BLOCK_SIZE + 10, 290);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('←/→: Move', COLS * BLOCK_SIZE + 10, 310);
    ctx.fillText('↑: Rotate', COLS * BLOCK_SIZE + 10, 330);
    ctx.fillText('↓: Soft Drop', COLS * BLOCK_SIZE + 10, 350);
    ctx.fillText('SPACE: Hard Drop', COLS * BLOCK_SIZE + 10, 370);
    ctx.fillText('C: Hold Piece', COLS * BLOCK_SIZE + 10, 390);
    ctx.fillText('P: Pause', COLS * BLOCK_SIZE + 10, 410);
    
    // Draw start screen
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '48px VT323, monospace';
      ctx.fillStyle = '#00FFFF';
      ctx.textAlign = 'center';
      ctx.fillText('TETRIS', canvas.width / 2, canvas.height / 3);
      
      ctx.font = '24px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Press ENTER to Start', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px VT323, monospace';
      ctx.fillText('Use ←/→ to move, ↑ to rotate', canvas.width / 2, canvas.height * 2/3);
      ctx.fillText('↓ to drop, SPACE for hard drop', canvas.width / 2, canvas.height * 2/3 + 25);
    }
    
    // Draw pause screen
    if (paused && gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '48px VT323, monospace';
      ctx.fillStyle = '#FFFF00';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 40);
    }
    
    // Draw game over screen
    if (gameOver && gameOverAnimation.active) {
      gameOverAnimation.frames.forEach(frame => {
        if (frame.value !== EMPTY && frame.opacity > 0) {
          ctx.save();
          ctx.globalAlpha = frame.opacity;
          ctx.translate(
            frame.x * BLOCK_SIZE + BLOCK_SIZE / 2,
            frame.y * BLOCK_SIZE + BLOCK_SIZE / 2
          );
          ctx.rotate((frame.rotation * Math.PI) / 180);
          
          ctx.fillStyle = COLORS[frame.value];
          ctx.fillRect(-BLOCK_SIZE / 2, -BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE);
          ctx.restore();
        }
      });

      // Draw game over text with pulsing effect
      const pulseAmount = Math.sin(Date.now() / 200) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255, 0, 0, ${pulseAmount})`;
      ctx.font = '48px VT323, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);
      
      // Draw score info
      ctx.font = '24px VT323, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);

      if (score === highScore && score > 0) {
        const rainbow = `hsl(${(Date.now() / 50) % 360}, 100%, 50%)`;
        ctx.fillStyle = rainbow;
        ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 40);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 40);
      }
    }
    
  }, [
    BLOCK_SIZE, COLS, ROWS, COLORS, board, currentPiece, nextPiece, holdPiece,
    gameStarted, gameOver, score, level, lines, highScore, paused, combo, gameOverAnimation
  ]);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Start game
      if (!gameStarted && !gameOver && (e.key === 'Enter' || e.key === ' ')) {
        newGame();
        return;
      }
      
      // Game is paused or over, handle special keys
      if (paused || gameOver) {
        if (e.key === 'p' || e.key === 'P') {
          setPaused(prev => !prev);
        } else if (gameOver && (e.key === 'r' || e.key === 'R')) {
          newGame();
        }
        return;
      }
      
      // Game is running, handle controls
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePieceHorizontal(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePieceHorizontal(1);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          tryRotate(1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          // Soft drop - temporarily increase speed
          if (currentPiece && !collides(currentPiece, board, 0, 1)) {
            setCurrentPiece(prev => ({
              ...prev,
              y: prev.y + 1
            }));
          }
          break;
        case ' ':
          hardDrop();
          break;
        case 'c':
        case 'C':
          holdCurrentPiece();
          break;
        case 'p':
        case 'P':
          setPaused(prev => !prev);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameStarted, gameOver, paused, dropInterval, canHold,
    hardDrop, holdCurrentPiece, movePieceHorizontal, newGame, tryRotate,
    board, currentPiece // Add missing dependencies
  ]);
  
  // Handle touch controls
  const handleTouchStart = (e) => {
    if (!gameStarted && !gameOver) {
      newGame();
      return;
    }
    
    if (gameOver) {
      newGame();
      return;
    }
    
    if (paused) {
      setPaused(false);
      return;
    }
    
    // Get touch position
    const touch = e.touches[0];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    
    // Store touch position for move calculations
    setTouchStart({ x: touchX, y: touchY });
  };
  
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [lastTouchMove, setLastTouchMove] = useState(0);
  
  const handleTouchMove = (e) => {
    if (!gameStarted || gameOver || paused) return;
    
    // Throttle touch move events to avoid too many updates
    const now = Date.now();
    if (now - lastTouchMove < 50) return;
    setLastTouchMove(now);
    
    const touch = e.touches[0];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    
    // Calculate swipe direction
    const deltaX = touchX - touchStart.x;
    const deltaY = touchY - touchStart.y;
    
    // Determine if it's a horizontal or vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe - move left or right
      if (deltaX > 20) {
        movePieceHorizontal(1);
        setTouchStart({ x: touchX, y: touchY });
      } else if (deltaX < -20) {
        movePieceHorizontal(-1);
        setTouchStart({ x: touchX, y: touchY });
      }
    } else {
      // Vertical swipe - rotate or soft drop
      if (deltaY < -50) {
        // Swipe up - rotate
        tryRotate(1);
        setTouchStart({ x: touchX, y: touchY });
      } else if (deltaY > 50) {
        // Swipe down - soft drop
        if (currentPiece && !collides(currentPiece, board, 0, 1)) {
          setCurrentPiece(prev => ({
            ...prev,
            y: prev.y + 1
          }));
        }
        setTouchStart({ x: touchX, y: touchY });
      }
    }
  };
  
  const handleTouchEnd = () => {
    // Reset touch state
    setTouchStart({ x: 0, y: 0 });
  };
  
  const handleDoubleTap = () => {
    if (!gameStarted || gameOver || paused) return;
    
    // Double tap for hard drop
    hardDrop();
  };
  
  // Tap and double tap detection
  const [lastTap, setLastTap] = useState(0);
  
  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;
    
    if (timeSinceLastTap < 300) {
      // Double tap detected
      handleDoubleTap();
      setLastTap(0);
    } else {
      // Single tap
      setLastTap(now);
      
      // Single tap to rotate
      if (gameStarted && !gameOver && !paused) {
        tryRotate(1);
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-2xl">
        {/* Game title */}
        <h1 className="text-4xl text-center mb-4 text-[#00FFFF] font-mono">TETRIS</h1>
        
        {/* Canvas for game */}
        <div className="relative border-4 border-[#00FFFF] mb-4">
          <canvas 
            ref={canvasRef} 
            width={COLS * BLOCK_SIZE + 200} 
            height={ROWS * BLOCK_SIZE} 
            className="bg-black block w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleTap}
          />
          
          {/* CRT scan line effect */}
          <div className="absolute inset-0 pointer-events-none z-10 crt-lines"></div>
        </div>
        
        {/* Mobile controls info (hidden on larger screens) */}
        <div className="md:hidden text-center mb-4">
          <div className="text-sm text-[#00FFFF]">TOUCH CONTROLS</div>
          <div className="text-xs">Swipe Left/Right: Move</div>
          <div className="text-xs">Tap: Rotate</div>
          <div className="text-xs">Swipe Down: Soft Drop</div>
          <div className="text-xs">Double Tap: Hard Drop</div>
        </div>
        
        {/* Back to games button */}
        <div className="text-center mb-4">
          <Link 
            to="/games" 
            className="inline-block bg-[#00FFFF] text-black font-bold py-2 px-4 rounded hover:bg-[#00AAAA] transition-colors"
          >
            BACK TO GAMES
          </Link>
        </div>
      </div>
      
      {/* Floating pause button for mobile */}
      <button
        className="md:hidden fixed bottom-4 right-4 bg-[#00FFFF] text-black font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-20"
        onClick={() => setPaused(prev => !prev)}
      >
        {paused ? '▶' : '⏸'}
      </button>
      
      {/* CSS for scan lines and pause button animation */}
      <style jsx="true">{`
        .crt-lines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        button:active {
          animation: pulse 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TetrisGame;