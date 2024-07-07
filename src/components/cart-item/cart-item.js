import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemCount, addToCart } from "../../actions/cartActions";
import { useCombined } from "../../context/CombinedContext";

export const CartItem = ({ data }) => {
  const { id, name, quantity, imageURL } = data;
  const dispatch = useDispatch();
  const { products, productQuantities } = useCombined();
  
  const product = products.find((product) => product.id === id);
  const remainingQuantity = product.quantity - (productQuantities[id] || 0);

  const removeFromCartHandler = () => {
    dispatch(removeFromCart(id));
  };

  const updateCartItemCountHandler = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count > 0 && count <= remainingQuantity) {
      dispatch(updateCartItemCount(id, count));
    } else {
      alert('The quantity you have selected exceeds the available quantity.');
    }
  };

  const increaseQuantityHandler = () => {
    if (quantity < remainingQuantity) {
      dispatch(addToCart(id, 1)); // Assuming addToCart takes an id and quantity
    } else {
      alert('The quantity you have selected exceeds the available quantity.');
    }
  };

  const decreaseQuantityHandler = () => {
    if (quantity > 1) {
      dispatch(updateCartItemCount(id, quantity - 1));
    }
  };

  return (
    <div className="cartItem">
      <img src={imageURL} alt={name} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Quantity: {quantity}</p>
        <div className="countHandler">
          <button onClick={decreaseQuantityHandler}> - </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={updateCartItemCountHandler}
          />
          <button onClick={increaseQuantityHandler}> + </button>
        </div>
        <button className="removeFromCartButton" onClick={removeFromCartHandler}>
          Remove
        </button>
      </div>
    </div>
  );
};
