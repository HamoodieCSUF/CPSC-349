import React from 'react';
import Card from './Card';

const Hand = ({ cards, isPlayer = true, onCardClick, disabled = false, selectedRank = null, books = [] }) => {
  // Group cards by rank for player display
  const groupedCards = cards.reduce((acc, card) => {
    if (!acc[card.rank]) {
      acc[card.rank] = [];
    }
    acc[card.rank].push(card);
    return acc;
  }, {});

  const handleCardClick = (card) => {
    if (isPlayer && onCardClick) {
      onCardClick(card.rank);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Cards */}
      <div className="flex flex-wrap gap-2 justify-center">
        {isPlayer ? (
          // Show grouped cards for player (easier to select ranks)
          Object.entries(groupedCards).map(([rank, rankCards]) => (
            <div 
              key={rank} 
              className={`flex -space-x-8 md:-space-x-10 transition-transform duration-200 ${!disabled ? 'hover:scale-105 hover:-translate-y-1 cursor-pointer' : ''}`}
              onClick={() => !disabled && handleCardClick(rankCards[0])}
            >
              {rankCards.map((card, index) => (
                <div key={card.id} style={{ zIndex: index }} className="pointer-events-none">
                  <Card
                    card={card}
                    disabled={disabled}
                    selected={selectedRank === card.rank}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          // Show face-down cards for AI - stacked
          <div className="flex -space-x-12 md:-space-x-14">
            {cards.map((card, index) => (
              <div 
                key={card.id} 
                style={{ zIndex: index }}
              >
                <Card card={card} faceDown />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Books counter */}
      {books.length > 0 && (
        <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg border border-yellow-500/50">
          <span className="text-2xl">📚</span>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-xl">{books.length}</div>
            <div className="text-yellow-300/70 text-xs">Books</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hand;
