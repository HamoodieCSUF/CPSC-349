import React, { useEffect } from 'react';
import soundManager from '../utils/soundManager';

const GameOver = ({ playerBooks, aiBooks, winner, onPlayAgain, onMainMenu }) => {
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
              <div className="text-4xl mb-2">👤</div>
              <div className="text-white text-sm mb-1">You</div>
              <div className={`text-3xl font-bold ${playerWon ? 'text-yellow-400' : 'text-white'}`}>
                {playerBooks.length}
              </div>
              <div className="text-gray-400 text-xs">books</div>
            </div>
            
            <div className="text-4xl text-gray-500 self-center">vs</div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
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
