import React from "react";
import { Link } from "react-router-dom";
import { useCombined } from "../../context/CombinedContext";
import { Product } from "../../components/product/product";
import ClipLoader from "react-spinners/ClipLoader";
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

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSubCategory(''); 
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
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
      </div>

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
