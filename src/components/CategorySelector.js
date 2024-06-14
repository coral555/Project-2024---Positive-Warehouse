// src/components/CategorySelector.js
import React from 'react';

function CategorySelector({ categories, selectedCategory, handleCategoryChange }) {
  return (
    <select value={selectedCategory} onChange={handleCategoryChange}>
      <option value="all">Display All</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>{category.id}</option>
      ))}
    </select>
  );
}

export default React.memo(CategorySelector);