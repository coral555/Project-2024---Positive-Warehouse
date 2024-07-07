import React, { useState, useEffect } from "react";
import { useCombined } from "../../../context/CombinedContext";
import "./ManageOrders.css";
import { Button, Modal, Form } from 'react-bootstrap';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "../../../utils/firebase";
import { selectfetchProducts, addProductToOrder } from  "../../../utils/firebaseUtils";

const ManageOrders = () => {
  const {
    searchOrders,
    orders,
    category,
    categories,
    setCategory,
    subCategory,
    setSubCategory,
    subCategories,
  } = useCombined();
  
  const [searchTerm, setSearchTerm] = useState({
    userEmail: "",
    userName: "",
    userPhone: ""
  });

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    productName: "",
    selectedQuantity: 1
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [editedFields, setEditedFields] = useState({});
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(null);

  const handleSearch = async () => {
    await searchOrders(searchTerm);
  };

  const handleEditField = (orderId, field, value) => {
    setEditedFields({ ...editedFields, [orderId]: { ...editedFields[orderId], [field]: value } });
    updateOrderField(orderId, field, value);
  };

  const updateOrderField = async (orderId, field, value) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { [field]: value });
      await searchOrders(searchTerm); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order field:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      await searchOrders(searchTerm); // Refresh orders after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleDeleteProduct = async (orderId, productId) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedProducts = orderToUpdate.products.filter(product => product.id !== productId);
      await updateDoc(doc(db, "orders", orderId), { products: updatedProducts });
      await searchOrders(searchTerm); // Refresh orders after product deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = async (orderId, productId, field, value) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedProducts = orderToUpdate.products.map(product =>
        product.id === productId ? { ...product, [field]: value } : product
      );
      await updateDoc(doc(db, "orders", orderId), { products: updatedProducts });
      await searchOrders(searchTerm); // Refresh orders after product editing
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleEditUserField = async (orderId, field, value) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedUser = { ...orderToUpdate.user, [field]: value };
      await updateDoc(doc(db, "orders", orderId), { user: updatedUser });
      await searchOrders(searchTerm); // Refresh orders after user field editing
    } catch (error) {
      console.error('Error editing user field:', error);
    }
  };

  const handleAddProduct = async (orderId) => {
    try {
      const productToAdd = products.find(product => product.id === newProduct.id);
      if (productToAdd && newProduct.selectedQuantity <= productToAdd.quantity) {
        const productData = {
          id: productToAdd.id,
          productName: productToAdd.name,
          selectedQuantity: newProduct.selectedQuantity
        };
        await addProductToOrder(orderId, productData);
        await searchOrders(searchTerm); // Refresh orders after adding product
      } else {
        alert("Selected quantity exceeds available quantity.");
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCategory(event.target.value);
    setSubCategory('');
    setSelectedSubCategory('');
  };

  const handleSubCategoryChange = (event) => { 
    setSubCategory(event.target.value);
    setSelectedSubCategory(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productList = await selectfetchProducts(selectedCategory, selectedSubCategory);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [selectedCategory, selectedSubCategory]);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find(prod => prod.id === productId);
    if (product) {
      setNewProduct({ id: product.id, productName: product.name, selectedQuantity: 1 });
      setSelectedProductQuantity(product.quantity);
    }
  };

  return (
    <div className="manage-orders">
      <h2>Manage Orders</h2>
      <div className="search-form">
        <input
          type="text"
          placeholder="Search by Email, Name, or Phone"
          value={searchTerm.userEmail}
          onChange={(e) => setSearchTerm({ ...searchTerm, userEmail: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm.userName}
          onChange={(e) => setSearchTerm({ ...searchTerm, userName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Phone"
          value={searchTerm.userPhone}
          onChange={(e) => setSearchTerm({ ...searchTerm, userPhone: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order">
            <h3>Order ID: {order.id}</h3>
            <div className="order-details">
              <p>
                <strong>Order Date:</strong> {order.orderDate}
                <Button variant="link" onClick={() => handleEditField(order.id, "orderDate", prompt("Enter new order date:", order.orderDate))}>
                  ✏️
                </Button>
              </p>
              <p>
                <strong>Start Date:</strong> {order.startDate}
                <Button variant="link" onClick={() => handleEditField(order.id, "startDate", prompt("Enter new start date:", order.startDate))}>
                  ✏️
                </Button>
              </p>
              <p>
                <strong>End Date:</strong> {order.endDate}
                <Button variant="link" onClick={() => handleEditField(order.id, "endDate", prompt("Enter new end date:", order.endDate))}>
                  ✏️
                </Button>
              </p>
              <p>
                <strong>Order Time:</strong> {order.orderTime}
                <Button variant="link" onClick={() => handleEditField(order.id, "orderTime", prompt("Enter new order time:", order.orderTime))}>
                  ✏️
                </Button>
              </p>
              <strong>User:</strong> <br />
              <p>
                Email: {order.user.email}
                <Button variant="link" onClick={() => handleEditUserField(order.id, "email", prompt("Enter new email:", order.user.email))}>
                  ✏️
                </Button>
              </p>
              <p>
                Name: {order.user.name}
                <Button variant="link" onClick={() => handleEditUserField(order.id, "name", prompt("Enter new name:", order.user.name))}>
                  ✏️
                </Button>
              </p>
              <p>
                Phone: {order.user.phone}
                <Button variant="link" onClick={() => handleEditUserField(order.id, "phone", prompt("Enter new phone number:", order.user.phone))}>
                  ✏️
                </Button>
              </p>
            </div>

            <ul>
              <strong>Products:</strong>
              {order.products.map((product) => (
                <li key={product.id}>
                  <p>Product ID: {product.id}</p>
                  <p>{product.productName}</p>
                  <p>Quantity: {product.selectedQuantity}</p>
                  <Button onClick={() => handleEditProduct(order.id, product.id, 'selectedQuantity', product.selectedQuantity + 1)}>Increase Quantity</Button>
                  <Button onClick={() => handleEditProduct(order.id, product.id, 'selectedQuantity', product.selectedQuantity - 1)}>Decrease Quantity</Button>
                  <Button onClick={() => handleDeleteProduct(order.id, product.id)}>Delete Product</Button>
                </li>
              ))}
            </ul>

            <Form.Group controlId="categorySelect">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <p>
            <Form.Group controlId="subCategorySelect">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control as="select" value={selectedSubCategory} onChange={handleSubCategoryChange} disabled={!selectedCategory}>
                <option value="">All Subcategories</option>
                {subCategories.map((subCat, index) => (
                  <option key={index} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            </p>
            <p>
            <Form.Group controlId="productSelect">
              <Form.Label>Product</Form.Label>
              <Form.Control as="select" value={newProduct.id} onChange={handleProductChange}>
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Remaining Quantity: {product.quantity})
                  </option>
                ))}
              </Form.Control>
              {selectedProductQuantity !== null && (
                <p>Remaining Quantity: {selectedProductQuantity}</p>
              )}
            </Form.Group>
            </p>
            <p>
            <Form.Group controlId="quantityInput">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={newProduct.selectedQuantity}
                onChange={(e) => setNewProduct({ ...newProduct, selectedQuantity: Math.min(parseInt(e.target.value), selectedProductQuantity) })}
              />
            </Form.Group>
            </p>
            <Button
              onClick={() => handleAddProduct(order.id)}
              disabled={newProduct.selectedQuantity > selectedProductQuantity}
            >
              Add Product
            </Button>
            <Button onClick={() => handleDeleteOrder(order.id)}>Delete Order</Button>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default ManageOrders;
