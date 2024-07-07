import React, { useState, useReducer,useCallback } from 'react';
import './EditInventory.css';
import { useCombined } from '../../../context/CombinedContext';
import Modal from 'react-modal';
import ProductItem from '../../components/ProductItem/ProductItem';
import { initialState, reducer } from '../../reducers/manegerIndex';
import {setSearchTerm, setSelectedCategory,setSelectedSubcategory,setEditedProducts,} from '../../actions/manegerActions';
import {handleDescriptionChange,handleQuantityChange,handleImageChange,handleDeleteProduct,} from '../../../utils/manegerUdpates';

const EditInventory = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        products,
        categories,
        subCategories,
        fetchMoreProducts,
        isFetchingMore,
        setCategory,
        setSubCategory,
        isFetchingAll,
        fetchCategories,
        fetchSubcategories,
        fetchProducts,
    } = useCombined();
    const [imageURLs, setImageURLs] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentValue, setCurrentValue] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState({isOpen: false,product: null,});

   // Function to refresh all data
   const refreshData = useCallback(async () => {
    try {
        // Reset component state to initial values
        dispatch({ type: 'RESET_STATE', payload: initialState });

        // Fetch categories, subcategories, and products
        await fetchCategories();

        // Fetch subcategories and products based on the selected category
        if (state.selectedCategory) {
            await fetchSubcategories(state.selectedCategory);
            await fetchProducts(state.selectedCategory, state.selectedSubcategory);
        } else {
            await fetchProducts(); // Fetch all products if no category is selected
        }
        console.log('refreshed');
    } catch (error) {
        console.error('Error refreshing data:', error);
    }
}, [fetchCategories, fetchSubcategories, fetchProducts, state.selectedCategory, state.selectedSubcategory]);


    const handleCategoryChange = (event) => {
        dispatch(setSelectedCategory(event.target.value));
        setCategory(event.target.value);
        setSubCategory('');
    };

    const handleSubcategoryChange = (event) => {
        dispatch(setSelectedSubcategory(event.target.value));
        setSubCategory(event.target.value);
    };

    const handleDescriptionEdit = (product) => {
        toggleEditableField('description', product);
    };

    const handleQuantityEdit = (product) => {
        toggleEditableField('quantity', product);
    };

    const handleDescriptionChangeWrapper = (event) => {
        setCurrentValue(event.target.value);
    };

    const handleQuantityChangeWrapper = (event) => {
        setCurrentValue(event.target.value);
    };

    const handleImageChangeWrapper = (product, event) => {
        handleImageChange(product, event.target.files[0]);
    };

    const handleDeleteProductWrapper = (product) => {
        setDeleteConfirmation({ isOpen: true, product });
    };

    const confirmDeleteProduct = () => {
        handleDeleteProduct(deleteConfirmation.product, setImageURLs);
        setDeleteConfirmation({ isOpen: false, product: null });
    };

    const cancelDeleteProduct = () => {
        setDeleteConfirmation({ isOpen: false, product: null });
    };

    const toggleEditableField = (field, product) => {
        setCurrentField(field);
        setCurrentProduct(product);
        setCurrentValue(field === 'quantity' ? product.quantity : product.description);
        setModalIsOpen(true);
    };

    const handleImageClick = (productId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (event) => handleImageChangeWrapper({ id: productId }, event);
        input.click();
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentField(null);
        setCurrentProduct(null);
        setCurrentValue('');
    };

    const handleSubmitEdit = () => {
        const updatedProduct = { ...currentProduct, [currentField]: currentValue };

        if (currentField === 'quantity') {
            handleQuantityChange(currentProduct, currentValue);
        } else {
            handleDescriptionChange(currentProduct, currentValue);
        }

        dispatch(setEditedProducts({ [currentProduct.id]: updatedProduct }));

        closeModal();
    };

    return (
        <div className="edit-inventory-container">
            <h2>ערוך מלאי</h2>
            <div className="refresh-container">
                <button className="refresh-button" onClick={refreshData}>רענן נתונים</button>
            </div>
            <div className="search-container">
                <select value={state.selectedCategory} onChange={handleCategoryChange}>
                    <option value="">בחר קטגוריה</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    value={state.selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    disabled={!state.selectedCategory}
                >
                    <option value="">בחר תת-קטגוריה</option>
                    {subCategories.map((subCat, index) => (
                        <option key={index} value={subCat}>
                            {subCat}
                        </option>
                    ))}
                </select>
            </div>
            <div className="products-container">
                {isFetchingMore ? (<p>טוען את הדף...</p>) : (
                    products.map((product) => {
                        const editedProduct = state.editedProducts[product.id] || product;
                        return (
                            <ProductItem
                                key={product.id}
                                product={editedProduct}
                                handleDeleteProduct={handleDeleteProductWrapper}
                                handleDescriptionEdit={handleDescriptionEdit}
                                handleQuantityEdit={handleQuantityEdit}
                                handleImageClick={handleImageClick}
                                imageURL={imageURLs[editedProduct.id] || editedProduct.imageURL || 'placeholder.jpg'}
                            />
                        );
                    })
                )}
            </div>
            {products.length === 0 && !isFetchingAll && <p className="no-products">אין מוצרים להצגה</p>}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Field"
                className="small-modal"
                overlayClassName="small-modal-overlay"
            >
                <h2>{currentField === 'description' ? 'ערוך תיאור' : (currentField === 'quantity' ? 'ערוך כמות' : '')}</h2>
                {currentField && currentProduct && (
                    <input
                        type={currentField === 'quantity' ? 'number' : 'text'}
                        value={currentValue}
                        onChange={(event) => {
                            if (currentField === 'quantity') {
                                handleQuantityChangeWrapper(event);
                            } else {
                                handleDescriptionChangeWrapper(event);
                            }
                        }}
                    />
                )}
                <button onClick={handleSubmitEdit}>אשר</button>
                <button onClick={closeModal}>ביטול</button>
            </Modal>
            <Modal
                isOpen={deleteConfirmation.isOpen}
                onRequestClose={cancelDeleteProduct}
                contentLabel="Confirm Delete"
                className="small-modal"
                overlayClassName="small-modal-overlay"
            >
                <h2>אשר מחיקה</h2>
                <p>האם אתה בטוח שברצונך למחוק את המוצר: {deleteConfirmation.product && deleteConfirmation.product.description}?</p>
                <div>
                    <button onClick={confirmDeleteProduct}>אשר מחיקה</button>
                    <button onClick={cancelDeleteProduct}>ביטול</button>
                </div>
            </Modal>
            <div className="load-more">
                {isFetchingAll ? (
                    <button className="load-more-button" onClick={fetchMoreProducts} disabled={isFetchingMore}>
                        {isFetchingMore ? 'טוען את המוצרים...' : 'טען עוד מוצרים'}
                    </button>
                ) : (
                    <footer className="no-products">אין עוד מוצרים</footer>
                )}
            </div>
        </div>
    );
};

export default EditInventory;
