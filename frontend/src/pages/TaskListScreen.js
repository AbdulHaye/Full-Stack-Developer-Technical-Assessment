import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listTasks, deleteTask, createTask } from '../actions/taskActions';
import { TASK_CREATE_RESET } from '../constants/taskConstants';
import TaskModal from '../components/TaskModal';

const TaskListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taskList = useSelector((state) => state.taskList);
  const { loading, error, tasks } = taskList;

  const taskDelete = useSelector((state) => state.taskDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = taskDelete;

  const taskCreate = useSelector((state) => state.taskCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    task: createdTask,
  } = taskCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: TASK_CREATE_RESET });

    if (!userInfo) {
      navigate('/login');
    }

    if (successCreate) {
      navigate(`/tasks/${createdTask._id}/edit`);
    } else {
      dispatch(listTasks());
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdTask]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteTask(id));
    }
  };

  const createTaskHandler = () => {
    dispatch(createTask());
  };

  const sendApprovalHandler = (taskId) => {
    // This would be implemented to call the API to send the email
    console.log(`Send approval email for task ${taskId}`);
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Tasks</h1>
        </Col>
        <Col className="text-end">
          <TaskModal />
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>ASSIGNED TO</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task._id}</td>
                <td>{task.title}</td>
                <td>{task.assignedTo}</td>
                <td>
                  <span
                    className={
                      task.status === 'approved'
                        ? 'badge bg-success'
                        : task.status === 'rejected'
                        ? 'badge bg-danger'
                        : 'badge bg-warning text-dark'
                    }
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => sendApprovalHandler(task._id)}
                  >
                    <i className="fas fa-envelope"></i>
                  </Button>
                  <Link to={`/tasks/${task._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(task._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TaskListScreen;