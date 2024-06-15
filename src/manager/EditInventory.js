import React, { useState, useEffect, useReducer, useCallback } from 'react';
import './EditInventory.css';
import { Link } from 'react-router-dom';
import { db } from '../components/firebase_config';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { fetchCategories, fetchSubcategories, fetchAllProducts } from '../databaseFetches';

const initialState = {
    categories: [],
    subcategories: [],
    products: [],
    searchTerm: '',
    selectedCategory: 'all',
    selectedSubcategory: 'all',
    editedProducts: {},
    isLoading: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload };
        case 'SET_SUBCATEGORIES':
            return { ...state, subcategories: action.payload };
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload };
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        case 'SET_SELECTED_CATEGORY':
            return { ...state, selectedCategory: action.payload, selectedSubcategory: 'all' };
        case 'SET_SELECTED_SUBCATEGORY':
            return { ...state, selectedSubcategory: action.payload };
        case 'SET_EDITED_PRODUCTS':
            return { ...state, editedProducts: { ...state.editedProducts, ...action.payload } };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

const EditInventory = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [imageURLs, setImageURLs] = useState({});
    
    useEffect(() => {
        const loadCategories = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const categoriesData = await fetchCategories();
                dispatch({ type: 'SET_CATEGORIES', payload: categoriesData });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadSubcategories = async () => {
            if (state.selectedCategory && state.selectedCategory !== 'all') {
                try {
                    const subcategoriesData = await fetchSubcategories(state.selectedCategory);
                    dispatch({ type: 'SET_SUBCATEGORIES', payload: subcategoriesData });
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            } else {
                dispatch({ type: 'SET_SUBCATEGORIES', payload: [] });
            }
        };
        loadSubcategories();
    }, [state.selectedCategory]);

    useEffect(() => {
        const loadAllProducts = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const productsData = await fetchAllProducts();
                const storage = getStorage();
                const updatedProducts = await Promise.all(productsData.map(async product => {
                    if (product.imageURL) {
                        const imageRef = ref(storage, product.imageURL);
                        try {
                            const url = await getDownloadURL(imageRef);
                            return { ...product, imageURL: url };
                        } catch (error) {
                            console.log(`Image not found for product ${product.name}. Displaying without picture.`);
                            return { ...product, imageURL: null };
                        }
                    } else {
                        return { ...product, imageURL: null };
                    }
                }));
                dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        loadAllProducts();
    }, []);

    // useEffect(() => {
    //     const loadAllProducts = async () => {
    //         dispatch({ type: 'SET_LOADING', payload: true });
    //         try {
    //             const productsData = await fetchAllProducts();
    //             dispatch({ type: 'SET_PRODUCTS', payload: productsData });

    //             const storage = getStorage();
    //             const updatedProducts = [];

    //             for (let i = 0; i < productsData.length; i++) {
    //                 const product = productsData[i];
    //                 if (product.imageURL) {
    //                     const imageRef = ref(storage, product.imageURL);
    //                     const url = await getDownloadURL(imageRef);
    //                     updatedProducts.push({ ...product, imageURL: url });
    //                 } else {
    //                     updatedProducts.push({ ...product, imageURL: null });
    //                 }
    //             }

    //             dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    //         } finally {
    //             dispatch({ type: 'SET_LOADING', payload: false });
    //         }
    //     };
    //     loadAllProducts();
    // }, []);


    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearchChange = debounce((event) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value });
    }, 300);

    const handleCategoryChange = (event) => {
        dispatch({ type: 'SET_SELECTED_CATEGORY', payload: event.target.value });
    };

    const handleSubcategoryChange = (event) => {
        dispatch({ type: 'SET_SELECTED_SUBCATEGORY', payload: event.target.value });
    };

    const filterProducts = useCallback(() => {
        return state.products.filter(product => {
            const productDescription = product.description ? product.description.toLowerCase() : '';
            return (state.selectedCategory === 'all' || product.category === state.selectedCategory) &&
                (state.selectedSubcategory === 'all' || product.subcategory === state.selectedSubcategory) &&
                productDescription.includes(state.searchTerm.toLowerCase());
        });
    }, [state.products, state.selectedCategory, state.selectedSubcategory, state.searchTerm]);

    
    const handleDescriptionChange = async (productFields, event) => {
        const { value } = event.target;
        try {
            // Construct a query to find the product based on category, subcategory, and name
            const productQuery = query(
                collection(db, 'products'),
                where('category', '==', productFields.category),
                where('subcategory', '==', productFields.subcategory),
                where('name', '==', productFields.name)
            );
            
            const querySnapshot = await getDocs(productQuery);
            
            if (querySnapshot.empty) {
                throw new Error('Product not found');
            }
            
            // Update the description for the first document found (assuming there's only one)
            const productDoc = querySnapshot.docs[0];
            await updateDoc(productDoc.ref, { description: value });
            
            console.log('Product description updated successfully');
        } catch (error) {
            console.error('Error updating product description:', error);
        }
    };

    const handleQuantityChange = async (productFields, event) => {
        const { value } = event.target;
        try {
            // Construct a query to find the product based on category, subcategory, and name
            const productQuery = query(
                collection(db, 'products'),
                where('category', '==', productFields.category),
                where('subcategory', '==', productFields.subcategory),
                where('name', '==', productFields.name)
            );
            
            const querySnapshot = await getDocs(productQuery);
            
            if (querySnapshot.empty) {
                throw new Error('Product not found');
            }
            
            // Update the quantity for the first document found (assuming there's only one)
            const productDoc = querySnapshot.docs[0];
            await updateDoc(productDoc.ref, { quantity: value });
            
            console.log('Product quantity updated successfully');
        } catch (error) {
            console.error('Error updating product quantity:', error);
        }
    };

    const handleImageChange = async (productFields, event) => {
        const file = event.target.files[0];
        if (!file) return; // No file selected
    
        try {
            // Construct a query to find the product based on category, subcategory, and name
            const productQuery = query(
                collection(db, 'products'),
                where('category', '==', productFields.category),
                where('subcategory', '==', productFields.subcategory),
                where('name', '==', productFields.name)
            );
    
            const querySnapshot = await getDocs(productQuery);
    
            if (querySnapshot.empty) {
                throw new Error('Product not found');
            }
    
            // Get the document reference
            const productDoc = querySnapshot.docs[0];
            const productData = productDoc.data();
    
            // Delete the old image from Firebase Storage if it exists
            if (productData.imageURL) {
                const oldImageRef = ref(getStorage(), productData.imageURL);
                await deleteObject(oldImageRef);
            }
    
            // Upload the new image
            const newImagePath = `products/${file.name}`;
            const storageRef = ref(getStorage(), `products/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            // Get the download URL of the new image
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Optional: Handle upload progress
                },
                (error) => {
                    console.error('Error uploading image:', error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        // Update the Firestore document with the new image URL
                        await updateDoc(productDoc.ref, { imageURL: newImagePath });
                        console.log('Product imageURL updated successfully');
                    } catch (error) {
                        console.error('Error updating product imageURL:', error);
                    }
                }
            );
        } catch (error) {
            console.error('Error updating product image:', error);
        }
    };

    
    const handleDeleteProduct = async (productFields) => {
        if (!productFields) {
            console.error('Invalid product:', productFields);
            return;
        }
    
        try {
            // Construct a query to find the product based on category, subcategory, and name
            const productQuery = query(
                collection(db, 'products'),
                where('category', '==', productFields.category),
                where('subcategory', '==', productFields.subcategory),
                where('name', '==', productFields.name)
            );
            const querySnapshot = await getDocs(productQuery);
            // Check if the product exists
            if (querySnapshot.empty) {
                console.error('Product not found');
                return;
            }

            // Assume there's only one matching document
            const productDoc = querySnapshot.docs[0];
            const productDocRef = doc(db, 'products', productDoc.id);

            // Delete the document
            await deleteDoc(productDocRef);

            // Reference to Firebase Storage
            const storage = getStorage();
            const imageRef = ref(storage, productFields.imageURL);

            try{
                // Delete the image from Firebase Storage
                await deleteObject(imageRef);
            }catch(error){
                console.error('Error deleting image:', error);
            }
            // Remove the image URL from the state if it exists
            setImageURLs((prev) => {
                const updated = { ...prev };
                delete updated[productFields.id];
                return updated;
            });
    
            console.log('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    

    return (
        <div className="edit-inventory-container">
            <Link to="/">
                <button>Back to Home</button>
            </Link>
            <Link to="/AddNewProduct">
                <button>Add New Product</button>
            </Link>
            <h2>Edit Inventory</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="חפש על ידי תיאור"
                    defaultValue={state.searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={state.selectedCategory} onChange={handleCategoryChange}>
                    <option value="all">Select Category</option>
                    {state.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select value={state.selectedSubcategory} onChange={handleSubcategoryChange}>
                    <option value="all">Select Subcategory</option>
                    {state.selectedCategory !== 'all' && state.subcategories.map(subcategory => (
                        <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                </select>
            </div>
            <div className="products-container">
                {state.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    filterProducts().map(product => (
                        <div key={product.id} className="product-item">
                            {product.imageURL ? (
                                <img src={product.imageURL} alt={product.description} />
                            ) : (
                                <div className="no-image">No Image Available</div>
                            )}
                            <input
                                type="text"
                                name="description"
                                defaultValue={state.editedProducts[product.id]?.description || product.description}
                                onBlur={(e) => handleDescriptionChange(product, e)}
                            />
                            <input
                                type="number"
                                name="quantity"
                                defaultValue={state.editedProducts[product.id]?.quantity || product.quantity}
                                onBlur={(e) => handleQuantityChange(product, e)}
                            />
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(product, e)}
                            />
                            <button onClick={() => handleDeleteProduct(product)}>Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EditInventory;







