import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CartItem } from "../../components/cart-item/cart-item";
import { useNavigate, useLocation } from "react-router-dom";
import { PlaceOrder, clearCart } from "../../actions/cartActions"; // Ensure clearCart action is imported
import { addDoc, collection, Timestamp } from "firebase/firestore"; // Ensure Timestamp is imported
import { db } from "../../utils/firebase";
import Modal from "../../components/Modal/Modal";
import { useCombined } from "../../context/CombinedContext";
import "./cart.css";

export const Cart = () => {
  const {
    products,
    isModalOpen, 
    setIsModalOpen,
    startDate,
    endDate,
    handleResetDates,
  } = useCombined();

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });

  const { startDate: selectedStartDate, endDate: selectedEndDate } = location.state || {};

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(052|054|050|055)\d{7}$/;
    return phoneRegex.test(phone);
  };

  const handleCheckout = async () => {
    if (!validateEmail(userInfo.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePhoneNumber(userInfo.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    const selectedProducts = products
      .filter((product) => cartItems[product.id] > 0)
      .map((product) => {
        const { id, name } = product;
        const quantity = cartItems[product.id];

        return {
          id: id,
          selectedQuantity: quantity,
          productName: name,
        };
      });

    const currentDate = new Date();
    const orderDate = Timestamp.fromDate(currentDate); 

    const startTimestamp = selectedStartDate ? Timestamp.fromDate(new Date(selectedStartDate)) : Timestamp.fromDate(new Date(startDate));
    const endTimestamp = selectedEndDate ? Timestamp.fromDate(new Date(selectedEndDate)) : Timestamp.fromDate(new Date(endDate));

    const orderData = {
      startDate: startTimestamp,
      endDate: endTimestamp,
      orderDate: orderDate,
      products: selectedProducts,
      user: userInfo,
    };

    try {
      if (!orderData.startDate || !orderData.endDate) {
        throw new Error("Missing start date or end date");
      }

      const ordersCollectionRef = collection(db, "orders");
      await addDoc(ordersCollectionRef, orderData);
      alert('Order created successfully!');
      dispatch(PlaceOrder(orderData));
      dispatch(clearCart());
      handleResetDates();
      navigate("/");
    } catch (error) {
      console.error("Error creating order: ", error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handlePlaceOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    handleCheckout();
    setIsModalOpen(false);
  };

  return ( 
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cart-items">
        {products
          .filter((product) => cartItems[product.id] > 0)
          .map((product) => (
            <CartItem key={product.id} data={{ ...product, quantity: cartItems[product.id] }} />
          ))}
      </div>

      {Object.keys(cartItems).length > 0 ? (
        <div className="checkout">
          <button onClick={() => navigate(-1)}> Continue Shopping </button>
          <button onClick={handlePlaceOrderClick}> Place Order </button>
        </div>
      ) : (
        <h1>Your Cart is Empty</h1>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    </div>
  );
};

export default Cart;
