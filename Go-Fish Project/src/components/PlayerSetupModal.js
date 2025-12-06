import React, { useState } from 'react';

// Custom fish SVG component matching the game avatars
const FishIcon = ({ color, size = 48 }) => {
  const colors = {
    red: { body: '#ef4444', fin: '#dc2626', highlight: '#fca5a5' },
    blue: { body: '#3b82f6', fin: '#2563eb', highlight: '#93c5fd' },
    green: { body: '#22c55e', fin: '#16a34a', highlight: '#86efac' },
    yellow: { body: '#eab308', fin: '#ca8a04', highlight: '#fde047' }
  };
  const c = colors[color] || colors.red;
  
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="32" cy="32" rx="22" ry="16" fill={c.body} />
      {/* Highlight */}
      <ellipse cx="28" cy="26" rx="8" ry="5" fill={c.highlight} opacity="0.4" />
      {/* Tail */}
      <path d="M10 32 L-2 20 L-2 44 Z" fill={c.fin} />
      {/* Top fin */}
      <path d="M26 16 Q32 6 38 16" stroke={c.fin} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Eye white */}
      <circle cx="44" cy="28" r="6" fill="white" />
      {/* Eye pupil */}
      <circle cx="45" cy="27" r="3" fill="#1f2937" />
      {/* Eye shine */}
      <circle cx="46" cy="26" r="1" fill="white" />
      {/* Mouth */}
      <ellipse cx="52" cy="34" rx="3" ry="2" fill={c.fin} />
    </svg>
  );
};

// Goldfish avatar options
const AVATARS = [
  { id: 'red', label: 'Ruby' },
  { id: 'blue', label: 'Sapphire' },
  { id: 'green', label: 'Emerald' },
  { id: 'yellow', label: 'Gold' },
];

const PlayerSetupModal = ({ isOpen, onClose, onComplete }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!selectedAvatar) {
      setError('Please select an avatar');
      return;
    }
    onComplete(playerName.trim(), selectedAvatar.id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Welcome, Player!
        </h2>
        <p className="text-blue-200 text-center text-sm mb-6">
          Set up your profile before playing
        </p>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            placeholder="Enter your name..."
            maxLength={12}
            className="w-full px-4 py-3 bg-blue-950/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          />
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            Choose Your Fish
          </label>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  setError('');
                }}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  selectedAvatar?.id === avatar.id
                    ? 'ring-4 ring-orange-400 scale-110 bg-white/20'
                    : 'bg-blue-950/50 hover:bg-blue-900/50 border border-blue-500/30 hover:scale-105'
                }`}
              >
                <FishIcon color={avatar.id} size={40} />
                <span className={`text-xs font-medium mt-1 ${selectedAvatar?.id === avatar.id ? 'text-orange-300' : 'text-blue-200'}`}>
                  {avatar.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Continue
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-3 bg-transparent hover:bg-white/10 text-white/70 hover:text-white font-medium rounded-xl transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PlayerSetupModal;
