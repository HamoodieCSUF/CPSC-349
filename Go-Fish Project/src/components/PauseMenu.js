import React from 'react';

const PauseMenu = ({ 
  isOpen, 
  onResume, 
  onMainMenu, 
  soundEnabled, 
  soundVolume,
  onToggleSound, 
  onVolumeChange 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Game Paused
        </h2>

        <div className="space-y-4">
          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between bg-blue-700/50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{soundEnabled ? '🔊' : '🔇'}</span>
              <span className="text-white font-medium">Sound Effects</span>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-14 h-8 rounded-full transition-all duration-300 ${
                soundEnabled ? 'bg-orange-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          {soundEnabled && (
            <div className="bg-blue-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Volume</span>
                <span className="text-white/70 text-sm">{Math.round(soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume * 100}
                onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${soundVolume * 100}%, #4b5563 ${soundVolume * 100}%, #4b5563 100%)`
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Resume Game
          </button>
          
          <button
            onClick={onMainMenu}
            className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
