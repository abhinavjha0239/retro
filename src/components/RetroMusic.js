import React, { useState, useRef, useEffect } from 'react';

const RetroMusic = () => {
  const [activeTrack, setActiveTrack] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sample audio URLs - in a real app, these would be actual file paths
  const audioSamples = {
    'chip-tunes': [
      '/audio/overworld-theme.mp3',
      '/audio/underwater-melody.mp3', 
      '/audio/castle-theme.mp3',
      '/audio/green-hill-zone.mp3',
      '/audio/tetris-a-type.mp3'
    ],
    'arcade-themes': [
      '/audio/high-score-music.mp3',
      '/audio/level-start.mp3',
      '/audio/game-over.mp3',
      '/audio/bonus-round.mp3',
      '/audio/victory-theme.mp3'
    ],
    'console-classics': [
      '/audio/character-select.mp3',
      '/audio/guile-theme.mp3',
      '/audio/emerald-hill.mp3',
      '/audio/corneria.mp3',
      '/audio/moon-theme.mp3'
    ],
    'sound-effects': [
      '/audio/coin-collect.mp3',
      '/audio/power-up.mp3',
      '/audio/extra-life.mp3',
      '/audio/game-over-sound.mp3',
      '/audio/enemy-defeat.mp3'
    ]
  };

  // For demo purposes, we'll use a placeholder audio
  const placeholderAudio = "https://assets.codepen.io/217233/kl__chiptune_loop.mp3";

  useEffect(() => {
    // Set up audio event listeners
    const audioElement = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [playingTrack]);

  const playTrack = (category, trackIndex) => {
    // If we're already playing this track, pause it
    if (playingTrack && playingTrack.category === category && playingTrack.index === trackIndex) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Set the new track to play
    setPlayingTrack({ category, index: trackIndex });
    setIsPlaying(true);
    
    // Reset time
    setCurrentTime(0);
    
    // If audio element exists, play the new track
    if (audioRef.current) {
      audioRef.current.src = placeholderAudio; // In production, use: audioSamples[category][trackIndex]
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const musicTracks = [
    {
      id: 'chip-tunes',
      title: 'CHIP TUNES',
      description: 'Classic 8-bit melodies from the NES and Game Boy era.',
      color: '#00FF00',
      icon: '🎵'
    },
    {
      id: 'arcade-themes',
      title: 'ARCADE THEMES',
      description: 'Iconic sounds from arcade cabinets that defined an era.',
      color: '#FF00FF',
      icon: '🎹'
    },
    {
      id: 'console-classics',
      title: 'CONSOLE CLASSICS',
      description: 'Memorable soundtracks from 16-bit console games.',
      color: '#FFFF00',
      icon: '🎼'
    },
    {
      id: 'sound-effects',
      title: 'SOUND EFFECTS',
      description: 'Nostalgic beeps, boops, and bloops from retro gaming.',
      color: '#00FFFF',
      icon: '🔊'
    }
  ];

  const trackList = {
    'chip-tunes': [
      { name: 'Overworld Theme', duration: '2:42', game: 'Super Bros' },
      { name: 'Underwater Melody', duration: '1:33', game: 'Super Bros' },
      { name: 'Castle Theme', duration: '1:56', game: 'Super Bros' },
      { name: 'Green Hill Zone', duration: '2:12', game: 'Sonic' },
      { name: 'Tetris A-Type', duration: '1:45', game: 'Tetris' }
    ],
    'arcade-themes': [
      { name: 'High Score Music', duration: '0:45', game: 'Pac-Man' },
      { name: 'Level Start', duration: '0:15', game: 'Galaga' },
      { name: 'Game Over', duration: '0:10', game: 'Space Invaders' },
      { name: 'Bonus Round', duration: '1:20', game: 'Ms. Pac-Man' },
      { name: 'Victory Theme', duration: '0:32', game: 'Donkey Kong' }
    ],
    'console-classics': [
      { name: 'Character Select', duration: '1:28', game: 'Street Fighter II' },
      { name: 'Guile\'s Theme', duration: '3:12', game: 'Street Fighter II' },
      { name: 'Emerald Hill', duration: '2:25', game: 'Sonic 2' },
      { name: 'Corneria', duration: '2:04', game: 'Star Fox' },
      { name: 'Moon Theme', duration: '2:43', game: 'DuckTales' }
    ],
    'sound-effects': [
      { name: 'Coin Collect', duration: '0:01', game: 'Various' },
      { name: 'Power Up', duration: '0:02', game: 'Various' },
      { name: 'Extra Life', duration: '0:01', game: 'Various' },
      { name: 'Game Over', duration: '0:03', game: 'Various' },
      { name: 'Enemy Defeat', duration: '0:01', game: 'Various' }
    ]
  };

  return (
    <div className="py-12 bg-black text-white font-mono">
      <div className="container mx-auto px-4">
        {/* Hidden audio element */}
        <audio ref={audioRef} />

        {/* Retro Header */}
        <div className="bg-[#440044] border-b-4 border-[#00FF00] p-6 mb-12 rounded-t-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#00FF00]">
            {/* Animated title letters */}
            {'RETRO AUDIO'.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
          <div className="text-center text-[#FFFF00] blink-slow">LISTEN • DOWNLOAD • REMIX</div>
        </div>

        {/* Audio Player Controls - only shows when a track is playing */}
        {playingTrack && (
          <div className={`border-4 p-4 mb-8 rounded-lg audio-player`}
               style={{ borderColor: playingTrack ? musicTracks.find(t => t.id === playingTrack.category)?.color : '#FFFFFF' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: musicTracks.find(t => t.id === playingTrack.category)?.color }}>
                  NOW PLAYING: {trackList[playingTrack.category][playingTrack.index].name}
                </h3>
                <div className="text-sm text-gray-400">
                  {trackList[playingTrack.category][playingTrack.index].game}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  className="text-2xl focus:outline-none hover:text-[#00FF00] transition-colors"
                  onClick={() => {
                    if (isPlaying) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    } else {
                      audioRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button 
                  className="text-2xl focus:outline-none hover:text-[#FF0000] transition-colors"
                  onClick={() => {
                    audioRef.current.pause();
                    setPlayingTrack(null);
                    setIsPlaying(false);
                  }}
                >
                  ⏹️
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{trackList[playingTrack.category][playingTrack.index].duration}</span>
              </div>
              <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full"
                  style={{ 
                    width: `${(currentTime / duration) * 100}%`,
                    backgroundColor: musicTracks.find(t => t.id === playingTrack.category)?.color
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Music Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {musicTracks.map(track => (
            <div
              key={track.id}
              className="border-4 border-dashed hover:border-solid p-4 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{ borderColor: track.color }}
              onClick={() => setActiveTrack(track.id === activeTrack ? null : track.id)}
            >
              <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center h-full flex flex-col hover:bg-gray-800 transition-colors duration-300">
                <div 
                  className="text-6xl mb-4 mx-auto bg-black w-20 h-20 flex items-center justify-center rounded-lg"
                  style={{ color: track.color }}
                >
                  {track.icon}
                </div>
                
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: track.color }}
                >
                  {track.title}
                </h2>
                
                <p className="text-gray-400 mb-4 flex-grow">{track.description}</p>
                
                <div 
                  className="mt-4 py-2 px-4 rounded-lg font-bold text-black"
                  style={{ backgroundColor: track.color }}
                >
                  {activeTrack === track.id ? 'HIDE PLAYLIST' : 'SHOW PLAYLIST'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Playlist Section */}
        {activeTrack && (
          <div 
            className="border-4 p-6 rounded-lg mb-12 animate-fadeIn"
            style={{ borderColor: musicTracks.find(t => t.id === activeTrack)?.color }}
          >
            <h3 
              className="text-2xl text-center mb-6"
              style={{ color: musicTracks.find(t => t.id === activeTrack)?.color }}
            >
              {musicTracks.find(t => t.id === activeTrack)?.title} PLAYLIST
            </h3>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 text-left pl-4">TRACK</th>
                    <th className="py-2 text-left">GAME</th>
                    <th className="py-2 text-right pr-4">LENGTH</th>
                  </tr>
                </thead>
                <tbody>
                  {trackList[activeTrack].map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                        playingTrack && 
                        playingTrack.category === activeTrack && 
                        playingTrack.index === index ? 'bg-gray-800' : ''
                      }`}
                      onClick={() => playTrack(activeTrack, index)}
                    >
                      <td className="py-3 pl-4 flex items-center">
                        <span className="inline-block mr-3 text-xl">
                          {playingTrack && 
                           playingTrack.category === activeTrack && 
                           playingTrack.index === index 
                            ? (isPlaying ? '⏸️' : '▶️') 
                            : '▶️'}
                        </span>
                        {item.name}
                      </td>
                      <td className="py-3 text-gray-400">{item.game}</td>
                      <td className="py-3 text-right pr-4">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audio Visualizer */}
            <div className="mt-6 h-24 bg-black rounded-lg p-4 flex items-end justify-center space-x-1">
              {[...Array(32)].map((_, i) => (
                <div 
                  key={i} 
                  className={`visualizer-bar ${isPlaying && playingTrack && playingTrack.category === activeTrack ? 'active-visualizer' : ''}`}
                  style={{ 
                    height: `${Math.floor(Math.random() * 100)}%`,
                    backgroundColor: musicTracks.find(t => t.id === activeTrack)?.color,
                    width: '8px',
                    animationDelay: `${i * 0.05}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Music Players Section */}
        <div className="border-4 border-[#00FFFF] p-6 rounded-lg mb-12">
          <h3 className="text-2xl text-center text-[#00FFFF] mb-6">MUSIC PLAYERS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <div className="w-24 h-24 mx-auto mb-4 pixel-art pixel-walkman"></div>
              <h4 className="text-[#00FF00] font-bold mb-2">PORTABLE CASSETTE</h4>
              <p className="text-sm text-gray-400">The original mobile music experience of the 80s</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <div className="w-24 h-24 mx-auto mb-4 pixel-art pixel-gameboy"></div>
              <h4 className="text-[#FFFF00] font-bold mb-2">HANDHELD CONSOLE</h4>
              <p className="text-sm text-gray-400">Gaming on the go with iconic chiptune sound</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <div className="w-24 h-24 mx-auto mb-4 pixel-art pixel-boombox"></div>
              <h4 className="text-[#FF00FF] font-bold mb-2">BOOM BOX</h4>
              <p className="text-sm text-gray-400">Share your tunes with friends in style</p>
            </div>
          </div>
        </div>

        {/* Sound Wave Effect */}
        <div className="sound-wave mb-12 h-12 flex items-center justify-center">
          <div className="wave-container">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`wave-bar ${isPlaying ? 'active-wave' : ''}`}></div>
            ))}
          </div>
        </div>

        {/* CSS for animations and pixel art */}
        <style jsx>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes visualize {
            0%, 100% { height: 15%; }
            50% { height: 90%; }
          }

          @keyframes activeVisualize {
            0% { height: 5%; }
            50% { height: 100%; }
            100% { height: 10%; }
          }
          
          @keyframes wave {
            0%, 100% { height: 5px; }
            50% { height: 20px; }
          }

          @keyframes activeWave {
            0% { height: 3px; }
            50% { height: 30px; }
            100% { height: 5px; }
          }
          
          .blink-slow {
            animation: blink 2s ease-in-out infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .visualizer-bar {
            animation: visualize 1.3s ease-in-out infinite;
          }

          .active-visualizer {
            animation: activeVisualize 0.8s ease-in-out infinite;
          }
          
          .wave-container {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 3px;
          }
          
          .wave-bar {
            width: 3px;
            background: linear-gradient(to bottom, #00FF00, #00FFFF);
            height: 15px;
            border-radius: 2px;
            animation: wave 1s ease-in-out infinite;
          }

          .active-wave {
            animation: activeWave 0.5s ease-in-out infinite;
          }
          
          .wave-bar:nth-child(odd) {
            animation-delay: 0.5s;
          }
          
          .pixel-art {
            image-rendering: pixelated;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #000;
          }
          
          .pixel-walkman {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALklEQVRYhe3OoREAIBDEwPv33xkDCg2dSWbV7APge5K0SdLj7mY2g0AQCAJBIPxHcAFjZgRjZ+EXpQAAAABJRU5ErkJggg==');
          }
          
          .pixel-gameboy {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALklEQVRYhe3OQQEAIAgEwWv/nlHQnEHYqS77APge6a7M7O5mNoNAEAgCQSD8R3AAO8MEY5YRuCYAAAAASUVORK5CYII=');
          }
          
          .pixel-boombox {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALklEQVRYhe3OQQEAIAgEwcO/ZxQ0Z9hgpyr7APgeSVpmZnc3sxkEgkAQCALhP4ILPkkEY+tNPHMAAAAASUVORK5CYII=');
          }

          .audio-player {
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default RetroMusic;