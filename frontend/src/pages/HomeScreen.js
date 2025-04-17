import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <>
      <h1>Welcome to Task Approval App</h1>
      {userInfo ? (
        <Row>
          <Col md={6}>
            <Card className="my-3 p-3 rounded">
              <Card.Body>
                <Card.Title as="h3">Manage Tasks</Card.Title>
                <Card.Text>
                  Create, view, edit and delete tasks. Send approval requests to users.
                </Card.Text>
                <Link to="/tasks">
                  <Button variant="primary">Go to Tasks</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={6}>
            <Card className="my-3 p-3 rounded">
              <Card.Body>
                <Card.Title as="h3">Sign In</Card.Title>
                <Card.Text>
                  Sign in to access the task management dashboard.
                </Card.Text>
                <Link to="/login">
                  <Button variant="primary">Sign In</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="my-3 p-3 rounded">
              <Card.Body>
                <Card.Title as="h3">Register</Card.Title>
                <Card.Text>
                  Register as a manager to start creating tasks.
                </Card.Text>
                <Link to="/register">
                  <Button variant="secondary">Register</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default HomeScreen;