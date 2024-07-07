//src\components\product\product.js
import React from "react";
export const Product = ({ data }) => {
  const {  id,name, quantity, imageURL } = data;
  return (
    <div className="product">
      <img src={imageURL} alt={name} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Quantity: {quantity}</p>
      </div>
    </div>
  );
};
