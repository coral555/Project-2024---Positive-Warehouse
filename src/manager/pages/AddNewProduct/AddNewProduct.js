import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../../../utils/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import '../AddNewProduct/AddNewProduct.css';
import { Button } from 'react-bootstrap';

const AddNewProduct = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ description: '', quantity: '', imageURL: '', name: '' });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categorySnapshot = await getDocs(categoriesCollectionRef);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoryList);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const fetchSubcategories = useCallback(async (categoryName) => {
        try {
            const categoryDocRef = query(collection(db, 'קטגוריות'), where('name', '==', categoryName));
            const categorySnapshot = await getDocs(categoryDocRef);

            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                setSubCategories(categoryDoc.data().subcategory || []);
            } else {
                setSubCategories([]);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory);
        }
    }, [selectedCategory, fetchSubcategories]);

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
            alert('עליך למלא את כל השדות.');
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
                imageURL: imageURL,
            };

            const productsCollectionRef = collection(db, 'products');
            await addDoc(productsCollectionRef, productData);

            setNewProduct({ description: '', quantity: '', imageURL: '', name: '' });
            setSelectedCategory('');
            setSelectedSubcategory('');
            setSelectedFile(null);

            alert('המוצר נוסף בהצלחה');
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
                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
            <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                <option value="">בחר תת קטגוריה</option>
                {subCategories.map((subCat, index) => (
                    <option key={index} value={subCat}>
                        {subCat}
                    </option>
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
            {/* <button onClick={handleAddProduct}>הוספת מוצר</button> */}
            <Button variant="link" onClick={handleAddProduct}>הוספת מוצר</Button>
        </div>
    );
};

export default AddNewProduct;