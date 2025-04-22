import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Navbar.Brand>Task Approval App</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <Link to="/tasks">
                    <NavDropdown.Item>Tasks</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to="/login">
                  <Nav.Link style={{ textDecoration: "none" }}>
                    <i className="fas fa-user" style={{ textDecoration: "none" }}></i> Sign In
                  </Nav.Link>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
