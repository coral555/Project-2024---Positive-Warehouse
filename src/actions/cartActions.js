
//src\actions\cartActions.js
export const addToCart = (productId, quantity = 1) => {
  return {
    type: 'ADD_TO_CART', 
    payload: {
      productId,
      quantity,
    },
  };
};

export const clearCart = () => {
  return {
    type: 'CLEAR_CART'
  };
};

export const removeFromCart = (itemId) => ({
  type: "REMOVE_FROM_CART",
  payload: itemId,
});

export const updateCartItemCount = (itemId, count) => ({
  type: "UPDATE_CART_ITEM_COUNT",
  payload: { itemId, count },
});

export const PlaceOrder = (orderData) => ({
  type: "PLACE_ORDER",
  payload: orderData,
});
