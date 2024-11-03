import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import Card from './Card.jsx';
import Stock from './Stock.jsx';
import CompletedSuits from './CompletedSuits.jsx';
import '../styles/GameScreen.css';
import { playSound } from '../utils/cardUtils.jsx';

const generateDeck = (difficulty) => {
  const suits = {
    easy: ['Spades'],
    medium: ['Spades', 'Hearts'],
    hard: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
  }[difficulty];

  const ranks = ['13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
      deck.push({ suit, rank }); // 2 decks
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};


const isValidMove = (fromCard, toCard) => {
  if (!fromCard || !fromCard.isFaceUp) return false;
  if (!toCard) return true;

  const rankOrder = ['13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
  const fromCardRankIndex = rankOrder.indexOf(fromCard.rank);
  const toCardRankIndex = rankOrder.indexOf(toCard.rank);

  return fromCardRankIndex === toCardRankIndex + 1;
};

const isCompletedSet = (column) => {
  if (column.length < 13) return false;

  const last13Cards = column.slice(-13);
  const suit = last13Cards[0].suit;
  const rankOrder = ['13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

  return last13Cards.every((card, index) => card.suit === suit && card.rank === rankOrder[index]);
};




const GameScreen = ({ difficulty, cardBack }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [columns, setColumns] = useState([]);
  const [stock, setStock] = useState([]);
  const [completedSuits, setCompletedSets] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [startTime, setStartTime] = useState(null); 
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]); 
  const [currentStep, setCurrentStep] = useState(0); 
  const [hints, setHints] = useState([]);
  const [flashingCards, setFlashingCards] = useState([]);

  const handlePauseClick = () => {
    setIsPaused(true);
  };

  const handleContinueGame = () => {
    setIsPaused(false);
  };

  const handleExitGame = () => {
    setIsPaused(false);
    window.location.reload();
  };


const handleInitialSpread = () => {
  const cardElements = document.querySelectorAll('.card');
  cardElements.forEach(card => {
    card.classList.add('spread-cards');
  });
};

useEffect(() => {
  handleInitialSpread();
}, []);


const handleNewCards = () => {
  const newCardElements = document.querySelectorAll('.card.new');
  newCardElements.forEach(card => {
    card.classList.add('card-drop');
    card.addEventListener('animationend', () => {
      card.classList.remove('card-drop');
    });
  });
};


const handleCompletedSets = () => {
  const completedSetElements = document.querySelectorAll('.completed-set');
  completedSetElements.forEach(set => {
    set.classList.add('completed-set');
    set.addEventListener('animationend', () => {
      set.classList.remove('completed-set');
    });
  });
};


  const renderHints = () => {
    return flashingCards.map((hint, index) => (
      <div key={index} className="hint-overlay">
        <div className={`hint-overlay-card ${hint.flashClass}`}>
          <Card
            suit={hint.card.suit}
            rank={hint.card.rank}
            isFaceUp={hint.card.isFaceUp}
            draggable={false}
            cardBack={cardBack}
          />
        </div>
      </div>
    ));
  };

  const calculateHints = () => {
    const hints = [];
    for (let i = 0; i < columns.length; i++) {
      for (let j = i + 1; j < columns.length; j++) {
        if (isValidMove(columns[i][columns[i].length - 1], columns[j][columns[j].length - 1])) {
          hints.push({
            from: i,
            to: j,
            flashClass: 'flash-border',
            card: columns[i][columns[i].length - 1], 
          });
          hints.push({
            from: j,
            to: i,
            flashClass: 'flash-border',
            card: columns[j][columns[j].length - 1], 
          });
          setFlashingCards(hints);
          return;
        }
      }
    }
  };

  
 useEffect(() => {
    if (flashingCards.length > 0) {
      const timer = setTimeout(() => {
        setFlashingCards([]);
      }, 2000); // 2 saniye sonra yanıp sönme dur

      return() => clearTimeout(timer);
      
    }
  }, [flashingCards]);

  useEffect(() => {
    const deck = generateDeck(difficulty);
    const shuffledDeck = shuffleDeck(deck);

    const newColumns = [];
    for (let i = 0; i < 10; i++) {
      newColumns[i] = [];
    }

    let cardIndex = 0;
    for (let i = 0; i < 10; i++) {
      const numCards = i < 4 ? 6 : 5;
      for (let j = 0; j < numCards; j++) {

        newColumns[i].push({
          ...shuffledDeck[cardIndex],
          isFaceUp: j === numCards - 1 
        });
        cardIndex++;
      }
    }

    setColumns(newColumns);
    setStock(shuffledDeck.slice(cardIndex, cardIndex + 50));

    // Zamanlayıcıyı başlat
    setStartTime(Date.now());

    return () => {
      // Zamanlayıcıyı temizle
      setStartTime(null);
    };
  }, []);

  useEffect(() => {
    let timer;

    if (!isPaused && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); //saniyeye çevir
      }, 1000);
    }
    return () => clearInterval(timer); // Temizlik işlemi
  }, [isPaused, startTime]);

  useEffect(() => {
    if (isGameWon || isGameOver) {
      const endTime = Date.now();
      const totalElapsedTime = Math.floor((endTime - startTime) / 1000); //saniyeye çevir
      setElapsedTime(totalElapsedTime);

      // Puan hesaplama (örnek: 1000 - geçen süre)
      const calculatedScore = Math.max(0, 1000 - totalElapsedTime);
      setScore(calculatedScore);

      if (isGameWon) {
        playSound('victory.mp3');
      } else if (isGameOver) {
        playSound('undo.mp3');
      }
    }
  }, [isGameWon, isGameOver]);
  
  const moveCardsToColumns = (cardsToMove, newStock) => {
    if (isPaused) return;
  
    setStock(newStock);
  
    const faceUpCardsToMove = cardsToMove.map(card => ({ ...card, isFaceUp: true }));
  
    const updatedColumns = columns.map((column, index) => {
      const cardsForThisColumn = faceUpCardsToMove.slice(index, index + 1);
      return [...column, ...cardsForThisColumn];
    });
  
    setColumns(updatedColumns);
    playSound('card_drop.mp3');
    checkForCompletedSets(updatedColumns);
    checkGameOverOrWin(updatedColumns);
  
    setHistory((prevHistory) => [
      ...prevHistory.slice(0, currentStep + 1),
      {
        columns: updatedColumns,
        stock: newStock,
        completedSuits: completedSuits,
        isPaused,
        isGameOver,
        isGameWon
      }
    ]);
    setCurrentStep((prevStep) => prevStep + 1);
  };
  

  
const moveCardBetweenColumns = (cardDataList, fromIndex, toIndex) => {
  const updatedColumns = [...columns];

  const fromColumn = updatedColumns[fromIndex];
  const toColumn = updatedColumns[toIndex];
  
  const cardsToMove = cardDataList.map(cardData => 
    fromColumn.find(card => card.suit === cardData.suit && card.rank === cardData.rank)
  ).filter(Boolean);

  if (cardsToMove.length > 0 && isValidMove(cardsToMove[0], toColumn[toColumn.length - 1])) {
    const newFromColumn = fromColumn.filter(
      card => !cardsToMove.includes(card)
    );
    const newToColumn = [...toColumn, ...cardsToMove.map(card => ({ ...card, isFaceUp: true }))];

    updatedColumns[fromIndex] = newFromColumn;
    updatedColumns[toIndex] = newToColumn;
    setColumns(updatedColumns);
    playSound('card_drop.mp3');

    if (newFromColumn.length > 0 && !newFromColumn[newFromColumn.length - 1].isFaceUp) {
      newFromColumn[newFromColumn.length - 1].isFaceUp = true;
      updatedColumns[fromIndex] = newFromColumn;
      setColumns(updatedColumns);
    }
    checkForCompletedSets(updatedColumns);
    checkGameOverOrWin(updatedColumns);

      setHistory((prevHistory) => [
        ...prevHistory.slice(0, currentStep + 1),
        {
          columns: updatedColumns,
          stock: stock,
          completedSuits: completedSuits,
          isPaused,
          isGameOver,
          isGameWon
        }
      ]);
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const checkForCompletedSets = (columns) => {
    const updatedColumns = [...columns];
    const newCompletedSets = [...completedSuits];

    for (let i = 0; i < updatedColumns.length; i++) {
      if (isCompletedSet(updatedColumns[i])) {
        newCompletedSets.push(...updatedColumns[i].slice(-13));
        updatedColumns[i] = updatedColumns[i].slice(0, -13);
        playSound('shuffle-card.mp3');
        if (updatedColumns[i].length > 0) {
          updatedColumns[i][updatedColumns[i].length - 1].isFaceUp = true;
        }
      }
    }

    setCompletedSets(newCompletedSets);
    setColumns(updatedColumns);
    handleCompletedSets();
  };

  const checkGameOverOrWin = (columns) => {
    const hasPossibleMove = columns.some((column, columnIndex) => {
      const topCard = column[column.length - 1];
      return columns.some((targetColumn, targetIndex) => {
        if (columnIndex !== targetIndex && targetColumn.length > 0) {
          return isValidMove(topCard, targetColumn[targetColumn.length - 1]);
        }
        return false;
      });
    });

    if (completedSuits.length === 104) {
      setIsGameWon(true);
    } else if (!hasPossibleMove && stock.length === 0) {
      setIsGameOver(true);
    }
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
  
    const cardDataListString = e.dataTransfer.getData('cardDataList');
    const fromIndexString = e.dataTransfer.getData('fromIndex');
  
    // Check if the data exists
    if (!cardDataListString || !fromIndexString) {
      return;
    }
  
    try {
      const cardDataList = JSON.parse(cardDataListString);
      const fromIndex = parseInt(fromIndexString, 10);
  
      if (cardDataList.length) {
        moveCardBetweenColumns(cardDataList, fromIndex, toIndex);
      }
    } catch (error) {
      console.error('Error parsing card data:', error);
    }
  };
  
  

  const handleDragStart = (e, cardData, fromIndex) => {
    e.dataTransfer.setData('cardDataList', JSON.stringify
      ([{ suit: cardData.suit, rank: cardData.rank }]));
    e.dataTransfer.setData('fromIndex', fromIndex.toString());
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleStockClick = () => {
    if (isPaused || stock.length === 0) return;

    const cardFromStock = stock[0];
    const newStock = stock.slice(1);

    setStock(newStock);
    setColumns((prevColumns) => {
      const updatedColumns = [...prevColumns];
      updatedColumns[0].push({ ...cardFromStock, isFaceUp: true });
      return updatedColumns;
    });
    playSound('card_flip.mp3');
    setHistory((prevHistory) => [
      ...prevHistory.slice(0, currentStep + 1),
      {
        columns: columns,
        stock: newStock,
        completedSuits: completedSuits,
        isPaused,
        isGameOver,
        isGameWon
      }
    ]);
    setCurrentStep((prevStep) => prevStep + 1);
    handleNewCards();
  };

  
  const handleUndo = () => {
    if (currentStep > 0) {
      const previousState = history[currentStep - 1];
      setColumns(previousState.columns);
      setStock(previousState.stock);
      setCompletedSets(previousState.completedSuits);
      setIsPaused(previousState.isPaused);
      setIsGameOver(previousState.isGameOver);
      setIsGameWon(previousState.isGameWon);
      setHistory((prevHistory) => prevHistory.slice(0, currentStep - 1));
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };



  return (
    <div className="game-screen">
        <div className="hint-button">
        <button onClick={calculateHints}>Hint</button>
        </div>
      <button className="pause-button" onClick={handlePauseClick}>Pause</button>
      <button className="undo-button" onClick={handleUndo} disabled={currentStep === 0}>Undo</button>
      <Stock stock={stock} onMoveCards={moveCardsToColumns} />
      <div className="columns">
        {columns.map((column, index) => (
          <div
            key={index}
            className="column"
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {column.map((card, cardIndex) => (
              <Card
              key={cardIndex}
              suit={card.suit}
              rank={card.rank}
              isFaceUp={card.isFaceUp}
              draggable={true}
              cardBack={cardBack}
              onDragStart={(e) => handleDragStart(e, card, index)}  />
            ))}
          </div>
        ))}
      </div>
      <CompletedSuits completedSuits={completedSuits} />
      <div className="game-info">
        <div className="timer">
          Time Elapsed: {elapsedTime} seconds
        </div>
        <div className="score">
          Score: {score}
        </div>
      </div>
      {isPaused && (
        <Modal onContinue={handleContinueGame} onExit={handleExitGame} />
      )}
      {isGameOver && <div className="game-over">Game Over</div>}
      {isGameWon && <div className="game-won">You Win!</div>}

      {renderHints()}

    </div>
  );
  
  
};

export default GameScreen;