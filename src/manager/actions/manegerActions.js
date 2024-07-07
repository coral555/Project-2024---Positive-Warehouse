// src/manager/reducers/actions.js

export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_SELECTED_CATEGORY = 'SET_SELECTED_CATEGORY';
export const SET_SELECTED_SUBCATEGORY = 'SET_SELECTED_SUBCATEGORY';
export const SET_EDITED_PRODUCTS = 'SET_EDITED_PRODUCTS';

export const setSearchTerm = (term) => ({
    type: SET_SEARCH_TERM,
    payload: term,
});

export const setSelectedCategory = (category) => ({
    type: SET_SELECTED_CATEGORY,
    payload: category,
});

export const setSelectedSubcategory = (subcategory) => ({
    type: SET_SELECTED_SUBCATEGORY,
    payload: subcategory,
});

export const setEditedProducts = (product) => ({
    type: SET_EDITED_PRODUCTS,
    payload: product,
});
