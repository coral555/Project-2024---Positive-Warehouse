// src/components/Product.js
import React from 'react';
import LazyLoad from 'react-lazyload';

function Product({ product }) {
  return (
    <div className="product-item">
      <LazyLoad height={200} offset={100} once>
        {product.imageURL && <img src={product.imageURL} alt={product.description} />}
      </LazyLoad>
      <p>תאור: {product.description || 'No description available'}</p>
      <p>כמות במלאי: {product.amount}</p>
    </div>
  );
}

export default React.memo(Product);
