import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, storage } from '../utility/firebase';
import { collection, getDocs,doc,getDoc,docs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { firestore } from '../utility/firebase'; // ensure you have initialized firebase
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar'; 
import '../styles/page/InventoryPage.css';

 
 
const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const productsCollectionRef = collection(db, "products");

  useEffect(() => {
    const getAllProducts = async () => {
      const allProducts = await getDocs(productsCollectionRef);
      const productsWithImages = await Promise.all(
        allProducts.docs.map(async (doc) => {
          const productData = doc.data();
          const imageURL = await getDownloadURL(ref(storage, productData.imageURL)); 
          return { ...productData, id: doc.id, imageURL };
        }) 
      );
      setProducts(productsWithImages);
    };

    getAllProducts();
  }, []);

  return (
    <div className='InventoryPage'>
      {products.map((product) => (
        <div key={product.id}>
          <h4>Name: {product.name}</h4>
          <h4>Description: {product.description}</h4>
          <h4>Quantity: {product.quantity}</h4>
          {product.imageURL && <img src={product.imageURL} alt={product.name} />}
          <h4>Subcategory: {product.subcategory}</h4>
          <h4>Category: {product.category}</h4>
          <h1>-------------------</h1> 
        </div> 
      ))}  
    </div> 
  ); 
} 

export default InventoryPage;