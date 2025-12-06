import React, { useState } from 'react';
import OptionsModal from './OptionsModal';
import RulesModal from './RulesModal';
import DifficultyModal from './DifficultyModal';
import PlayerSetupModal from './PlayerSetupModal';

const StartScreen = ({ onStartGame, soundEnabled, soundVolume, onToggleSound, onVolumeChange }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({ name: 'Player', avatar: 'red' });

  const handlePlayClick = () => {
    setShowPlayerSetup(true);
  };

  const handlePlayerSetupComplete = (name, avatar) => {
    setPlayerInfo({ name, avatar });
    setShowPlayerSetup(false);
    setShowDifficulty(true);
  };

  const handleSelectDifficulty = (difficulty) => {
    onStartGame(difficulty, playerInfo.name, playerInfo.avatar);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #2563eb, #1d4ed8, #1e3a8a)' }}
    >
      {/* Animated bubbles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small bubbles */}
        <div className="absolute w-3 h-3 bg-white/20 rounded-full animate-float" style={{left: '5%', top: '20%', animationDuration: '4s', animationDelay: '0s'}}></div>
        <div className="absolute w-2 h-2 bg-white/15 rounded-full animate-float" style={{left: '12%', top: '60%', animationDuration: '5s', animationDelay: '1s'}}></div>
        <div className="absolute w-4 h-4 bg-white/10 rounded-full animate-float" style={{left: '8%', top: '80%', animationDuration: '4.5s', animationDelay: '2s'}}></div>
        
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-float" style={{left: '20%', top: '15%', animationDuration: '5.5s', animationDelay: '0.5s'}}></div>
        <div className="absolute w-5 h-5 bg-white/10 rounded-full animate-float" style={{left: '25%', top: '45%', animationDuration: '4s', animationDelay: '1.5s'}}></div>
        <div className="absolute w-3 h-3 bg-white/15 rounded-full animate-float" style={{left: '18%', top: '75%', animationDuration: '6s', animationDelay: '3s'}}></div>
        
        <div className="absolute w-4 h-4 bg-white/15 rounded-full animate-float" style={{left: '35%', top: '10%', animationDuration: '5s', animationDelay: '2s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-float" style={{left: '40%', top: '35%', animationDuration: '4.5s', animationDelay: '0s'}}></div>
        <div className="absolute w-6 h-6 bg-white/10 rounded-full animate-float" style={{left: '32%', top: '85%', animationDuration: '5.5s', animationDelay: '1s'}}></div>
        
        <div className="absolute w-3 h-3 bg-white/15 rounded-full animate-float" style={{left: '55%', top: '25%', animationDuration: '6s', animationDelay: '2.5s'}}></div>
        <div className="absolute w-5 h-5 bg-white/10 rounded-full animate-float" style={{left: '50%', top: '55%', animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-float" style={{left: '58%', top: '90%', animationDuration: '5s', animationDelay: '0.5s'}}></div>
        
        <div className="absolute w-4 h-4 bg-white/10 rounded-full animate-float" style={{left: '70%', top: '12%', animationDuration: '5.5s', animationDelay: '3s'}}></div>
        <div className="absolute w-3 h-3 bg-white/20 rounded-full animate-float" style={{left: '75%', top: '40%', animationDuration: '4.5s', animationDelay: '0s'}}></div>
        <div className="absolute w-5 h-5 bg-white/15 rounded-full animate-float" style={{left: '68%', top: '70%', animationDuration: '6s', animationDelay: '2s'}}></div>
        
        <div className="absolute w-2 h-2 bg-white/15 rounded-full animate-float" style={{left: '85%', top: '30%', animationDuration: '5s', animationDelay: '1.5s'}}></div>
        <div className="absolute w-6 h-6 bg-white/10 rounded-full animate-float" style={{left: '90%', top: '50%', animationDuration: '4s', animationDelay: '2.5s'}}></div>
        <div className="absolute w-3 h-3 bg-white/20 rounded-full animate-float" style={{left: '88%', top: '78%', animationDuration: '5.5s', animationDelay: '0s'}}></div>
        
        {/* Extra scattered bubbles */}
        <div className="absolute w-2 h-2 bg-white/25 rounded-full animate-float" style={{left: '3%', top: '45%', animationDuration: '4.2s', animationDelay: '1.2s'}}></div>
        <div className="absolute w-4 h-4 bg-white/10 rounded-full animate-float" style={{left: '45%', top: '8%', animationDuration: '5.8s', animationDelay: '0.8s'}}></div>
        <div className="absolute w-3 h-3 bg-white/15 rounded-full animate-float" style={{left: '62%', top: '65%', animationDuration: '4.8s', animationDelay: '2.2s'}}></div>
        <div className="absolute w-5 h-5 bg-white/10 rounded-full animate-float" style={{left: '78%', top: '88%', animationDuration: '5.2s', animationDelay: '1.8s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-float" style={{left: '95%', top: '22%', animationDuration: '4.6s', animationDelay: '3.2s'}}></div>
        <div className="absolute w-4 h-4 bg-white/15 rounded-full animate-float" style={{left: '15%', top: '92%', animationDuration: '5.4s', animationDelay: '0.3s'}}></div>
      </div>

      {/* Goldfish mascot - static */}
      <div className="relative mb-4">
        <img 
          src={process.env.PUBLIC_URL + '/3272d5cd-5d22-41bd-b597-c37984107efa_removalai_preview.png'} 
          alt="Go Fish Goldfish" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 text-center drop-shadow-lg">
        React <span className="text-orange-400 drop-shadow-lg">Go Fish</span>
      </h1>
      <p className="text-white/80 text-lg md:text-xl mb-8 drop-shadow">The classic card game, reimagined</p>

      {/* Menu Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/50"
        >
          Play Game
        </button>

        {/* Rules/Tips Button */}
        <button
          onClick={() => setShowRules(true)}
          className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-full transition-all duration-300 transform hover:scale-105 border border-white/30"
        >
          How to Play
        </button>
      </div>

      {/* Credits */}
      <p className="absolute bottom-4 text-white/50 text-sm">
        Created by Muhammad Jibaly
      </p>

      {/* Modals */}
      <OptionsModal
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        soundEnabled={soundEnabled}
        soundVolume={soundVolume}
        onToggleSound={onToggleSound}
        onVolumeChange={onVolumeChange}
      />
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
      <DifficultyModal
        isOpen={showDifficulty}
        onClose={() => setShowDifficulty(false)}
        onSelectDifficulty={handleSelectDifficulty}
      />
      <PlayerSetupModal
        isOpen={showPlayerSetup}
        onClose={() => setShowPlayerSetup(false)}
        onComplete={handlePlayerSetupComplete}
      />
    </div>
  );
};

export default StartScreen;
