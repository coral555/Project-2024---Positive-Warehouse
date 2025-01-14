import React, { useState, useEffect } from "react";
import { useCombined } from "../../../context/CombinedContext";
import "./ManageOrders.css";
import { Button,Modal, Form } from 'react-bootstrap';
import { deleteDoc, doc, updateDoc, query, collection, where, getDocs, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from "../../../utils/firebase";
import { selectfetchProducts, addProductToOrder } from "../../../utils/firebaseUtils";
import OrderFieldEditor from '../../components/OrderFieldEditor/OrderFieldEditor'; 
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'; 
// import confirmModalOrders from '../../components/confirmModelOrders/'; 

import {notifiyLateOrder} from '../../../utils/emailSender';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    productName: "",
    selectedQuantity: 1
  });
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const handleNotifyCreator = function(order) {
    return (target) => {
      const endDate = new Date(order.endDate);
      const currentDate = new Date();
      const day_since_return_date = Math.floor((currentDate - endDate) / (1000 * 60 * 60 * 24));
      notifiyLateOrder({
        name:  order.user.name,
        email: order.user.email,
        days_since_return_date: day_since_return_date
      }, order.products);
      setShowEmailSentModal(true); 
    }
  }
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [editedFields, setEditedFields] = useState({});
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(null);

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !(timestamp instanceof Date)) return '';
    const date = timestamp;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const convertToTimestamp = (dateString) => {
    const date = new Date(dateString);
    return Timestamp.fromDate(date);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      return; 
    }
    const searchParams = {
      userEmail: searchTerm.includes('@') ? searchTerm : "",
      userName: !searchTerm.includes('@') && !/^\d+$/.test(searchTerm) ? searchTerm : "",
      userPhone: /^\d+$/.test(searchTerm) ? searchTerm : ""
    };
    await searchOrders(searchParams);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditField = (orderId, field, value) => {
    setEditedFields({ ...editedFields, [orderId]: { ...editedFields[orderId], [field]: value } });
    updateOrderField(orderId, field, value);
  };

  const updateOrderField = async (orderId, field, value) => {
    try {
      let updateValue = value;
      if (['orderTime', 'endDate', 'startDate', 'orderDate'].includes(field)) {
        updateValue = convertToTimestamp(value);
      }

      await updateDoc(doc(db, "orders", orderId), { [field]: updateValue });
      await searchOrders({ userEmail: "", userName: "", userPhone: "" });
    } catch (error) {
      console.error('Error updating order field:', error);
    }
  };
 
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      handleCloseModal();

      await searchOrders({ userEmail: "", userName: "", userPhone: "" }); 
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const moveToOld = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);
      const orderData = orderSnapshot.data();
      const oldOrdersCollection = collection(db, "oldOrders");
      await addDoc(oldOrdersCollection, orderData);
      await deleteDoc(orderRef);
      handleCloseModal();

      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); 

    } catch (error) {
      console.error('Error moving order to oldOrders or deleting order:', error);
    }
  };

  const handleDeleteProduct = async (orderId, productId) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedProducts = orderToUpdate.products.filter(product => product.id !== productId);
      await updateDoc(doc(db, "orders", orderId), { products: updatedProducts });
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); 
      
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
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null);
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleEditUserField = async (orderId, field, value) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedUser = { ...orderToUpdate.user, [field]: value };
      await updateDoc(doc(db, "orders", orderId), { user: updatedUser });
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); 
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
        await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); // Refresh orders after deletion
      } else {
        alert("הכמות שנבחרה חורגת מהכמות הזמינה.");
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

  const handleFetchOldOrders = async () => {
    try{
      const now = new Date();
      const oldDateTimestamp = Timestamp.fromDate(now);
      setSearchTerm('');
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, oldDateTimestamp);
    } catch (error) {
      console.error('Error fetching old orders:', error);
      // await searchOrders(searchParams);
    }
  };

  const openConfirmModal = (action, title, body) => {
    setConfirmAction(() => action);
    setModalTitle(title);
    setModalBody(body);
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => setShowConfirmModal(false);

  return (
    <div className="manage-orders">
      <h2 className="title">ניהול הזמנות</h2>
      <div className="search-form">
        <input id="text-input"
          type="text"
          placeholder="חפש לפי מייל, שם או מספר נייד"
          onChange={handleSearchChange}
        />
        <Button className="custom-button-search" onClick={handleSearch}>חיפוש</Button>
        <Button className="custom-button-search" onClick={handleFetchOldOrders}>הזמנות ישנות</Button>
      </div>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order">
            <h3>{order.id} :מספר הזמנה</h3>
            <div className="order-details">
              <OrderFieldEditor
                orderId={order.id}
                fieldName="orderDate"
                currentValue={formatTimestamp(order.orderDate)}
                handleEditField={handleEditField}
              />
              <OrderFieldEditor
                orderId={order.id}
                fieldName="startDate"
                currentValue={formatTimestamp(order.startDate)}
                handleEditField={handleEditField}
              />
              <OrderFieldEditor
                orderId={order.id}
                fieldName="endDate"
                currentValue={formatTimestamp(order.endDate)}
                handleEditField={handleEditField}
              />

              <strong className="align-right">:פרטי הלקוח</strong> <br />
              <OrderFieldEditor
                orderId={order.id}
                fieldName="email"
                currentValue={order.user.email}
                handleEditField={(id, field, value) => handleEditUserField(id, 'email', value)}
              />
              <OrderFieldEditor
                orderId={order.id}
                fieldName="name"
                currentValue={order.user.name}
                handleEditField={(id, field, value) => handleEditUserField(id, 'name', value)}
              />
              <OrderFieldEditor
                orderId={order.id}
                fieldName="phone"
                currentValue={order.user.phone}
                handleEditField={(id, field, value) => handleEditUserField(id, 'phone', value)}
              />
            </div>
            <strong className="align-right">:מוצרים שהלקוח הזמין</strong>
            <ul className="align-right">
              {order.products.map((product) => (
                <li key={product.id}>
                  <p>{product.id} :מספר הזמנה</p>
                  <p>שם המוצר: {product.productName}</p>
                  <p>כמות: {product.selectedQuantity}</p>
                  <Button className="custom-button" onClick={() => handleEditProduct(order.id, product.id, 'selectedQuantity', product.selectedQuantity + 1)}>הגדלת הכמות</Button>
                  <Button className="custom-button" onClick={() => {
                    if (product.selectedQuantity > 1) {
                      handleEditProduct(order.id, product.id, 'selectedQuantity', product.selectedQuantity - 1);
                    }
                  }}>הורדת הכמות</Button>
                  <Button className="custom-button" onClick={() => handleDeleteProduct(order.id, product.id)}>מחיקת מוצר</Button>
                </li>
              ))}
            </ul>
            <strong className="align-right">:הוספת מוצרים להזמנה זו</strong>
            <Form.Group className="align-right-product" controlId="categorySelect">
                <Form.Control className="align-right-product" as="select" value={selectedCategory} onChange={handleCategoryChange}>
                    <option className="align-right-product" value="">כל הקטגוריות</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </Form.Control>
                <Form.Label className="align-right-product"> בחר קטגוריה</Form.Label>
            </Form.Group>
            <p>
                <Form.Group className="align-right-product" controlId="subCategorySelect">
                    <Form.Control className="align-right-product" as="select" value={selectedSubCategory} onChange={handleSubCategoryChange} disabled={!selectedCategory}>
                        <option className="align-right-product" value="">כל תתי הקטגוריות</option>
                        {subCategories.map((subCat, index) => (
                            <option key={index} value={subCat}>
                                {subCat}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Label className="align-right-product"> בחר תת קטגוריה</Form.Label>
                </Form.Group>
            </p>
            <p>
                <Form.Group className="align-right-product" controlId="productSelect">
                    <Form.Control className="align-right-product" as="select" value={newProduct.id} onChange={handleProductChange}>
                        <option className="align-right-product" value="">שם המוצר</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} (הכמות במלאי: {product.quantity})
                            </option>
                        ))}
                    </Form.Control>
                    {selectedProductQuantity !== null && (
                        <p className="align-right-product">הכמות במלאי: {selectedProductQuantity}</p>
                    )}
                    <Form.Label className="align-right-product"> בחר מוצר</Form.Label>
                </Form.Group>
            </p>
            <p>
                <Form.Group className="align-right-product" controlId="quantityInput">
                    <Form.Control
                        className="align-right-product"
                        type="number"
                        placeholder="Quantity"
                        value={newProduct.selectedQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, selectedQuantity: Math.min(parseInt(e.target.value), selectedProductQuantity) })}
                    />
                    <Form.Label className="align-right-product"> בחר כמות</Form.Label>
                </Form.Group>
            </p>
            <p className="align-right-product">
              {new Date(order.endDate) < new Date()? (
                <>
                  <Button className="custom-button"
                    id={"notify-"+order.id}
                    type="checkbox"
                    onClick={handleNotifyCreator(order)}
                  >שלח תזכורת</Button>
                </>):(null)}
              <Button className="custom-button-delete"
                  onClick={() => openConfirmModal(() => handleDeleteOrder(order.id), "מחיקת הזמנה", "האם אתה בטוח שברצונך למחוק הזמנה זו? (לא תוכל לשחזר)")}>מחיקת הזמנה</Button>
              <Button className="custom-button"
                  onClick={() => handleAddProduct(order.id)}
                  disabled={newProduct.selectedQuantity > selectedProductQuantity}>הוספת המוצר</Button>
              <Button className="custom-button"
                  onClick={() => openConfirmModal(() => moveToOld(order.id), "העברה לתקיה של הזמנות ישנות", "האם אתה בטוח שברצונך להעביר הזמנה זו לתיקיית הזמנות ישנות? (לא תוכל להחזיר)")}>העברה לתיקיית הזמנות ישנות</Button>
                </p>
          </div>
        ))}
        
      </div>
      <ConfirmModal
        show={showConfirmModal}
        handleClose={handleCloseModal}
        handleConfirm={confirmAction}
        title={modalTitle}
        body={modalBody}
      />
          { /** Confirm email sending */}
      <Modal show={showEmailSentModal} onHide={() => setShowEmailSentModal(false)}>
        <Modal.Body>The email has been sent successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowEmailSentModal(false)}>
            אישור
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageOrders;