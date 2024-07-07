import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useCombined } from "../../context/CombinedContext";
import { Product } from "../../components/product/product";
import { useDispatch } from "react-redux";
import { clearCart } from "../../actions/cartActions";
import "./ViewInventory.css";

export const View = () => {
  const {
    products,
    categories,
    loading,
    error,
    fetchMoreProducts,
    isFetchingMore,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    subCategories,
    isFetchingAll,
  } = useCombined();
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSubCategory('');
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
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

  if (loading) {
    return (
      <div className="loading">
        <ClipLoader size={100} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error fetching data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="storage">
      <div className="storageTitle">
        <h1>Positive Inventory</h1>
      </div>

      <div className="filters">
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={subCategory} onChange={handleSubCategoryChange} disabled={!category}>
          <option value="">All Subcategories</option>
          {subCategories.map((subCat, index) => (
            <option key={index} value={subCat}>
              {subCat}
            </option>
          ))}
        </select>
        <a href="#" className="create-order-link" onClick={handleCreateOrderClick}>
          Create Order
        </a>
      </div>

      {showCalendar && (
        <div className="calendar-dropdown" ref={calendarRef}>
          <DatePicker
            selected={tempDate}
            onChange={handleDateChange}
            inline
            filterDate={(date) => !isPastDate(date)}
            dayClassName={dayClassName}
          />
          <button onClick={handleConfirmDate}>Confirm Date</button>
        </div>
      )}

      <div className="products">
        {products.length > 0 ? (
          products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <Product data={product} />
            </Link>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <div className="load-more">
        {isFetchingAll ? (
          <button className="load-more-button" onClick={fetchMoreProducts} disabled={isFetchingMore}>
            {isFetchingMore ? 'Loading...' : 'Load More'}
          </button>
        ) : (
          <footer className="no-products">No products left</footer>
        )}
      </div>
    </div>
  );
};

export default View;
