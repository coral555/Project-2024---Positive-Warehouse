import React, { useState, useReducer } from 'react';
import './EditInventory.css';
import { useCombined } from '../../../context/CombinedContext';
import Modal from 'react-modal';
import ProductItem from '../../components/ProductItem/ProductItem';

import { initialState, reducer } from '../../reducers/manegerIndex';
import {
    setSearchTerm,
    setSelectedCategory,
    setSelectedSubcategory,
    setEditedProducts,
} from '../../actions/manegerActions';
import {
    handleDescriptionChange,
    handleQuantityChange,
    handleImageChange,
    handleDeleteProduct,
} from '../../../utils/manegerUdpates';

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
        setProducts,
    } = useCombined();
    const [imageURLs, setImageURLs] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentValue, setCurrentValue] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        product: null,
    });

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
        const updatedProducts = products.filter(product => product.id !== deleteConfirmation.product.id);
        setProducts(updatedProducts);  
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
        dispatch(setEditedProducts({[currentProduct.id]: updatedProduct }));
        closeModal();
    };
    const customModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '130px',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',

        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
    };
    return (
        <div className="edit-inventory-container">
            <h2>ערוך מלאי</h2>
            <div className="search-container">
                <select value={state.selectedCategory} onChange={handleCategoryChange}>
                    <option value="">בהכל</option>
                    {categories.map((category) => (
                        <option key={category} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    value={state.selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    disabled={!state.selectedCategory}
                >
                    <option value="">All Subcategories</option>
                    {subCategories.map((subCat, index) => (
                        <option key={index} value={subCat}>
                            {subCat}
                        </option>
                    ))}
                </select>
            </div>
            <div className="products-container">
                {isFetchingMore ? (
                    <p>Loading...</p>
                ) : (
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
                style={customModalStyles}
            >
                <h2>Edit {currentField}</h2>
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
                <button onClick={handleSubmitEdit}>Submit</button>
                <button onClick={closeModal}>Close</button>
            </Modal>
            <Modal
                isOpen={deleteConfirmation.isOpen}
                onRequestClose={cancelDeleteProduct}
                contentLabel="Confirm Delete"
                style={customModalStyles}
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
                        {isFetchingMore ? 'Loading...' : 'Load More'}
                    </button>
                ) : (
                    <footer className="no-products">No products left</footer>
                )}
            </div>
        </div>
    );
};

export default EditInventory;
