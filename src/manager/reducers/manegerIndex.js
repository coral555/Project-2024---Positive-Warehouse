import {
    SET_SEARCH_TERM,
    SET_SELECTED_CATEGORY,
    SET_SELECTED_SUBCATEGORY,
    SET_EDITED_PRODUCTS,
} from '../actions/manegerActions';

export const initialState = {
    searchTerm: '',
    selectedCategory: '',
    selectedSubcategory: '',
    editedProducts: {},
};

export const reducer = (state, action) => {
    switch (action.type) {
        case SET_SEARCH_TERM:
            return { ...state, searchTerm: action.payload };
        case SET_SELECTED_CATEGORY:
            return { ...state, selectedCategory: action.payload, selectedSubcategory: '' };
        case SET_SELECTED_SUBCATEGORY:
            return { ...state, selectedSubcategory: action.payload };
        case SET_EDITED_PRODUCTS:
            return { ...state, editedProducts: { ...state.editedProducts, ...action.payload } };
        default:
            return state;
    }
};
