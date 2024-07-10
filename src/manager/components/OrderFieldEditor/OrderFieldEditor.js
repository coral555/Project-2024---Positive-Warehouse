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
    <>
      <p>
        <strong>{fieldName}:</strong> {currentValue}
        <Button variant="link" onClick={openModal}>
          ✏️
        </Button>
      </p>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="custom-modal"
      >
          <Modal.Title>Edit {fieldName}</Modal.Title>
        <Modal.Body>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderFieldEditor;
