import React from 'react';

const CardBack = ({ className = '' }) => (
  <div className={`w-16 h-24 md:w-20 md:h-28 rounded-lg shadow-lg border-2 border-white/30 flex items-center justify-center overflow-hidden ${className}`}
    style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)'
    }}
  >
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

const Deck = ({ cardsRemaining }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-white text-lg font-semibold mb-3">Draw Pile</h3>
      
      <div className="relative">
        {/* Stacked card effect */}
        {cardsRemaining > 0 && (
          <>
            {cardsRemaining > 4 && (
              <div className="absolute top-2 left-1">
                <CardBack />
              </div>
            )}
            {cardsRemaining > 2 && (
              <div className="absolute top-1 left-0.5">
                <CardBack />
              </div>
            )}
            <div className="relative">
              <CardBack />
            </div>
          </>
        )}
        
        {cardsRemaining === 0 && (
          <div className="w-16 h-24 md:w-20 md:h-28 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-800 bg-opacity-50">
            <span className="text-gray-400 text-xs text-center">Empty</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 bg-gray-800 px-4 py-2 rounded-full">
        <span className="text-white font-bold">{cardsRemaining}</span>
        <span className="text-gray-300 text-sm ml-1">cards left</span>
      </div>
    </div>
  );
};

export default Deck;
