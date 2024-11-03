import React from 'react';
import '../styles/Card.css';
import { playSound } from '../utils/cardUtils';

const Card = ({ suit, rank, isFaceUp, draggable, cardBack, onDragStart }) => {
  const getCardImageUrl = (suit, rank) => {
    if (suit && rank) {
      switch (suit.toLowerCase()) {
        case 'clubs':
        case 'diamonds':
        case 'hearts':
        case 'spades':
          return `/assets/card-icons/${suit.toLowerCase()}/${rank}.png`;
                  default:
          return null;
      }
    }
    return null;
  };

  const cardClass = `card ${suit ? suit.toLowerCase() : ''} ${isFaceUp ? 'face-up' : 'face-down'}`;

  const handleDragStart = (e) => {
    playSound('card_flip.mp3'); 
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const cardImageUrl = isFaceUp ? getCardImageUrl(suit, rank) : `/assets/card-icons/card-backgrounds/${cardBack}.png`;

  return (
    <div               
      className={cardClass}
      draggable={draggable}
      onDragStart={handleDragStart}
      style={{
        backgroundImage: `url(${cardImageUrl})`,
        backgroundSize: 'cover',
      
      }}
    
    >
      {!isFaceUp && <div className="card-back" />}
    </div>
  );
};

export default Card;