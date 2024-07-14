import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { clearCart } from "../../actions/cartActions";
import { useCombined } from "../../context/CombinedContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import "./ViewInventory.css";
import { Product } from '../../components/product/product'; // Adjust the path as necessary

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

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
    setSubCategory,
    isFetchingAll,
    setIsModalOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    getRemainingQuantity,
    setSubCategories,
    handleResetDates,
    sortBy,
    setSortBy,
  } = useCombined();

  const [tempDate, setTempDate] = useState(dayjs(startDate));
  const [endTempDate, setEndTempDate] = useState(dayjs(startDate).add(2, 'day'));
  const [originalProducts, setOriginalProducts] = useState([]);
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
    setIsModalOpen(false);
  }, [setIsModalOpen]);

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

  const handleCategoryChange = (category) => {
    setCategory(category);
    setSubCategory('');
  };

  const handleSubCategoryChange = (subCategory) => {
    setSubCategory(subCategory);
  };

  const handleStartDateChange = (date) => {
    handleReset();

    setTempDate(date);
    const newEndDate = date.add(2, 'day');
    setEndTempDate(newEndDate);
    setEndDate(newEndDate.startOf('day').valueOf());
  };

  const isPastDate = (date) => {
    const today = dayjs().startOf('day');
    return date.isBefore(today);
  };

  const remainingQuantities = products.reduce((acc, product) => {
    const remainingQuantity = getRemainingQuantity(product.id, product.quantity);
    acc[product.id] = remainingQuantity;
    return acc;
  }, {});

  const handleReset = () => {
    setTempDate(null);
    setEndDate(null);
    handleResetDates();
    dispatch(clearCart());
  };

  useEffect(() => {
    if (tempDate && tempDate.isValid() ) {
      const startDate = tempDate.startOf('day').valueOf();
      const endDate = tempDate.add(2, 'day').startOf('day').valueOf();
      setStartDate(startDate);
      setEndDate(endDate);
      localStorage.setItem('startDate', startDate.toString());
      localStorage.setItem('endDate', endDate.toString());

    }
  }, [tempDate, setStartDate, setEndDate,endTempDate ]);

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
        <p>שגיאה באחזור נתונים: {error.message}</p>
      </div>
    );
  }

  return (
    <section className="text-gray-600 body-font View" dir="rtl">
      <div className="container px-3 py-24 mx-auto flex mt-1">
        <div className="categories-container">
          <h2 className="category-title">קטגוריות</h2>
          <ul>
            <li onClick={() => handleCategoryChange('')} className="category-item">כל הקטגוריות</li>
            {categories.map((cat) => (
              <li key={cat.id} className="category-item" onClick={() => handleCategoryChange(cat.name)}>
                <div className="category-content">
                  <span className="category-name">{cat.name}</span> <FontAwesomeIcon icon={faCaretDown} />
                  <ul className="subcategories">
                    {cat.subCategory.map((subCat, index) => (
                      <li key={index} className="subcategory-item" onClick={() => handleSubCategoryChange(subCat)}>
                        {subCat} <FontAwesomeIcon icon={faCaretRight} />
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Sorting section */}
          <div className="sorting">
            <h2 className="font-bold mb-2">מיון לפי:</h2>
            <ul className="sorting-list">
              <li className={`sorting-item ${sortBy === 'quantity' ? 'active' : ''}`} onClick={() => setSortBy('quantity')}>כמות</li>
              <li className={`sorting-item ${sortBy === 'name' ? 'active' : ''}`} onClick={() => setSortBy('name')}>שם</li>
            </ul>
          </div>
        </div>
  
        <div className="content-container flex-1">
          <div className="flex flex-wrap w-full mb-4">
            <div className="w-full lg:w-1/2 mb-4 lg:mb-15">
              <h1 className="text-5xl font-medium title-font mb-1 text-green-700">צפיה במוצרים ויצירת הזמנות</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap w-full mb-2"> {/* Reduced mb-4 to mb-2 */}
          <div className="w-full lg:w-1/2 mb-2 lg:mb-0 flex items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex items-stretch space-x-2">
                <DatePicker
                  label="בחר תאריך התחלה"
                  value={tempDate}
                  onChange={handleStartDateChange}
                  shouldDisableDate={isPastDate}
                  renderInput={(params) => <TextField {...params} className="h-fulll" />} // Adjust classes and styles as needed
                  className="h-full"
                />
                <TextField
                  label="תאריך סיום"
                  value={endDate ? dayjs(endDate).format('DD/MM/YYYY') : ''}
                  InputProps={{
                    readOnly: true,
                  }}
                  className="h-full"
                />
              </div>
            </LocalizationProvider>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-end">
            <button className="custom-button" onClick={handleReset}>
              אפס תאריכים
            </button>
          </div>
        </div>
  
          <div className="products flex flex-wrap -m-4">
            {originalProducts.length > 0 ? (
              originalProducts.map((product) => (
                <div key={product.id} className="lg:w-1/4 md:w-1/2 p-4 w-full hover:translate-y-[-5px] transition-transform duration-300">
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
              <p className="w-full text-center">לא נמצאו מוצרים.</p>
            )}
          </div>
  
          <div className="w-full mt-4 flex justify-center">
            {isFetchingAll ? (
              <button
                className="load-more-button"
                onClick={fetchMoreProducts}
                disabled={isFetchingMore}
              >
                טען עוד
              </button>
            ) : (
              <footer className="no-products text-gray-500">אין עוד מוצרים להצגה</footer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default View;
