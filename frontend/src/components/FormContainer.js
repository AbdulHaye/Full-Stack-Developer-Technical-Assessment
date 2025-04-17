// frontend/src/components/FormContainer.js
import React from 'react';
import { Container } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container className="my-4">
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        {children}
      </div>
    </Container>
  );
};

export default FormContainer;