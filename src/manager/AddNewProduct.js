import React, { useState, useEffect } from 'react';
import { db, storage } from '../utility/firebase' ;
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fetchCategories, fetchSubcategories } from '../databaseFetches';
import './AddNewProduct.css';

const AddNewProduct = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ description: '', quantity: '', imageURL: '', name: '' });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            setCategories(categoriesData);
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadSubcategories = async () => {
            if (selectedCategory) {
                const subcategoriesData = await fetchSubcategories(selectedCategory);
                setSubcategories(subcategoriesData);
            } else {
                setSubcategories([]);
            }
        };
        loadSubcategories();
    }, [selectedCategory]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.quantity || !selectedCategory || !selectedSubcategory || !selectedFile) {
            alert('Please fill out all fields and select category/subcategory.');
            return;
        }

        try {
            const newImagePath = `products/${selectedFile.name}`;
            const storageRef = ref(storage, newImagePath);
            await uploadBytes(storageRef, selectedFile);
            const imageURL = await getDownloadURL(storageRef);

            const productData = {
                category: selectedCategory,
                subcategory: selectedSubcategory,
                name: newProduct.name,
                description: newProduct.description,
                quantity: parseInt(newProduct.quantity),
                imageURL: newImagePath,
            };

            const productsCollectionRef = collection(db, 'products');
            await addDoc(productsCollectionRef, productData);

            setNewProduct({ description: '', quantity: '', imageURL: '', name: '' });
            setSelectedCategory('');
            setSelectedSubcategory('');
            setSelectedFile(null);

            console.log('Product added successfully');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="add-product-container">
            <h3>הוספת מוצר</h3>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                <option value="">בחר תת קטגוריה</option>
                {subcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
            </select>
            <input
                type="text"
                name="description"
                placeholder="תיאור המוצר"
                value={newProduct.description}
                onChange={handleInputChange}
            />
            <input
                type="number"
                name="quantity"
                placeholder="כמות"
                value={newProduct.quantity}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="name"
                placeholder="שם המוצר"
                value={newProduct.name}
                onChange={handleInputChange}
            />
            <input
                type="file"
                onChange={handleImageChange}
            />
            <button onClick={handleAddProduct}>הוספת מוצר</button>
        </div>
    );
};

export default AddNewProduct;
