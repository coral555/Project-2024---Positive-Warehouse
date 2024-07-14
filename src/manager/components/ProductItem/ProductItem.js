
import React from 'react';
import { Tooltip } from 'react-tooltip';
import '../ProductItem/ProductItem.css';

const ProductItem = ({
  product,
  handleDeleteProduct,
  handleDescriptionEdit,
  handleQuantityEdit,
  handleImageClick,
  imageURL
}) => { 
  return (
    <div className="product-container2 lg:w-1/4 md:w-1/2 p-4 w-full">
      <a
        className="image-link block relative h-48 rounded overflow-hidden cursor-pointer"
        onClick={() => handleImageClick(product.id)}
        data-tooltip-id={`tooltip-image-${product.id}`}
      >
        <img
          alt={product.name}
          className="product-image2 object-cover object-center w-full h-full block"
          src={imageURL || 'https://dummyimage.com/420x260'}
        />
      </a>
      <Tooltip id={`tooltip-image-${product.id}`} place="top" effect="solid">
        לחץ כדי לשנות תמונה
      </Tooltip>

      <div className="product-details2 mt-4">
        <h3 className="product-category text-gray-500 text-xs tracking-widest title-font mb-1">
          קטגוריה: {product.category}
        </h3>
        <h3 className="product-subcategory text-gray-500 text-xs tracking-widest title-font mb-1">
          תת קטגוריה: {product.subcategory}
        </h3>

        <div>
          <button className="edit-buttons2"
            onClick={() => handleDescriptionEdit(product)} 
            data-tooltip-id={`tooltip-edit-description-${product.id}`}
          >תיאור: {product.description}</button>
          <Tooltip id={`tooltip-edit-description-${product.id}`} place="top" effect="solid">
            לחץ לעריכת תיאור
          </Tooltip>
        </div>

        <div>
          <button className="edit-buttons2"
            onClick={() => handleQuantityEdit(product)} 
            data-tooltip-id={`tooltip-edit-quantity-${product.id}`}
          >כמות: {product.quantity}</button>
          <Tooltip id={`tooltip-edit-quantity-${product.id}`} place="top" effect="solid">
            לחץ לעריכת הכמות
          </Tooltip>
        </div>

        <button className="edit-buttons2"
          onClick={() => handleDeleteProduct(product)} 
          data-tooltip-id={`tooltip-delete-${product.id}`}
        >מחיקה</button>
        <Tooltip id={`tooltip-delete-${product.id}`} place="top" effect="solid">
          לחץ למחיקת המוצר
        </Tooltip>
      </div>
    </div> 
  );
};

export default ProductItem;
