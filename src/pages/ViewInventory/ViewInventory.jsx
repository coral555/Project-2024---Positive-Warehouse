import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { clearCart } from "../../actions/cartActions";
import { useCombined } from "../../context/CombinedContext";
import { Product } from "../../components/product/product";
import "./ViewInventory.css";

export const View = () => {
  const {
    products,
    setProducts,
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
    isModalOpen,
    setIsModalOpen,
    selectedProductId,
    setSelectedProductId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    getRemainingQuantity,
    setSubCategories,
    clearQuantities,
    handleResetDates,
  } = useCombined();

  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [originalProducts, setOriginalProducts] = useState([]);
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setOriginalProducts(products);
  }, [products]);

  useEffect(() => {
    const initialStartDate = localStorage.getItem('startDate') ? parseInt(localStorage.getItem('startDate'), 10) : null;
    const initialEndDate = localStorage.getItem('endDate') ? parseInt(localStorage.getItem('endDate'), 10) : null;
  
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [setStartDate, setEndDate]);

  useEffect(() => {
    setSelectedProductId(null);
    setIsModalOpen(false);
  }, [setSelectedProductId, setIsModalOpen]);

  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find(cat => cat.name === category);
      if (selectedCategory && selectedCategory.subCategory) {
        setSubCategories(selectedCategory.subCategory);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  }, [category, categories, setSubCategories]);

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
      handleResetDates();
      const startDate = new Date(tempDate.setHours(0, 0, 0, 0)).getTime();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
      const endDateTimestamp = endDate.getTime();
      setStartDate(startDate);
      setEndDate(endDateTimestamp);
      localStorage.setItem('startDate', startDate.toString());
      localStorage.setItem('endDate', endDateTimestamp.toString());
      dispatch(clearCart());
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

  const remainingQuantities = useMemo(() => {
    return products.reduce((acc, product) => {
      const remainingQuantity = getRemainingQuantity(product.id, product.quantity);
      acc[product.id] = remainingQuantity;
      return acc;
    }, {});
  }, [products, getRemainingQuantity]);


  const handleReset = () => {
    handleResetDates();
    dispatch(clearCart());
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
        {startDate && <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>}
        {endDate && <p>End Date: {new Date(endDate).toLocaleDateString()}</p>}
        <button onClick={handleReset}>Reset Dates</button>
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

      {originalProducts.length > 0 ? (
        originalProducts.map((product) => (
          <div
            key={product.id}
            className={remainingQuantities[product.id] > 0 ? "" : "unavailable"}
          >
            <Link to={`/product/${product.id}`}>
              <Product
                data={{
                  ...product,
                  quantity: remainingQuantities[product.id],
                }}
              />
            </Link>
          </div>
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
