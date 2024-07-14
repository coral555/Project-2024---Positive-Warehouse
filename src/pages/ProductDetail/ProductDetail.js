import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCombined } from "../../context/CombinedContext";
import { addToCart } from "../../actions/cartActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import "./ProductDetail.css";

export const ProductDetail = () => {
  const {
    products,
    handleAddToCart: addToCartContext,
    getRemainingQuantity,
    startDate: contextStartDate,
    endDate: contextEndDate,
  } = useCombined();

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alertMessage, setAlertMessage] = useState("");

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

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCartClick = () => {
    if (!tempStartDate || !tempEndDate) {
      setAlertMessage("You must select start and end dates before adding items to the cart.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }
    const remainingQuantity = remainingQuantities[product.id];
    if (quantity > 0 && quantity <= remainingQuantity) {
      dispatch(addToCart(product.id, quantity));
      addToCartContext(product.id, quantity);
      setQuantity(1); 
      setAlertMessage(""); 
    } else {
      setAlertMessage("The quantity you have selected exceeds the available quantity or is invalid.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="product-container">
          <div className="product-image">
            <img
              alt={product.name}
              className="product-img"
              src={product.imageURL}
            />
          </div>
          <div className="product-info" dir="rtl">
            <div className="product-content">
              <div className="data w-full max-w-xl">
                <p className="text-lg font-medium leading-8 text-indigo-600 mb-4">
                  {product.category} &nbsp;/&nbsp; {product.category}
                </p>
              </div>
              <h1 className="product-title">{product.name}</h1>
              <p className="product-description">תיאור: {product.description}</p>
              <div className="product-details">
                <span className="product-quantity">כמות זמינה: {remainingQuantities[product.id]}</span>
              </div>
            </div>
            <div className="product-quantity-container">
              <div className="quantity-controls">
                <button className="quantity-button" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button className="quantity-button" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= remainingQuantities[product.id]}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="product-buttons-container">
              <button className="product-button" onClick={handleAddToCartClick}>
                להוסיף לסל
              </button>
              <button className="product-button" onClick={() => navigate(-1)}>
                חזרה
              </button>
            </div>
          </div>
        </div>
      </div>
      {alertMessage && (
        <div className="alert">
          {alertMessage}
        </div>
      )}
    </section>
  );
};

export default ProductDetail;
