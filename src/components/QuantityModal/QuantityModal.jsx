// src/components/QuantityModal.jsx

import React, { useState } from "react";
import "./QuantityModal.css";

const QuantityModal = ({ isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (e) => { 
    setQuantity(Number(e.target.value));
  };
  const handleAddToCart = () => { 
    onAddToCart(quantity);
    setQuantity('');
    onClose();
  };
  if (!isOpen) return null;
   
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Quantity</h2>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default QuantityModal;
