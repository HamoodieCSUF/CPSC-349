import React, { useState, useCallback } from 'react';
import { createDeck, shuffleDeck, dealCards, getRankDisplayName } from './utils/cardUtils';
import { 
  checkForBooks, 
  transferCards, 
  drawCard, 
  aiTurnLogic, 
  isGameOver, 
  determineWinner,
  createLogMessage 
} from './utils/gameLogic';
import soundManager from './utils/soundManager';

import StartScreen from './components/StartScreen';
import Hand from './components/Hand';
import Deck from './components/Deck';
import MessageLog from './components/MessageLog';
import GameOver from './components/GameOver';
import PauseMenu from './components/PauseMenu';

import './App.css';

// Fish avatar SVG component
const FishAvatar = ({ color, size = 32 }) => {
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

// AI avatar (robot fish)
const AIAvatar = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="20" ry="14" fill="#6b7280" />
    <path d="M12 32 L2 22 L2 42 Z" fill="#4b5563" />
    <rect x="24" y="26" width="8" height="6" rx="1" fill="#ef4444" />
    <rect x="36" y="26" width="8" height="6" rx="1" fill="#ef4444" />
    <circle cx="28" cy="29" r="2" fill="#fff" className="animate-pulse" />
    <circle cx="40" cy="29" r="2" fill="#fff" className="animate-pulse" />
    <path d="M26 38 L42 38" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
    <rect x="28" y="18" width="8" height="4" rx="2" fill="#4b5563" />
    <circle cx="32" cy="16" r="2" fill="#22c55e" />
  </svg>
);

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [playerBooks, setPlayerBooks] = useState([]);
  const [aiBooks, setAiBooks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiFailedAsks, setAiFailedAsks] = useState([]);
  const [difficulty, setDifficulty] = useState('normal');
  
  // Player customization state
  const [playerName, setPlayerName] = useState('Player');
  const [playerAvatar, setPlayerAvatar] = useState('red');
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [isPaused, setIsPaused] = useState(false);
  
  // Animation state
  const [askPopup, setAskPopup] = useState(null); // { player: 'You'/'AI', rank: 'A', response: 'success'/'gofish'/null }
  const [bookAnimation, setBookAnimation] = useState(null); // { player: 'You'/'AI', rank: 'A' }
  
  // AI memory for hard mode (remembers what player has asked for)
  const [aiMemory, setAiMemory] = useState([]);

  // Sound handlers
  const handleToggleSound = useCallback(() => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
    if (newState) soundManager.playClick();
  }, []);

  const handleVolumeChange = useCallback((volume) => {
    setSoundVolume(volume);
    soundManager.setVolume(volume);
    soundManager.playClick();
  }, []);

  // Add a message to the log
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Check and handle books for a player
  // eslint-disable-next-line no-unused-vars
  const handleBooks = useCallback((hand, setHand, books, setBooks, playerName) => {
    const { books: newBooks, updatedHand } = checkForBooks(hand);
    
    if (newBooks.length > 0) {
      setHand(updatedHand);
      setBooks([...books, ...newBooks]);
      newBooks.forEach(rank => {
        addMessage(`📚 ${playerName} completed a book of ${getRankDisplayName(rank)}!`);
      });
      return { hand: updatedHand, books: [...books, ...newBooks] };
    }
    return { hand, books };
  }, [addMessage]);

  // Initialize the game
  const initializeGame = useCallback((selectedDifficulty = 'normal', pName = 'Player', pAvatar = 'red') => {
    const newDeck = shuffleDeck(createDeck());
    const { playerHand: pHand, aiHand: aHand, deck: remainingDeck } = dealCards(newDeck, 7);
    
    setDeck(remainingDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setPlayerBooks([]);
    setAiBooks([]);
    setDifficulty(selectedDifficulty);
    setPlayerName(pName);
    setPlayerAvatar(pAvatar);
    setAiMemory([]);
    const diffText = selectedDifficulty === 'hard' ? 'Hard Mode!' : 'Normal Mode';
    setMessages([`Welcome ${pName}! ${diffText}`, 'Click a card in your hand to ask the AI for that rank.']);
    setIsPlayerTurn(true);
    setGameOver(false);
    setGameStarted(true);
    setSelectedRank(null);
    setIsProcessing(false);
    setAiFailedAsks([]);
    setIsPaused(false);
    
    // Play shuffle sound
    soundManager.playShuffle();
  }, []);

  // Check if game should end
  const checkGameEnd = useCallback((currentDeck, pHand, aHand, pBooks, aBooks) => {
    if (isGameOver(currentDeck, pHand, aHand)) {
      setGameOver(true);
      addMessage('🏁 Game Over!');
      soundManager.playGameOver();
      return true;
    }
    return false;
  }, [addMessage]);

  // Handle drawing a card when needed
  // eslint-disable-next-line no-unused-vars
  const handleDrawIfEmpty = useCallback((hand, setHand, currentDeck, playerName) => {
    if (hand.length === 0 && currentDeck.length > 0) {
      const { deck: newDeck, hand: newHand, drawnCard } = drawCard(currentDeck, hand);
      if (drawnCard) {
        setHand(newHand);
        setDeck(newDeck);
        soundManager.playCardDraw();
        return { hand: newHand, deck: newDeck };
      }
    }
    return { hand, deck: currentDeck };
  }, []);

  // Player turn handler
  const handlePlayerTurn = useCallback((rank) => {
    if (!isPlayerTurn || isProcessing || gameOver) return;
    
    setIsProcessing(true);
    setSelectedRank(rank);
    soundManager.playCardSelect();
    
    // Show ask popup animation (no auto-dismiss)
    setAskPopup({ player: 'You', rank: getRankDisplayName(rank), response: null });
    
    // In hard mode, AI remembers what player asked for
    if (difficulty === 'hard') {
      setAiMemory(prev => [...prev, rank]);
    }

    // Check if AI has the requested rank
    const aiHasRank = aiHand.some(card => card.rank === rank);
    
    let newPlayerHand = [...playerHand];
    let newAiHand = [...aiHand];
    let newDeck = [...deck];
    let newPlayerBooks = [...playerBooks];

    // Short delay before showing response
    setTimeout(() => {
      if (aiHasRank) {
        // Update popup with success response
        setAskPopup({ player: 'You', rank: getRankDisplayName(rank), response: 'success' });
        
        // Transfer cards from AI to player
        const result = transferCards(rank, aiHand, playerHand);
        newPlayerHand = result.toHand;
        newAiHand = result.fromHand;
        addMessage(createLogMessage('You', rank, true, result.transferCount));
        soundManager.playSuccess();
      } else {
        // Update popup with go fish response
        setAskPopup({ player: 'You', rank: getRankDisplayName(rank), response: 'gofish' });
        
        // Go Fish!
        addMessage(createLogMessage('You', rank, false));
        soundManager.playGoFish();
        
        if (deck.length > 0) {
          const drawResult = drawCard(deck, playerHand);
          newPlayerHand = drawResult.hand;
          newDeck = drawResult.deck;
          
          if (drawResult.drawnCard) {
            soundManager.playCardDraw();
          }
        }
      }

      // Update state
      setPlayerHand(newPlayerHand);
      setAiHand(newAiHand);
      setDeck(newDeck);

      // Check for books
      const bookResult = checkForBooks(newPlayerHand);
      if (bookResult.books.length > 0) {
        newPlayerHand = bookResult.updatedHand;
        newPlayerBooks = [...playerBooks, ...bookResult.books];
        setPlayerHand(newPlayerHand);
        setPlayerBooks(newPlayerBooks);
        bookResult.books.forEach(bookRank => {
          addMessage(`📚 You completed a book of ${getRankDisplayName(bookRank)}!`);
          // Show book animation
          setBookAnimation({ player: 'You', rank: getRankDisplayName(bookRank) });
          setTimeout(() => setBookAnimation(null), 2000);
        });
        soundManager.playBook();
      }

      // Handle empty hand
      if (newPlayerHand.length === 0 && newDeck.length > 0) {
        const drawResult = drawCard(newDeck, newPlayerHand);
        newPlayerHand = drawResult.hand;
        newDeck = drawResult.deck;
        setPlayerHand(newPlayerHand);
        setDeck(newDeck);
        soundManager.playCardDraw();
      }

      // Check for game end
      if (checkGameEnd(newDeck, newPlayerHand, newAiHand, newPlayerBooks, aiBooks)) {
        setIsProcessing(false);
        setSelectedRank(null);
        setAskPopup(null);
        return;
      }

      // AI turn - dismiss popup and switch turns
      setTimeout(() => {
        setAskPopup(null);
        setSelectedRank(null);
        setIsPlayerTurn(false);
        handleAiTurn(newPlayerHand, newAiHand, newDeck, newPlayerBooks, aiBooks, aiFailedAsks);
      }, 1500);
      
    }, 800); // Delay before showing response

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, isProcessing, gameOver, playerHand, aiHand, deck, playerBooks, aiBooks, addMessage, checkGameEnd, difficulty]);

  // AI turn handler
  const handleAiTurn = useCallback((currentPlayerHand, currentAiHand, currentDeck, currentPlayerBooks, currentAiBooks, currentFailedAsks = []) => {
    let newPlayerHand = [...currentPlayerHand];
    let newAiHand = [...currentAiHand];
    let newDeck = [...currentDeck];
    let newAiBooks = [...currentAiBooks];
    let newFailedAsks = [...currentFailedAsks];

    // Handle empty AI hand
    if (newAiHand.length === 0 && newDeck.length > 0) {
      const drawResult = drawCard(newDeck, newAiHand);
      newAiHand = drawResult.hand;
      newDeck = drawResult.deck;
      setAiHand(newAiHand);
      setDeck(newDeck);
      soundManager.playCardDraw();
    }

    // AI decides which rank to ask for
    // In hard mode, AI uses memory of what player asked for
    let rankToAsk;
    if (difficulty === 'hard' && aiMemory.length > 0) {
      // Check if AI has any ranks that player previously asked for
      // But exclude ranks we already failed to get recently
      const playerWantedRanks = aiMemory.filter(r => 
        newAiHand.some(card => card.rank === r) && !newFailedAsks.includes(r)
      );
      if (playerWantedRanks.length > 0) {
        // Ask for a rank the player wanted (they might still have some)
        rankToAsk = playerWantedRanks[Math.floor(Math.random() * playerWantedRanks.length)];
      } else {
        rankToAsk = aiTurnLogic(newAiHand, newFailedAsks);
      }
    } else {
      rankToAsk = aiTurnLogic(newAiHand, newFailedAsks);
    }
    
    if (!rankToAsk) {
      // AI has no cards, check for game end
      if (checkGameEnd(newDeck, newPlayerHand, newAiHand, currentPlayerBooks, newAiBooks)) {
        setIsProcessing(false);
        return;
      }
      setIsPlayerTurn(true);
      setIsProcessing(false);
      return;
    }

    setTimeout(() => {
      // Check if player has the requested rank
      const playerHasRank = newPlayerHand.some(card => card.rank === rankToAsk);

      // Popup shows the ask - no need to log it
      soundManager.playCardSelect();
      
      // Show ask popup animation (no response yet)
      setAskPopup({ player: 'AI', rank: getRankDisplayName(rankToAsk), response: null });

      // Delay for dramatic effect before revealing result
      setTimeout(() => {
        if (playerHasRank) {
          // Update popup with success
          setAskPopup({ player: 'AI', rank: getRankDisplayName(rankToAsk), response: 'success' });
          
          // Transfer cards from player to AI
          const result = transferCards(rankToAsk, newPlayerHand, newAiHand);
          newPlayerHand = result.fromHand;
          newAiHand = result.toHand;
          addMessage(createLogMessage('AI', rankToAsk, true, result.transferCount));
          soundManager.playSuccess();
          // Clear failed asks on successful request
          newFailedAsks = [];
        } else {
          // Update popup with go fish
          setAskPopup({ player: 'AI', rank: getRankDisplayName(rankToAsk), response: 'gofish' });
          
          // Go Fish! Track this failed ask
          addMessage(createLogMessage('AI', rankToAsk, false));
          soundManager.playGoFish();
          newFailedAsks = [...newFailedAsks, rankToAsk].slice(-5); // Keep last 5 failed asks
          
          if (newDeck.length > 0) {
            const drawResult = drawCard(newDeck, newAiHand);
            newAiHand = drawResult.hand;
            newDeck = drawResult.deck;
            soundManager.playCardDraw();
          }
        }

        // Update state including failed asks
        setPlayerHand(newPlayerHand);
        setAiHand(newAiHand);
        setDeck(newDeck);
        setAiFailedAsks(newFailedAsks);

        // Check for AI books
        const bookResult = checkForBooks(newAiHand);
        if (bookResult.books.length > 0) {
          newAiHand = bookResult.updatedHand;
          newAiBooks = [...currentAiBooks, ...bookResult.books];
          setAiHand(newAiHand);
          setAiBooks(newAiBooks);
          bookResult.books.forEach(bookRank => {
            addMessage(`📚 AI completed a book of ${getRankDisplayName(bookRank)}!`);
            // Show book animation
            setBookAnimation({ player: 'AI', rank: getRankDisplayName(bookRank) });
            setTimeout(() => setBookAnimation(null), 2000);
          });
          soundManager.playBook();
        }

        // Handle empty AI hand
        if (newAiHand.length === 0 && newDeck.length > 0) {
          const drawResult = drawCard(newDeck, newAiHand);
          newAiHand = drawResult.hand;
          newDeck = drawResult.deck;
          setAiHand(newAiHand);
          setDeck(newDeck);
          soundManager.playCardDraw();
        }

        // Check for game end
        if (checkGameEnd(newDeck, newPlayerHand, newAiHand, currentPlayerBooks, newAiBooks)) {
          setIsProcessing(false);
          setAskPopup(null);
          return;
        }

        // Back to player's turn - dismiss popup when turn starts
        setTimeout(() => {
          setAskPopup(null);
          setIsPlayerTurn(true);
          setIsProcessing(false);
        }, 1500);

      }, 1000); // Delay before showing result

    }, 1200); // AI thinking time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMessage, checkGameEnd, difficulty, aiMemory]);

  // Handle play again
  const handlePlayAgain = () => {
    initializeGame(difficulty);
  };

  // Handle pause
  const handlePause = () => {
    setIsPaused(true);
  };

  // Handle resume
  const handleResume = () => {
    setIsPaused(false);
  };

  // Handle return to main menu
  const handleMainMenu = () => {
    setIsPaused(false);
    setGameStarted(false);
    setGameOver(false);
  };

  // Render start screen if game hasn't started
  if (!gameStarted) {
    return (
      <StartScreen 
        onStartGame={initializeGame}
        soundEnabled={soundEnabled}
        soundVolume={soundVolume}
        onToggleSound={handleToggleSound}
        onVolumeChange={handleVolumeChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 p-4 flex flex-col">
      {/* Header */}
      <header className="text-center mb-4 relative flex-shrink-0">
        {/* Settings Button */}
        <button
          onClick={handlePause}
          className="absolute right-0 top-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 border border-white/20 hover:rotate-90"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          React Go Fish
          <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded-full">
            {difficulty === 'hard' ? 'Hard' : 'Normal'}
          </span>
        </h1>
      </header>

      {/* Turn indicator - moved below header */}
      <div className="text-center mb-4 flex-shrink-0">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${
          isPlayerTurn 
            ? 'bg-green-500 text-white' 
            : 'bg-orange-500 text-white animate-pulse'
        }`}>
          {isPlayerTurn ? (
            <>
              <FishAvatar color={playerAvatar} size={24} />
              <span>{playerName}'s Turn - Click a card!</span>
            </>
          ) : (
            <>
              <AIAvatar size={24} />
              <span>AI is playing...</span>
            </>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex items-center justify-center">
        {/* Left Sidebar - Game Log (Fixed position) */}
        <div className="hidden lg:block fixed left-4 top-32 bottom-4 w-72">
          <MessageLog messages={messages} />
        </div>

        {/* Center - Game Board */}
        <div className="flex flex-col items-center space-y-4 max-w-3xl w-full">
          {/* AI Profile - Above cards */}
          <div className="flex flex-col items-center">
            <AIAvatar size={64} />
            <span className="text-white font-semibold text-lg mt-1">AI</span>
            <span className="text-white/70 text-sm">({aiHand.length} cards)</span>
          </div>

          {/* AI Hand */}
          <div className={`w-full p-4 rounded-xl transition-all duration-500 ${!isPlayerTurn ? 'bg-green-500/20 ring-2 ring-green-400' : 'bg-orange-500/10 ring-2 ring-orange-400/50'}`}>
            <div className="flex justify-center">
              <Hand cards={aiHand} isPlayer={false} books={aiBooks} />
            </div>
          </div>

          {/* Center - Deck */}
          <div className="py-4">
            <Deck cardsRemaining={deck.length} />
          </div>

          {/* Player Hand */}
          <div className={`w-full p-4 rounded-xl transition-all duration-500 ${isPlayerTurn ? 'bg-green-500/20 ring-2 ring-green-400' : 'bg-orange-500/10 ring-2 ring-orange-400/50'}`}>
            <div className="flex justify-center">
              <Hand 
                cards={playerHand} 
                isPlayer={true} 
                onCardClick={handlePlayerTurn}
                disabled={!isPlayerTurn || isProcessing}
                selectedRank={selectedRank}
                books={playerBooks}
              />
            </div>
          </div>

          {/* Player Profile - Below cards */}
          <div className="flex flex-col items-center">
            <FishAvatar color={playerAvatar} size={64} />
            <span className="text-white font-semibold text-lg mt-1">{playerName}</span>
            <span className="text-white/70 text-sm">({playerHand.length} cards)</span>
          </div>
        </div>
      </div>

      {/* Mobile: Show Log below */}
      <div className="lg:hidden max-w-2xl mx-auto mt-4">
        <MessageLog messages={messages} />
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOver
          playerBooks={playerBooks}
          aiBooks={aiBooks}
          winner={determineWinner(playerBooks, aiBooks)}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Ask Popup Animation */}
      {askPopup && (
        <div className={`fixed inset-x-0 flex justify-center pointer-events-none z-40 ${
          askPopup.player === 'AI' ? 'top-40' : 'bottom-52'
        }`}>
          <div className={`backdrop-blur-sm text-gray-800 px-8 py-6 rounded-2xl shadow-2xl animate-bounce-in border-4 ${
            askPopup.response === 'success' ? 'bg-green-100 border-green-400' :
            askPopup.response === 'gofish' ? 'bg-red-100 border-red-400' :
            'bg-white/95 border-blue-400'
          }`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 mb-1">
                {askPopup.player === 'You' ? (
                  <>
                    <FishAvatar color={playerAvatar} size={20} />
                    <span>{playerName} asks:</span>
                  </>
                ) : (
                  <>
                    <AIAvatar size={20} />
                    <span>AI asks:</span>
                  </>
                )}
              </div>
              <div className="text-2xl font-bold">
                "Do you have any {askPopup.rank}?"
              </div>
              {askPopup.response && (
                <div className={`mt-3 text-xl font-bold ${
                  askPopup.response === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {askPopup.response === 'success' ? '✅ Yes! Hand them over!' : '🐟 Go Fish!'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book Collection Animation */}
      {bookAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-white px-10 py-8 rounded-2xl shadow-2xl animate-book-collect border-4 border-yellow-300">
            <div className="text-center">
              <div className="text-4xl mb-2">📚✨</div>
              <div className="text-xl font-bold">
                {bookAnimation.player} collected a book!
              </div>
              <div className="text-3xl font-extrabold mt-2">
                Four {bookAnimation.rank}!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pause Menu */}
      <PauseMenu
        isOpen={isPaused}
        onResume={handleResume}
        onMainMenu={handleMainMenu}
        soundEnabled={soundEnabled}
        soundVolume={soundVolume}
        onToggleSound={handleToggleSound}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}

export default App;
