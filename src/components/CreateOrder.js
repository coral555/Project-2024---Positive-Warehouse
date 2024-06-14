import React, { useState, useEffect } from 'react';
import { db, storage } from '../utility/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import '../styles/page/CreateOrder.css';
 
import DateModal from './DateModal';
import UserDetailsModal from './UserDetailsModal';

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const productsCollectionRef = collection(db, "products");
  const ordersCollectionRef = collection(db, "orders");

  const getAvailableProducts = async (startDate, endDate) => {
    const allProductsSnapshot = await getDocs(productsCollectionRef);
    const products = {};
    allProductsSnapshot.forEach(doc => {
      const data = doc.data();
      products[doc.id] = { ...data, availableQuantity: data.quantity, imageURL: data.imageURL || '' };
    });

    if (startDate && endDate) {
      const q = query(
        ordersCollectionRef,
        where('startDate', '<=', endDate),
        where('endDate', '>=', startDate)
      );
      const ordersSnapshot = await getDocs(q);
      ordersSnapshot.forEach(orderDoc => {
        const orderData = orderDoc.data();
        orderData.products.forEach(productOrder => {
          if (products[productOrder.productId]) {
            products[productOrder.productId].availableQuantity -= productOrder.quantity;
          }
        });
      });
    }

    await Promise.all(Object.values(products).map(async (product) => {
      if (product.imageURL) {
        try {
          const imageURL = await getDownloadURL(ref(storage, product.imageURL));
          product.imageURL = imageURL;
        } catch (error) {
          console.error(`Error fetching image URL for product ${product.id}:`, error);
        }
      }
    }));

    return Object.values(products);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (startDate && endDate) {
        const availableProducts = await getAvailableProducts(startDate, endDate);
        setProducts(availableProducts);
      }
    };

    fetchProducts();
  }, [startDate, endDate]);

  const handleAddProduct = (product) => {
    setSelectedProducts(prevSelected => {
      const existingProduct = prevSelected.find(p => p.id === product.id);
      if (existingProduct) {
        return prevSelected.map(p => p.id === product.id ? { ...p, selectedQuantity: product.selectedQuantity } : p);
      } else {
        return [...prevSelected, product];
      }
    });
  };

  const handleOrderCreation = async () => {
    const orderData = {
      startDate,
      endDate,
      user: userDetails,
      products: selectedProducts.map(product => ({
        productId: product.id,
        quantity: product.selectedQuantity,
      })),
    };
    await addDoc(ordersCollectionRef, orderData);
    alert('Order created successfully!');
  };

  const handleSaveDates = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleSaveUserDetails = (details) => {
    setUserDetails(details);
    handleOrderCreation();
  };

  return (
    <div className='InventoryPage'>
      <button onClick={() => setIsDateModalOpen(true)}>Select Dates</button>
      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSave={handleSaveDates}
      />
      {products.map((product) => (
        <div key={product.id}>
          <h4>Name: {product.name}</h4>
          <h4>Description: {product.description}</h4>
          <h4>Available Quantity: {product.availableQuantity}</h4>
          <input
            type="number"
            min="0"
            max={product.availableQuantity}
            value={product.selectedQuantity || 0}
            onChange={(e) => {
              const selectedQuantity = parseInt(e.target.value, 10);
              setProducts(prevProducts =>
                prevProducts.map(p =>
                  p.id === product.id ? { ...p, selectedQuantity } : p
                )
              );
            }}
          />
          {product.imageURL && <img src={product.imageURL} alt={product.name} />}
          <h4>Subcategory: {product.subcategory}</h4>
          <h4>Category: {product.category}</h4>
          <h4>ID: {product.id}</h4>
          <button onClick={() => handleAddProduct(product)}>Add Product</button>
          <h1>-------------------</h1>
        </div>
      ))}
      <button onClick={() => setIsUserDetailsModalOpen(true)}>Place Order</button>
      <UserDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        onSave={handleSaveUserDetails}
      />  
    </div>
  ); 
}

export default CreateOrder;
