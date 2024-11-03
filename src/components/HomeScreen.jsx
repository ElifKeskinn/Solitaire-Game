import React, { useState } from 'react';
import '../styles/HomeScreen.css';

const HomeScreen = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState('easy');
  const [backgroundColor, setBackgroundColor] = useState('classic_blue');

  const handleStartGame = () => {
    onStartGame(difficulty, backgroundColor);
  };

  return (
    <div className="home-screen">
      <h1>Spider Solitaire</h1>
      <div className="options">
        <div className="difficulty-options">
          <h2>Select Difficulty</h2>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="easy"
              checked={difficulty === 'easy'}
              onChange={() => setDifficulty('easy')}
            />
            Level 1 (Only Spades)
          </label>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="medium"
              checked={difficulty === 'medium'}
              onChange={() => setDifficulty('medium')}
            />
            Level 2 (Spades & Hearts)
          </label>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="hard"
              checked={difficulty === 'hard'}
              onChange={() => setDifficulty('hard')}
            />
            Level 3 (All Suits)
          </label>
        </div>

        <div className="background-options">
          <h2>Select Card Back Color</h2>
          <label>
            <input
              type="radio"
              name="backgroundColor"
              value="classic_blue"
              checked={backgroundColor === 'classic_blue'}
              onChange={() => setBackgroundColor('classic_blue')}
            />
            Classic Blue
          </label>
          <label>
            <input
              type="radio"
              name="backgroundColor"
              value="classic_brown"
              checked={backgroundColor === 'classic_brown'}
              onChange={() => setBackgroundColor('classic_brown')}
            />
            Classic Brown
          </label>
          <label>
            <input
              type="radio"
              name="backgroundColor"
              value="classic_green"
              checked={backgroundColor === 'classic_green'}
              onChange={() => setBackgroundColor('classic_green')}
            />
            Classic Green
          </label>
          <label>
            <input
              type="radio"
              name="backgroundColor"
              value="classic_red"
              checked={backgroundColor === 'classic_red'}
              onChange={() => setBackgroundColor('classic_red')}
            />
            Classic Red
          </label>
        </div>
      </div>

      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default HomeScreen;
