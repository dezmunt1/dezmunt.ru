import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const ModalWindow = (props) => {
  const [modalState, setModalState] = useState({
    show: false,
    title: '',
    body: '',
    footer: ''
  });
  const hideHandler = () => {
    setModalState({...modalState, show: false});
  };
  const Component = () => (
    <Modal
      {...props}
      size="lg"
      onHide={()=> {setModalState({...modalState, show: false})}}
      show={modalState.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton={true}>
        <Modal.Title id="contained-modal-title-vcenter">
          {modalState.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalState.body}
      </Modal.Body>
      <Modal.Footer>
        {modalState.footer}
        <Button onClick={hideHandler}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

  return {setModalState, Component}
}