// src/components/CartItem.js

import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemCount, addToCart } from '../../actions/cartActions';
import { useCombined } from '../../context/CombinedContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import "./cart-item.css";

export const CartItem = ({ data }) => {
  const { id, name, quantity, imageURL } = data;
  const dispatch = useDispatch();
  const { products, productQuantities, setProductQuantities } = useCombined();

  const product = products.find((product) => product.id === id);
  const remainingQuantity = product ? product.quantity - (productQuantities[id] || 0) : 0;

  const removeFromCartHandler = () => {
    dispatch(removeFromCart(id, quantity));
    setProductQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[id];
      return updatedQuantities;
    });
  };

  const updateCartItemCountHandler = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count > 0 && count <= remainingQuantity) {
      dispatch(updateCartItemCount(id, count));
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + (count - quantity),
      }));
    } else {
      alert('The quantity you have selected exceeds the available quantity.');
    }
  };

  const increaseQuantityHandler = () => {
    if (quantity < remainingQuantity) {
      dispatch(addToCart(id, 1));
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + 1,
      }));
    } else {
      alert('The quantity you have selected exceeds the available quantity.');
    }
  };

  const decreaseQuantityHandler = () => {
    if (quantity > 1) {
      dispatch(updateCartItemCount(id, quantity - 1));
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) - 1,
      }));
    }
  };

  return (
    <section className="cartItem">
      <div className="deleteIcon">
        <FontAwesomeIcon icon={faTrash} onClick={removeFromCartHandler} />
      </div>
      <div className="imageColumn">
        <img src={imageURL} alt={name} />
      </div>
      <div className="detailsWrapper">
        <div className="nameColumn">
          <div className="itemName">
            <p>{name}</p>
          </div>
        </div>
        <div className="quantityColumn">
          <div className="quantityWrapper">
            <p>כמות: {quantity}</p>
            </div>
          </div>
          <div className="countColumn">
            <div className="countHandler">
              <button onClick={decreaseQuantityHandler} className="circleButton">
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={updateCartItemCountHandler}
              />
              <button onClick={increaseQuantityHandler} className="circleButton">
                <FontAwesomeIcon icon={faPlus} />
              </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};
