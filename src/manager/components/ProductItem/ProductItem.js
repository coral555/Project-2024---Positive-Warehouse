import React from 'react';
import { Tooltip } from 'react-tooltip';

const ProductItem = ({
    product, 
    imageURL,
    handleImageClick,
    handleDescriptionEdit, // Ensure this matches
    handleQuantityEdit, // Ensure this matches
    handleDeleteProduct // Ensure this matches
}) => {
    return (
        <div className="product-item">
            <img
                src={imageURL || 'placeholder.jpg'}
                alt={product.description}
                className={imageURL ? '' : 'no-image'}
                onClick={() => handleImageClick(product.id)}
            />
            <div className="product-detail" data-tooltip-id={`description-tooltip-${product.id}`}>
                <span>תיאור:</span>
                <span onClick={() => handleDescriptionEdit(product)}>{product.description}</span>
            </div>
            <Tooltip id={`description-tooltip-${product.id}`} place="top" effect="solid">
                Click to edit
            </Tooltip>
            <div className="product-detail" data-tooltip-id={`quantity-tooltip-${product.id}`}>
                <span>כמות:</span>
                <span onClick={() => handleQuantityEdit(product)}>{product.quantity}</span>
            </div>
            <Tooltip id={`quantity-tooltip-${product.id}`} place="top" effect="solid">
                Click to edit
            </Tooltip>
            <button onClick={() => handleDeleteProduct(product)}>מחק</button>
        </div>
    );
};

export default ProductItem;
