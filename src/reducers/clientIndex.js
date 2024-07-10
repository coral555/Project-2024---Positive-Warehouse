
//src\reducers\index.js
import { combineReducers } from "redux";

const initialState = {};
 
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const { productId, quantity } = action.payload;
      return {
        ...state,
        [productId]: (state[productId] || 0) + quantity,
      };
    case 'REMOVE_FROM_CART':
      const { [action.payload]: removed, ...rest } = state;
      return rest;
    case 'UPDATE_CART_ITEM_COUNT':
      return {
        ...state,
        [action.payload.itemId]: action.payload.count,
      };
    case 'CLEAR_CART':
      return {};
    case 'PLACE_ORDER':
      return {}; 
    default:
      return state;
  }
};

export default combineReducers({
  cart: cartReducer,
});
