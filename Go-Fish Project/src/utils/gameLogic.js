// Game logic functions for Go Fish

import { getRankDisplayName } from './cardUtils';

/**
 * Checks a hand for completed books (4 of a kind)
 * @param {Array} hand - Player's hand
 * @returns {Object} Object with books array and updated hand
 */
export const checkForBooks = (hand) => {
  const rankCount = {};
  const books = [];
  
  // Count cards by rank
  hand.forEach(card => {
    rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
  });
  
  // Find completed books
  Object.keys(rankCount).forEach(rank => {
    if (rankCount[rank] === 4) {
      books.push(rank);
    }
  });
  
  // Remove book cards from hand
  const updatedHand = hand.filter(card => !books.includes(card.rank));
  
  return { books, updatedHand };
};

/**
 * Transfers cards of a specific rank from one hand to another
 * @param {string} rank - Rank to transfer
 * @param {Array} fromHand - Source hand
 * @param {Array} toHand - Destination hand
 * @returns {Object} Updated hands and count of transferred cards
 */
export const transferCards = (rank, fromHand, toHand) => {
  const cardsToTransfer = fromHand.filter(card => card.rank === rank);
  const updatedFromHand = fromHand.filter(card => card.rank !== rank);
  const updatedToHand = [...toHand, ...cardsToTransfer];
  
  return {
    fromHand: updatedFromHand,
    toHand: updatedToHand,
    transferCount: cardsToTransfer.length
  };
};

/**
 * Draws a card from the deck
 * @param {Array} deck - Current deck
 * @param {Array} hand - Player's hand
 * @returns {Object} Updated deck, hand, and drawn card
 */
export const drawCard = (deck, hand) => {
  if (deck.length === 0) {
    return { deck, hand, drawnCard: null };
  }
  
  const drawnCard = deck[0];
  const updatedDeck = deck.slice(1);
  const updatedHand = [...hand, drawnCard];
  
  return {
    deck: updatedDeck,
    hand: updatedHand,
    drawnCard
  };
};

/**
 * AI logic to decide which rank to ask for
 * Uses memory of failed asks to avoid repeating unsuccessful requests
 * @param {Array} aiHand - AI's current hand
 * @param {Array} failedAsks - Array of recently failed rank requests
 * @returns {string|null} Rank to ask for, or null if hand is empty
 */
export const aiTurnLogic = (aiHand, failedAsks = []) => {
  if (aiHand.length === 0) return null;
  
  // Count cards by rank
  const rankCount = {};
  aiHand.forEach(card => {
    rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
  });
  
  // Get all available ranks, excluding recently failed ones
  const availableRanks = Object.keys(rankCount).filter(
    rank => !failedAsks.includes(rank)
  );
  
  // If all ranks have been tried recently, reset and use all ranks
  const ranksToConsider = availableRanks.length > 0 ? availableRanks : Object.keys(rankCount);
  
  // Strategy 1: Prefer ranks with 3 cards (one away from book)
  const almostBooks = ranksToConsider.filter(rank => rankCount[rank] === 3);
  if (almostBooks.length > 0) {
    return almostBooks[Math.floor(Math.random() * almostBooks.length)];
  }
  
  // Strategy 2: Prefer ranks with 2 cards
  const pairs = ranksToConsider.filter(rank => rankCount[rank] === 2);
  if (pairs.length > 0) {
    return pairs[Math.floor(Math.random() * pairs.length)];
  }
  
  // Strategy 3: Random from remaining single cards
  const singles = ranksToConsider.filter(rank => rankCount[rank] === 1);
  if (singles.length > 0) {
    return singles[Math.floor(Math.random() * singles.length)];
  }
  
  // Fallback: any rank from hand
  const allRanks = Object.keys(rankCount);
  return allRanks[Math.floor(Math.random() * allRanks.length)];
};

/**
 * Checks if the game is over
 * @param {Array} deck - Current deck
 * @param {Array} playerHand - Player's hand
 * @param {Array} aiHand - AI's hand
 * @returns {boolean} True if game is over
 */
export const isGameOver = (deck, playerHand, aiHand) => {
  return deck.length === 0 && playerHand.length === 0 && aiHand.length === 0;
};

/**
 * Determines the winner
 * @param {Array} playerBooks - Player's completed books
 * @param {Array} aiBooks - AI's completed books
 * @returns {string} Winner message
 */
export const determineWinner = (playerBooks, aiBooks) => {
  if (playerBooks.length > aiBooks.length) {
    return 'You Win! 🎉';
  } else if (aiBooks.length > playerBooks.length) {
    return 'AI Wins! 🤖';
  } else {
    return "It's a Tie! 🤝";
  }
};

/**
 * Gets unique ranks from a hand
 * @param {Array} hand - Player's hand
 * @returns {Array} Array of unique ranks
 */
export const getUniqueRanks = (hand) => {
  return [...new Set(hand.map(card => card.rank))];
};

/**
 * Creates a game log message
 * @param {string} actor - Who performed the action
 * @param {string} rank - Card rank involved
 * @param {boolean} success - Whether the ask was successful
 * @param {number} count - Number of cards received
 * @returns {string} Log message
 */
export const createLogMessage = (actor, rank, success, count = 0) => {
  const rankName = getRankDisplayName(rank);
  
  if (success) {
    return `${actor} asked for ${rankName} and got ${count} card${count > 1 ? 's' : ''}!`;
  } else {
    return `${actor} asked for ${rankName}. Go Fish!`;
  }
};
