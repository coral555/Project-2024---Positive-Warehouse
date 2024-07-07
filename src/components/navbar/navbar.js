import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5"; // Import IoCartOutline from react-icons/io5
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../actions/cartActions";
import { useCombined } from "../../context/CombinedContext";

export const Navbar = () => {
  const {
  setSubCategory,
  setCategory,
  } = useCombined();
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDate, setTempDate] = useState(null); // Temporary date before confirmation
  const [selectedDate, setSelectedDate] = useState(null); // Confirmed date
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart); 
  const [orderPlaced, setOrderPlaced] = useState(false); 
  const handleResetCategory = () => {
    setCategory(''); 
    setSubCategory(''); 
  };
  const handleDateChange = (date) => {
    setTempDate(date);
  };

  const handleConfirmDate = () => {
    if (tempDate) {
      const startDate = new Date(tempDate.setHours(0, 0, 0, 0));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 2);

      setSelectedDate(startDate);
      dispatch(clearCart());
      const uniqueKey = Date.now();
      navigate(`/CreateOrder?key=${uniqueKey}`, { state: { startDate, endDate } });
      setShowCalendar(false);
      setOrderPlaced(true);
    }
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateOrderClick = (e) => {
    e.preventDefault();
    setShowCalendar(!showCalendar);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const dayClassName = (date) => {
    return isPastDate(date) ? "past-date" : "";
  };

  return (
    
    <div className="navbar">
      <div className="links">
        <Link to="/"> Home </Link>
        <Link to="/Donate"> Donate</Link>
        <Link to="/AboutWarehouse"> AboutWarehouse</Link>
        <div className="create-order-container">
          <Link to="#" onClick={handleCreateOrderClick}>
            Create Order
          </Link>
          {showCalendar && (
            <div className="calendar-dropdown" ref={calendarRef}>
              <DatePicker
                selected={tempDate}
                onChange={handleDateChange}
                inline
                filterDate={(date) => !isPastDate(date)}
                dayClassName={dayClassName} 
              />
              <button onClick={() => { handleResetCategory(); handleConfirmDate(); }}>Confirm Date</button>
            </div>
          )}
        </div>
        <Link to="/loginPage"> login </Link>
        <Link to="/ViewInventory" onClick={handleResetCategory}> View Inventory </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/cart" className="cart-link">
          <IoCartOutline size={32} /> {/* Use IoCartOutline from react-icons/io5 */}
          {Object.keys(cartItems).length > 0 && orderPlaced && (
            <span className="cart-notification" />
          )}
        </Link>
      </div>
    </div>
  );
};
