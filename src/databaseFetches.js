import { db, storage } from './utility/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, query, where, getDocs } from "firebase/firestore";


export const fetchCategories = async () => {
    try {
        const categoriesCollection = collection(db, 'קטגוריות');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categories = categoriesSnapshot.docs.map(doc => doc.data().name);
        return categories;
    } catch (error) {
        console.error("Error fetching categories: ", error);
        throw error;
    }
};

export const fetchSubcategories = async (categoryName) => {
    try {
        const categoriesCollection = collection(db, 'קטגוריות'); // Collection reference
        const querySnapshot = await getDocs(categoriesCollection); // Get all documents in the collection
        let subcategories = []; // Initialize subcategories array
        querySnapshot.forEach((doc) => {
            const categoryData = doc.data(); // Get data of the document
            if (categoryData.name === categoryName) { // Check if the document matches the categoryName
                subcategories = categoryData.subcategory || []; // Get the subcategories data
            }
        });

        return subcategories; // Return the subcategories
    } catch (error) {
        console.error(`Error fetching subcategories for category ${categoryName}: `, error);
        throw error;
    }
};




export const fetchAllProducts = async () => {
    try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const products = productsSnapshot.docs.map(doc => doc.data());
        return products;
    } catch (error) {
        console.error("Error fetching all products: ", error);
        throw error;
    }
};


export const getProductsByCategoryAndSubcategory = async (category, subcategory) => {
    try {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, where('category', '==', category), where('subcategory', '==', subcategory));
        const productsSnapshot = await getDocs(q);
        
        const products = productsSnapshot.docs.map(doc => doc.data());
        return products;
    } catch (error) {
        console.error(`Error fetching products for category ${category} and subcategory ${subcategory}: `, error);
        throw error;
    }
};


