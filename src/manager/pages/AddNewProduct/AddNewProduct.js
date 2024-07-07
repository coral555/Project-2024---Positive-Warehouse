import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../utils/firebase';
import { collection,doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useCombined } from '../../../context/CombinedContext';
import './AddNewProduct.css';
 
const AddNewProduct = () => {
    const { categories, subCategories, fetchCategories, fetchSubcategories } = useCombined();
    const [newProduct, setNewProduct] = useState({ description: '', quantity: '', imageURL: '', name: '' });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState([]);


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
            
            alert('המוצר נוסף בהצלחה');
            console.log('Product added successfully');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) {
            alert('Please enter a category name.');
            return;
        }

        try {
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categoryQuery = query(categoriesCollectionRef, where('name', '==', newCategory));
            const querySnapshot = await getDocs(categoryQuery);

            if (querySnapshot.empty) {
                await addDoc(categoriesCollectionRef, { name: newCategory, subcategory: [] });
                setNewCategory('');
                alert('קטגוריה חדשה נוספה בהצלחה');
            } else {
                alert('Category already exists.');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddSubcategory = async () => {
        if (!selectedCategory || !newSubcategory) {
            alert('Please select a category and enter a subcategory name.');
            return;
        }

        try {
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categoryQuery = query(categoriesCollectionRef, where('name', '==', selectedCategory));
            const querySnapshot = await getDocs(categoryQuery);

            if (!querySnapshot.empty) {
                const categoryDoc = querySnapshot.docs[0];
                const categoryRef = doc(db, 'קטגוריות', categoryDoc.id);
                const categoryData = categoryDoc.data();

                if (!categoryData.subcategory.includes(newSubcategory)) {
                    const updatedSubcategories = [...categoryData.subcategory, newSubcategory];
                    await updateDoc(categoryRef, { subcategory: updatedSubcategories });
                    fetchSubcategories(selectedCategory);
                    setNewSubcategory('');
                    alert('תת קטגוריה חדשה נוספה בהצלחה');
                } else {
                    alert('Subcategory already exists.');
                }
            } else {
                alert('Category not found.');
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    const handleRemoveCategory = async () => {
        if (!selectedCategory) {
            alert('Please select a category to remove.');
            return;
        }
        try {
            const productsCollectionRef = collection(db, 'products');
            const q = query(productsCollectionRef, where('category', '==', selectedCategory));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categoryQuery = query(categoriesCollectionRef, where('name', '==', selectedCategory));
            const categorySnapshot = await getDocs(categoryQuery);
            
            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                await deleteDoc(doc(db, 'קטגוריות', categoryDoc.id));
                setSelectedCategory('');
                alert('Category and its products removed successfully');
            } else {
                alert('Category not found');
            }
        } catch (error) {
            console.error('Error removing category and its products:', error);
        }
    };

    const handleRemoveSubcategory = async () => {
        if (!selectedCategory || !selectedSubcategory) {
            alert('Please select a category and subcategory to remove.');
            return;
        }
        try {
            const productsCollectionRef = collection(db, 'products');
            const q = query(productsCollectionRef, where('category', '==', selectedCategory), where('subcategory', '==', selectedSubcategory));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categoryQuery = query(categoriesCollectionRef, where('name', '==', selectedCategory));
            const categorySnapshot = await getDocs(categoryQuery);
            
            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                const categoryRef = doc(db, 'קטגוריות', categoryDoc.id);
                const categoryData = categoryDoc.data();

                const updatedSubcategories = categoryData.subcategory.filter(subcategory => subcategory !== selectedSubcategory);
                await updateDoc(categoryRef, { subcategory: updatedSubcategories });
                fetchSubcategories(selectedCategory);
                setSelectedSubcategory('');
                alert('Subcategory and its products removed successfully');
            } else {
                alert('Category not found');
            }
        } catch (error) {
            console.error('Error removing subcategory and its products:', error);
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
            <button onClick={handleAddProduct}>הוספת מוצר</button>
            
            <div className="category-management">
                <h3>ניהול קטגוריות ותת קטגוריות</h3>
                <input
                    type="text"
                    placeholder="קטגוריה חדשה"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleAddCategory}>הוספת קטגוריה</button>
                <button onClick={handleRemoveCategory}>הסרת קטגוריה</button>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">בחר קטגוריה להסרה</option>
                    {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
                </select>
                <input
                    type="text"
                    placeholder="תת קטגוריה חדשה"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                />
                <button onClick={handleAddSubcategory}>הוספת תת קטגוריה</button>
                <button onClick={handleRemoveSubcategory}>הסרת תת קטגוריה</button>
                <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                    <option value="">בחר תת קטגוריה להסרה</option>
                    {subCategories.map((subCat, index) => (
            <option key={index} value={subCat}>
              {subCat}
            </option>
          ))}
                </select>
            </div>
        </div>
    );
};

export default AddNewProduct;
