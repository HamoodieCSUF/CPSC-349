import React from 'react';
import { getRankDisplayName } from '../utils/cardUtils';

const Scoreboard = ({ playerBooks, aiBooks }) => {
  const renderBooks = (books, label) => (
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">{label}</h4>
      <div className="text-3xl font-bold text-white mb-2">{books.length}</div>
      <div className="flex flex-wrap gap-1 justify-center">
        {books.map((rank, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full"
            title={`Four ${getRankDisplayName(rank)}`}
          >
            {rank}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-xl p-4 shadow-lg">
      <h3 className="text-white text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
        📊 Scoreboard
      </h3>
      
      <div className="flex divide-x divide-gray-600">
        {renderBooks(playerBooks, '👤 You')}
        {renderBooks(aiBooks, '🤖 AI')}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-600">
        <div className="text-gray-400 text-xs text-center">
          Collect 4 of a kind to score a book!
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
