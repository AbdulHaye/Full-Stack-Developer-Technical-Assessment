// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import TaskListScreen from './pages/TaskListScreen';
import TaskCreateScreen from './pages/TaskCreateScreen';
import TaskEditScreen from './pages/TaskEditScreen';
import TaskResponseScreen from './pages/TaskResponseScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/tasks" element={<TaskListScreen />} />
            <Route path="/tasks/create" element={<TaskCreateScreen />} />
            <Route path="/tasks/:id/edit" element={<TaskEditScreen />} />
            <Route path="/respond/:token" element={<TaskResponseScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;