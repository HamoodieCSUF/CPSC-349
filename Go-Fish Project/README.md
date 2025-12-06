# React Go Fish 🐟

A web-based version of the classic card game Go Fish, built entirely using React. Players face off against a rule-based AI opponent, competing to collect as many "books" (sets of four matching ranks) as possible before the deck is depleted.

## Project Information

- **Project Name:** React Go Fish
- **Team Member:** Muhammad Jibaly

## Features

- 🎮 **Game Setup** – Initializes deck and deals cards to player and AI
- 🎴 **Player Turn** – Player selects a rank to request from the AI
- 🤖 **AI Turn** – The AI uses rule-based logic to decide its move
- 📊 **Scoring System** – Tracks completed "books" for both sides
- 🏆 **Game End Logic** – Announces the winner and allows replay
- ✨ **Interactive UI** – Displays game progress, animations, and logs

## How to Play

1. Click a card in your hand to ask the AI for that rank
2. If the AI has cards of that rank, you get all of them
3. If not, you "Go Fish" and draw from the deck
4. Collect 4 of a kind to score a "book"
5. The player with the most books when all cards are gone wins!

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the Go-Fish Project folder:
   ```bash
   cd "Go-Fish Project"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
Go-Fish Project/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Card.js          # Individual card component
│   │   ├── Deck.js          # Draw pile display
│   │   ├── GameOver.js      # Game over modal
│   │   ├── Hand.js          # Player/AI hand display
│   │   ├── MessageLog.js    # Game event log
│   │   ├── Scoreboard.js    # Score tracking display
│   │   └── StartScreen.js   # Game start screen
│   ├── utils/
│   │   ├── cardUtils.js     # Card creation and utility functions
│   │   └── gameLogic.js     # Core game logic
│   ├── App.js               # Main game controller
│   ├── App.css              # Game-specific styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Technologies Used

- **React** – Frontend framework
- **Tailwind CSS** – Styling and responsive design
- **JavaScript (ES6+)** – Game logic and interactivity

## Technical Highlights

- **Fisher-Yates Shuffle** – For randomizing the deck
- **React Hooks** – useState and useCallback for state management
- **Rule-based AI** – Prioritizes ranks with multiple copies
- **Responsive Design** – Works on desktop and mobile devices
- **Animated UI** – Smooth transitions and hover effects

## Available Scripts

- `npm start` – Runs the app in development mode
- `npm test` – Launches the test runner
- `npm run build` – Builds the app for production
- `npm run eject` – Ejects from Create React App

## License

This project is created for educational purposes as part of CPSC-349.

---

Created by Muhammad Jibaly
