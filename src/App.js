import React, { useState } from 'react';
import GameScreen from './components/GameScreen';
import HomeScreen from './components/HomeScreen';
import './App.css';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [cardBack, setCardBack] = useState('classic_blue');

  const handleStartGame = (selectedDifficulty, selectedBackgroundColor) => {
    setDifficulty(selectedDifficulty);
    setCardBack(selectedBackgroundColor);
    setGameStarted(true);
  };


  return (
    <div className="app">
      {gameStarted ? (
        <GameScreen difficulty={difficulty} cardBack={cardBack} />
      ) : (
        <HomeScreen onStartGame={handleStartGame} />
      )}
    </div>
  );
};

export default App;
