import React from 'react';

const DifficultyModal = ({ isOpen, onClose, onSelectDifficulty }) => {
  if (!isOpen) return null;

  const handleSelect = (difficulty) => {
    onSelectDifficulty(difficulty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Select Difficulty
        </h2>

        <div className="space-y-4">
          {/* Normal Difficulty */}
          <button
            onClick={() => handleSelect('normal')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">Normal</h3>
              <p className="text-green-100 text-sm">AI makes random choices. Good for beginners!</p>
            </div>
          </button>

          {/* Hard Difficulty */}
          <button
            onClick={() => handleSelect('hard')}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">Hard</h3>
              <p className="text-red-100 text-sm">AI remembers your cards and plays strategically!</p>
            </div>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DifficultyModal;
