import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createTask } from '../actions/taskActions';

const TaskCreateScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taskCreate = useSelector((state) => state.taskCreate);
  const { loading, error, task } = taskCreate;

  useEffect(() => {
    if (task) {
      navigate(`/tasks/${task._id}/edit`);
    }
  }, [navigate, task]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createTask({ title, description, assignedTo, dueDate }));
  };

  return (
    <FormContainer>
      <Link to="/tasks" className="btn btn-light my-3">
        Go Back
      </Link>
      <h1>Create Task</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="description" className="my-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="assignedTo">
          <Form.Label>Assigned To (Email)</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="dueDate" className="my-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Create
        </Button>
      </Form>
    </FormContainer>
  );
};

export default TaskCreateScreen;