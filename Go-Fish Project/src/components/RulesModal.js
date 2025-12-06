import React from 'react';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl border border-blue-500/30 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          📖 How to Play Go Fish
        </h2>

        {/* Rules Section */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-700/50 p-4 rounded-xl">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
              🎯 Objective
            </h3>
            <p className="text-blue-100 text-sm">
              Collect the most "books" (sets of 4 cards of the same rank) before all cards are gone.
            </p>
          </div>

          <div className="bg-blue-700/50 p-4 rounded-xl">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
              🎮 Gameplay
            </h3>
            <ul className="text-blue-100 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">1.</span>
                You and the AI each start with 7 cards
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">2.</span>
                On your turn, click a card to ask the AI for that rank
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">3.</span>
                If they have cards of that rank, you get ALL of them
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">4.</span>
                If not, you "Go Fish" and draw from the deck
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">5.</span>
                Then it's the AI's turn to ask you
              </li>
            </ul>
          </div>

          <div className="bg-blue-700/50 p-4 rounded-xl">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
              📚 Scoring Books
            </h3>
            <p className="text-blue-100 text-sm">
              When you collect all 4 cards of the same rank (like four Kings or four 7s), 
              that's a "book"! The cards are removed and you score a point.
            </p>
          </div>

          <div className="bg-blue-700/50 p-4 rounded-xl">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
              🏆 Winning
            </h3>
            <p className="text-blue-100 text-sm">
              The game ends when all 13 books are collected. The player with the most books wins!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default RulesModal;
