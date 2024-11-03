import React from 'react';
import Card from './Card';
import '../styles/Column.css';

const Column = ({ cards, index, onDrop, onDragOver }) => {
  return (
    <div
      className="column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      {cards.map((card, cardIndex) => (
        <Card
          key={cardIndex}
          suit={card.suit}
          rank={card.rank}
          isFaceUp={card.isFaceUp}
          draggable={true}
          onDragStart={(e) => {
            const cardDataList = cards.slice(cardIndex); 
            e.dataTransfer.setData('cardDataList', JSON.stringify(cardDataList));
            e.dataTransfer.setData('fromIndex', index);
          }}
        />
      ))}
    </div>
  );
};


export default Column;