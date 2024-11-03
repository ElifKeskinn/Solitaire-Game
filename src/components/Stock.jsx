import React from 'react';
import '../styles/Stock.css';

const Stock = ({ stock, onMoveCards }) => {
  const handleClick = () => {
    if (stock.length < 10) return;

    const cardsToMove = stock.slice(0, 10);
    const newStock = stock.slice(10);

    onMoveCards(cardsToMove, newStock);
  };

  return (
    <div className="stock" onClick={handleClick}>
      {stock.length > 0 ? (
        <div className="stock-card">
          <div className="remaining-cards">
            {stock.length} cards remaining
          </div>
        </div>
      ) : (
        <div className="stock-empty">No cards left</div>
      )}
    </div>
  );
};

export default Stock;
