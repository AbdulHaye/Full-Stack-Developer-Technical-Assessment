import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getTaskDetails, updateTask } from '../actions/taskActions';
import { TASK_UPDATE_RESET } from '../constants/taskConstants';
import { sendApprovalEmail } from '../actions/taskActions';

const TaskEditScreen = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taskDetails = useSelector((state) => state.taskDetails);
  const { loading, error, task } = taskDetails;

  const taskUpdate = useSelector((state) => state.taskUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = taskUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: TASK_UPDATE_RESET });
      navigate('/tasks');
    } else {
      if (!task || task._id !== id) {
        dispatch(getTaskDetails(id));
      } else {
        setTitle(task.title);
        setDescription(task.description);
        setAssignedTo(task.assignedTo);
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      }
    }
  }, [dispatch, navigate, id, task, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateTask({
        _id: id,
        title,
        description,
        assignedTo,
        dueDate,
      })
    );
  };


  const taskSendApproval = useSelector((state) => state.taskSendApproval);
//   const { loading: loadingSendApproval } = taskSendApproval;

  const sendApprovalHandler = () => {
    if (window.confirm('Send approval email for this task?')) {
      dispatch(sendApprovalEmail(id));
    }
  };

  return (
    <FormContainer>
      <Link to="/tasks" className="btn btn-light my-3">
        Go Back
      </Link>
      <h1>Edit Task</h1>
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
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

          <Button type="submit" variant="primary" className="me-2">
            Update
          </Button>
          <Button
      variant="success"
      onClick={sendApprovalHandler}
    //   disabled={loadingSendApproval}
    >
    Send Approval Request
      {/* {loadingSendApproval ? 'Sending...' : 'Send Approval Request'} */}
    </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default TaskEditScreen;