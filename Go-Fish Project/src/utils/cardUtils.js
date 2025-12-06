// Card utility functions for Go Fish game

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Creates a standard 52-card deck
 * @returns {Array} Array of card objects with rank and suit
 */
export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit, id: `${rank}-${suit}` });
    }
  }
  return deck;
};

/**
 * Shuffles a deck using Fisher-Yates algorithm
 * @param {Array} deck - Array of cards to shuffle
 * @returns {Array} Shuffled deck
 */
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Deals cards to players
 * @param {Array} deck - Shuffled deck
 * @param {number} cardsPerPlayer - Number of cards to deal to each player
 * @returns {Object} Object containing playerHand, aiHand, and remaining deck
 */
export const dealCards = (deck, cardsPerPlayer = 7) => {
  const playerHand = deck.slice(0, cardsPerPlayer);
  const aiHand = deck.slice(cardsPerPlayer, cardsPerPlayer * 2);
  const remainingDeck = deck.slice(cardsPerPlayer * 2);
  return { playerHand, aiHand, deck: remainingDeck };
};

/**
 * Checks if a card is red (hearts or diamonds)
 * @param {Object} card - Card object
 * @returns {boolean} True if card is red
 */
export const isRedCard = (card) => {
  return card.suit === '♥' || card.suit === '♦';
};

/**
 * Gets the display name for a rank
 * @param {string} rank - Card rank
 * @returns {string} Display name (e.g., "Aces" for "A")
 */
export const getRankDisplayName = (rank) => {
  const names = {
    'A': 'Aces',
    '2': '2s',
    '3': '3s',
    '4': '4s',
    '5': '5s',
    '6': '6s',
    '7': '7s',
    '8': '8s',
    '9': '9s',
    '10': '10s',
    'J': 'Jacks',
    'Q': 'Queens',
    'K': 'Kings'
  };
  return names[rank] || rank;
};

export { SUITS, RANKS };
