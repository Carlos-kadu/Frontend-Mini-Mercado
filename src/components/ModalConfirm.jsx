import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ModalConfirm({ show, onHide, onConfirm, title, body }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirmar"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body || "Tem certeza?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm}>Excluir</Button>
      </Modal.Footer>
    </Modal>
  );
}
