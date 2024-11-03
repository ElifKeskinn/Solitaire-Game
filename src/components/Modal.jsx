import React from 'react';
import '../styles/Modal.css'; 

const Modal = ({ title, onContinue, onExit }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>What is wrong?</h2>
        {onContinue && <button onClick={onContinue}>Continue Game</button>}
        {onExit && <button onClick={onExit}>Exit Game</button>}
      </div>
    </div>
  );
};

export default Modal;