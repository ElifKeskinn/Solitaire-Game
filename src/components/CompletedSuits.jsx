import React from 'react';
import Card from './Card.jsx';
import '../styles/CompletedSuits.css'; 

const CompletedSuits = ({ completedSuits }) => {
  return (
    <div className="completed-suits">
      <h3>Completed Suits</h3>
      <div className="completed-suits-container">
        {completedSuits.map((card, index) => (
          <Card
            key={index}
            suit={card.suit}
            rank={card.rank}
            isFaceUp={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletedSuits;
