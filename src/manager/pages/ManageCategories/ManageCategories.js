import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../utils/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import '../ManageCategories/ManageCategories.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

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

    const handleAddCategory = async () => {
        if (!newCategory) {
            alert('בחר קטגוריה.');
            return;
        }

        try {
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categoryQuery = query(categoriesCollectionRef, where('name', '==', newCategory));
            const querySnapshot = await getDocs(categoryQuery);

            if (querySnapshot.empty) {
                await addDoc(categoriesCollectionRef, { name: newCategory, subcategory: [] });
                setNewCategory('');
                fetchCategories(); // Refresh categories list
                alert('קטגוריה חדשה נוספה בהצלחה.');
            } else {
                alert('קטגוריה זו כבר קיימת.');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddSubcategory = async () => {
        if (!selectedCategory || !newSubcategory) {
            alert('בחר קטגוריה ואוסף שם של תת-קטגוריה.');
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
                    alert('תת-קטגוריה חדשה נוספה בהצלחה.');
                } else {
                    alert('תת-קטגוריה זו כבר קיימת.');
                }
            } else {
                alert('לא נמצאה הקטגוריה הזו.');
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    const confirmAndRemoveCategory = () => {
        setConfirmAction(() => handleRemoveCategory);
        setShowConfirmModal(true);
    };

    const confirmAndRemoveSubcategory = () => {
        setConfirmAction(() => handleRemoveSubcategory);
        setShowConfirmModal(true);
    };

    const handleRemoveCategory = async () => {
        if (!selectedCategory) {
            alert('בחר קטגוריה למחיקה.');
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
                fetchCategories(); // Refresh categories list
                alert('הקטגוריה והמוצרים השייכים לה נמחקו בהצלחה.');
            } else {
                alert('הקטגוריה לא נמצאה.');
            }
        } catch (error) {
            console.error('Error removing category and its products:', error);
        }

        setShowConfirmModal(false);
    };

    const handleRemoveSubcategory = async () => {
        if (!selectedCategory || !selectedSubcategory) {
            alert('בחר קטגוריה ותת-קטגוריה למחיקה.');
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
                alert('תת-הקטגוריה והמוצרים השייכים לה נמחקו בהצלחה.');
            } else {
                alert('הקטגוריה לא נמצאה.');
            }
        } catch (error) {
            console.error('Error removing subcategory and its products:', error);
        }

        setShowConfirmModal(false);
    };

    return (
        <div className="category-management">
            <h3>ניהול קטגוריות ותתי קטגוריות</h3>
            <input
                type="text"
                placeholder="קטגוריה חדשה"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>הוספת קטגוריה</button>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">בחר קטגוריה להסרה</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
            <button className="remove-button" onClick={confirmAndRemoveCategory}>הסרת קטגוריה</button>

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">בחר קטגוריה כדי להוסיף לה תת קטגוריה</option>
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

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">בחר קטגוריה כדי להסיר ממנה תת קטגוריה</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
            <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                <option value="">בחר תת קטגוריה להסרה</option>
                {subCategories.map((subCat, index) => (
                    <option key={index} value={subCat}>
                        {subCat}
                    </option>
                ))}
            </select>
            <button className="remove-button" onClick={confirmAndRemoveSubcategory}>הסרת תת קטגוריה</button>

            <ConfirmModal 
                show={showConfirmModal} 
                handleClose={() => setShowConfirmModal(false)} 
                handleConfirm={confirmAction}
                title="אישור הסרה"
                body="האם אתה בטוח שברצונך לבצע פעולה זו?"
            />
        </div>
    );
};

export default ManageCategories;
