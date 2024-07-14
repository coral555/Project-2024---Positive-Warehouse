import React, { useState, useReducer } from 'react';
import './EditInventory.css';
import { useCombined } from '../../../context/CombinedContext';
import Modal from 'react-modal';
import ProductItem from '../../components/ProductItem/ProductItem';
import { initialState, reducer } from '../../reducers/manegerIndex';
import {
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
         // Update the products array in the context
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
        // Update the products array in the context
        const updatedProducts = products.map(product =>
            product.id === currentProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts); // <-- Ensure this is called to update state

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
            width: '25%', 
            height: '30%', 
            padding: '20px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
    };

    return (
        <div className="edit-inventory-container1">
            <h2>ערוך מלאי</h2>
            <div className="search-container1">
                <select value={state.selectedCategory} onChange={handleCategoryChange}>
                    <option value="">קטגוריות</option>
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
                <option value="">תתי קטגוריות</option>
                {subCategories.map((subCat, index) => (
                    <option key={index} value={subCat}>
                        {subCat}
                    </option>
                ))}
                </select>
            </div>
            <div className="products-container1">
                {isFetchingMore ? (
                    <p>טוען...</p>
                ) : (
                    <section className="text-gray-600 body-font">
                      <div className="container px-5 py-24 mx-auto">
                        <div className="flex flex-wrap -m-4">
                          {products.map((product) => ( //was {products.map((product, index) => (
                            <ProductItem
                                key={product.id} //was key={index}
                                product={product}
                                handleDeleteProduct={handleDeleteProductWrapper}
                                handleDescriptionEdit={handleDescriptionEdit}
                                handleQuantityEdit={handleQuantityEdit}
                                handleImageClick={handleImageClick}
                                imageURL={imageURLs[product.id] || product.imageURL || 'https://dummyimage.com/420x260'}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                )}
            </div> 
            {products.length === 0 && !isFetchingAll && <p className="no-products1">אין מוצרים להצגה</p>}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Field"
                style={customModalStyles}
            >
                <h2>עריכת {currentField == "quantity"? "כמות" : "תיאור"}</h2>
                {currentField && currentProduct && (
                    <input className='modal-input'
                        type={currentField === 'quantity' ? 'number' : 'text'}
                        value={currentValue}
                        onChange={(event) => {
                            if (currentField === 'quantity') {
                                handleQuantityChangeWrapper(event);
                            } else {
                                handleDescriptionChangeWrapper(event);
                            }
                        }}
                        style={{
                            width: '70%', 
                            padding: '11px',
                            margin: '10px 0', 
                            borderRadius: '5px', 
                            border: '1px solid #ddd', 
                            
                        }}
                    />
                )}
                <div className="modal-buttons1">
                    <button onClick={closeModal}>ביטול</button>
                    <button onClick={handleSubmitEdit}>אישור</button>
                </div>
            </Modal>
            <Modal
                isOpen={deleteConfirmation.isOpen}
                onRequestClose={cancelDeleteProduct}
                contentLabel="Confirm Delete1"
                style={customModalStyles}
            >
                <h2>אשר מחיקה</h2> 
                <p className='conform-delete1'>האם אתה בטוח שברצונך למחוק את הפריט: {deleteConfirmation.product && deleteConfirmation.product.name}</p>
                <div className="modal-buttons1">
                    <button onClick={confirmDeleteProduct}>מחק</button>
                    <button onClick={cancelDeleteProduct}>ביטול</button>
                </div>
            </Modal> 
            <div className="load-more1">
                {isFetchingAll ? (
                    <button className="load-more-button1" onClick={fetchMoreProducts} disabled={isFetchingMore}>
                        {isFetchingMore ? 'טוען...' : 'טען עוד מוצרים'}
                    </button>
                ) : (
                    <footer className="no-products1">אין עוד מוצרים</footer>
                )}
            </div>
        </div>
    );
};

export default EditInventory;
