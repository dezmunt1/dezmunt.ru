import React, { useState } from 'react';
import { Toast, Row, Col} from 'react-bootstrap';

export const ToastMessage  = ()  => {
  const [ prop, setProp ] = useState( {
    show: false,
    headerText: "",
    bodyText: ""
  } );

  const Component = props => (
    <Row>
      <Col xs={12}>
        <Toast 
          onClose={() => setProp({show: false})}
          show={prop.show}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="mr-auto">{ prop.headerText }</strong>
          </Toast.Header>
          <Toast.Body>{ prop.bodyText }</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );

  return { Component, setProp  }
}