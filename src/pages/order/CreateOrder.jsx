import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Product } from "../../components/product/product";
import QuantityModal from "../../components/QuantityModal/QuantityModal";
import { addToCart } from "../../actions/cartActions";
import { useCombined } from "../../context/CombinedContext";
import "./CreateOrder.css";

export const CreateOrder = () => {
  const {
    products,
    categories,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    isModalOpen,
    setIsModalOpen,
    selectedProductId,
    setSelectedProductId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleAddToCart: addToCartContext,
    getRemainingQuantity,
    fetchMoreProducts,
    isFetchingMore,
    subCategories,
    setSubCategories,
    isFetchingAll,
  } = useCombined();

  const [selectedProductQuantity, setSelectedProductQuantity] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialStartDate = useMemo(() => {
    return location.state?.startDate ? new Date(location.state.startDate).toLocaleDateString() : null;
  }, [location.state?.startDate]);

  const initialEndDate = useMemo(() => {
    return location.state?.endDate ? new Date(location.state.endDate).toLocaleDateString() : null;
  }, [location.state?.endDate]);

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate, setStartDate, setEndDate]);

  useEffect(() => {
    setSelectedProductId(null);
    setIsModalOpen(false);
    setSelectedProductQuantity(0);
  }, [setSelectedProductId, setIsModalOpen, setSelectedProductQuantity]);

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
    setSubCategory(''); // Reset subcategory when category changes
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
  };

  const remainingQuantities = useMemo(() => {
    return products.reduce((acc, product) => {
      const remainingQuantity = getRemainingQuantity(product.id, product.quantity);
      acc[product.id] = remainingQuantity;
      return acc;
    }, {});
  }, [products, getRemainingQuantity]);

  const handleAddToCartClick = (product) => {
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

  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="CreateOrder">
      <div className="CreateOrderTitle">
        <h1>Positive Inventory</h1>
        {startDate && <p>Start Date: {startDate}</p>}
        {endDate && <p>End Date: {endDate}</p>}
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
      </div>

      <div className="products">
        {products.map((product) => {
          const remainingQuantity = remainingQuantities[product.id];
          return (
            <div
              key={product.id}
              onClick={() => handleAddToCartClick(product)}
              className={remainingQuantity > 0 ? "" : "unavailable"}
            >
              <Product
                data={{
                  ...product,
                  quantity: remainingQuantity,
                }}
              />
            </div>
          );
        })}
      </div>

      <QuantityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddProductToCart}
      />
      <button onClick={handleGoToCart}>Go to Cart</button>

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

export default CreateOrder;
