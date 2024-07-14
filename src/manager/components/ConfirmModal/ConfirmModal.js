import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ConfirmModal.css'; 

const ConfirmModal = ({ show, handleClose, handleConfirm, title, body }) => {
 
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
        <Modal.Title className='modal-title-123'>{title}</Modal.Title>
      <Modal.Body className='modal-body-123'>
        <p>{body}</p>
      </Modal.Body> 
      <Modal.Footer className='modal-footer-123'>
        <Button className='modal-footer-cancel-123' variant="secondary" onClick={handleClose}>
          ביטול
        </Button>
        <Button className='modal-footer-conform-123' variant="danger" onClick={handleConfirm}>
          אישור
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;