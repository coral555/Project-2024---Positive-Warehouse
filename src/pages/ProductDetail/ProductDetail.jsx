import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCombined } from "../../context/CombinedContext";
import QuantityModal from "../../components/QuantityModal/QuantityModal";
import { addToCart } from "../../actions/cartActions";
import {  useLocation } from "react-router-dom";

import "./ProductDetail.css";

export const ProductDetail = () => {
  const {
    products,
    isModalOpen,
    setIsModalOpen,
    selectedProductId,
    setSelectedProductId,
    handleAddToCart: addToCartContext,
    getRemainingQuantity,
    startDate,
    endDate,
    startDate: contextStartDate,
    endDate: contextEndDate,
  } = useCombined();

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(0);

  useEffect(() => {
    const selectedProduct = products.find((product) => product.id === id);
    setProduct(selectedProduct);
  }, [id, products]);
  const { startDate: selectedStartDate, endDate: selectedEndDate } = location.state || {};
  const tempStartDate = selectedStartDate || contextStartDate;
  const tempEndDate = selectedEndDate || contextEndDate;
  const remainingQuantities = useMemo(() => {
  return products.reduce((acc, product) => {
      const remainingQuantity = getRemainingQuantity(product.id, product.quantity);
      acc[product.id] = remainingQuantity;
      return acc;
    }, {});
  }, [products, getRemainingQuantity]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCartClick = () => {
    if (!tempStartDate || !tempEndDate) {
      alert("You must select start and end dates before adding items to the cart.");
      return;
    }
    const remainingQuantity = remainingQuantities[product.id];
    if (remainingQuantity > 0) {
      setSelectedProductId(product.id);
      setSelectedProductQuantity(remainingQuantity);
      
      setIsModalOpen(true);
    } else {
      alert("This product is not available.");
    }
  };

  const handleAddProductToCart = (quantity) => {
    if (selectedProductId) {
      if (quantity <= selectedProductQuantity) {
        dispatch(addToCart(selectedProductId, quantity));
        addToCartContext(selectedProductId, quantity);
        
        setIsModalOpen(false);
      } else {
        alert("The quantity you have selected exceeds the available quantity.");
      }
    }
  };

  return (
    <div className="product-detail">
      <div className="details">
        <h1>{product.name}</h1>
        <p className="price">Quantity: {remainingQuantities[product.id]}</p>
        <p className="description">Description: {product.description}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
        <button onClick={handleAddToCartClick}>Add to Cart</button>
      </div>
      <img src={product.imageURL} alt={product.name} />
      <QuantityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddProductToCart}
      />
    </div>
  );
};

export default ProductDetail;
