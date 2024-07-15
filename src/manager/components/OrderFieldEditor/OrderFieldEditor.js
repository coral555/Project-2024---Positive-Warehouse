import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './OrderFieldEditor.css';

const OrderFieldEditor = ({ orderId, fieldName, currentValue, handleEditField }) => {
  const [showModal, setShowModal] = useState(false);
  const [newValue, setNewValue] = useState(currentValue);

  const openModal = () => {
    setNewValue(currentValue); 
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    if (newValue !== currentValue) {
      handleEditField(orderId, fieldName, newValue);
    }
    setShowModal(false);
  };

  return (
    <div className='order-ditails'>
      <p>
        {currentValue}
       {  console.log("saeed         :" + handleEditField)}
        <strong> :{fieldName == "orderDate"? "תאריך הזמנה " :  (fieldName == "startDate" ? "תאריך קבלה " : (fieldName == "endDate" ? "תאריך החזרה " : (
          fieldName == "email" ? "מייל " : (fieldName == "name" ? "שם " : "מספר נייד "))))}</strong> 
          
        <Button variant="link" onClick={openModal}>✏</Button>
      </p>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="custom-modal"
      >
        <Modal.Title className='modal-title-12'>עריכת {fieldName == "orderDate"? "תאריך הזמנה" :  (fieldName == "startDate" ? "תאריך קבלה" : (fieldName == "endDate" ? "תאריך החזרה" : (
          fieldName == "email" ? "מייל" : (fieldName == "name" ? "שם" : "מספר נייד"))))}
        </Modal.Title>
        <Modal.Body className='modal-body-12'>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer className='modal-footer-12'>
          <Button className='modal-button-cancel-12' variant="secondary" onClick={handleClose}>
            ביטול
          </Button>
          <Button className='modal-button-save-12' variant="primary" onClick={handleSave}>
            שמירה
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderFieldEditor;