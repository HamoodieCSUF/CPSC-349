import React, { useEffect } from 'react';
import soundManager from '../utils/soundManager';

// Fish avatar SVG component
const FishAvatar = ({ color, size = 48 }) => {
  const colors = {
    red: { body: '#ef4444', fin: '#dc2626', highlight: '#fca5a5' },
    blue: { body: '#3b82f6', fin: '#2563eb', highlight: '#93c5fd' },
    green: { body: '#22c55e', fin: '#16a34a', highlight: '#86efac' },
    yellow: { body: '#eab308', fin: '#ca8a04', highlight: '#fde047' }
  };
  const c = colors[color] || colors.red;
  
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="32" rx="22" ry="16" fill={c.body} />
      <ellipse cx="28" cy="26" rx="8" ry="5" fill={c.highlight} opacity="0.4" />
      <path d="M10 32 L-2 20 L-2 44 Z" fill={c.fin} />
      <path d="M26 16 Q32 6 38 16" stroke={c.fin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="28" r="6" fill="white" />
      <circle cx="45" cy="27" r="3" fill="#1f2937" />
      <circle cx="46" cy="26" r="1" fill="white" />
      <ellipse cx="52" cy="34" rx="3" ry="2" fill={c.fin} />
    </svg>
  );
};

// AI avatar (robot fish)
const AIAvatar = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="22" ry="16" fill="#6b7280" />
    <path d="M10 32 L-2 20 L-2 44 Z" fill="#4b5563" />
    <rect x="24" y="26" width="8" height="6" rx="1" fill="#ef4444" />
    <rect x="36" y="26" width="8" height="6" rx="1" fill="#ef4444" />
    <circle cx="28" cy="29" r="2" fill="#fff" />
    <circle cx="40" cy="29" r="2" fill="#fff" />
    <path d="M26 38 L42 38" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
    <rect x="28" y="18" width="8" height="4" rx="2" fill="#4b5563" />
    <circle cx="32" cy="16" r="2" fill="#22c55e" />
  </svg>
);

const GameOver = ({ playerBooks, aiBooks, winner, onPlayAgain, onMainMenu, playerName, playerAvatar }) => {
  const playerWon = playerBooks.length > aiBooks.length;
  const isTie = playerBooks.length === aiBooks.length;

  useEffect(() => {
    // Play appropriate sound
    if (playerWon) {
      soundManager.playWin();
    } else if (!isTie) {
      soundManager.playLose();
    }
  }, [playerWon, isTie]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        {/* Trophy/Result Icon */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {playerWon ? '🏆' : isTie ? '🤝' : '🤖'}
          </div>
          <h2 className={`text-3xl font-bold ${
            playerWon ? 'text-yellow-400' : isTie ? 'text-blue-400' : 'text-red-400'
          }`}>
            {winner}
          </h2>
        </div>

        {/* Final Scores */}
        <div className="bg-gray-700 rounded-xl p-4 mb-6">
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Final Score</h3>
          
          <div className="flex justify-around">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FishAvatar color={playerAvatar} size={48} />
              </div>
              <div className="text-white text-sm mb-1">{playerName || 'You'}</div>
              <div className={`text-3xl font-bold ${playerWon ? 'text-yellow-400' : 'text-white'}`}>
                {playerBooks.length}
              </div>
              <div className="text-gray-400 text-xs">books</div>
            </div>
            
            <div className="text-4xl text-gray-500 self-center">vs</div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <AIAvatar size={48} />
              </div>
              <div className="text-white text-sm mb-1">AI</div>
              <div className={`text-3xl font-bold ${!playerWon && !isTie ? 'text-yellow-400' : 'text-white'}`}>
                {aiBooks.length}
              </div>
              <div className="text-gray-400 text-xs">books</div>
            </div>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Play Again
        </button>

        {/* Return to Menu Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onMainMenu();
          }}
          className="w-full mt-3 py-3 bg-transparent hover:bg-white/10 text-white/70 hover:text-white font-medium rounded-xl transition-all duration-200 border border-white/20"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
};

export default GameOver;
