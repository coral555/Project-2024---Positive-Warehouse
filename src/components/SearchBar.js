// src/components/SearchBar.js
import React, { useCallback } from 'react';
import debounce from 'lodash.debounce';

function SearchBar({ searchTerm, handleSearchChange }) {
  const debouncedChangeHandler = useCallback(
    debounce(handleSearchChange, 300),
    []
  );

  return (
    <input 
      type="text"
      placeholder="Search by description..."
      defaultValue={searchTerm}
      onChange={debouncedChangeHandler}
    />
  );
}

export default React.memo(SearchBar);
