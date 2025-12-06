import React from 'react';
import { isRedCard } from '../utils/cardUtils';

const Card = ({ card, faceDown = false, onClick, disabled = false, selected = false, animated = false }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(card);
    }
  };

  if (faceDown) {
    return (
      <div className={`w-16 h-24 md:w-20 md:h-28 rounded-lg shadow-lg border-2 border-white/30 flex items-center justify-center cursor-default transition-all duration-300 overflow-hidden ${animated ? 'animate-pulse' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)'
        }}
      >
        {/* Card back pattern */}
        <div className="w-12 h-20 md:w-14 md:h-22 rounded border-2 border-white/20 flex items-center justify-center"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 6px)'
          }}
        >
          <div className="w-8 h-12 md:w-10 md:h-14 rounded bg-gradient-to-br from-red-700 to-red-900 border border-yellow-500/50 flex items-center justify-center">
            <span className="text-yellow-400 text-lg md:text-xl font-bold">♠♥</span>
          </div>
        </div>
      </div>
    );
  }

  const isRed = isRedCard(card);
  const textColor = isRed ? 'text-red-600' : 'text-gray-900';

  return (
    <div
      onClick={handleClick}
      className={`
        w-16 h-24 md:w-20 md:h-28 bg-white rounded-lg shadow-lg border-2 
        flex flex-col items-center justify-between p-1 md:p-2
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 hover:-translate-y-2 hover:shadow-xl'}
        ${selected ? 'ring-4 ring-yellow-400 scale-105 -translate-y-2' : 'border-gray-300'}
        ${animated ? 'animate-bounce' : ''}
      `}
    >
      <div className={`text-sm md:text-base font-bold ${textColor} self-start`}>
        {card.rank}
      </div>
      <div className={`text-2xl md:text-3xl ${textColor}`}>
        {card.suit}
      </div>
      <div className={`text-sm md:text-base font-bold ${textColor} self-end rotate-180`}>
        {card.rank}
      </div>
    </div>
  );
};

export default Card;
