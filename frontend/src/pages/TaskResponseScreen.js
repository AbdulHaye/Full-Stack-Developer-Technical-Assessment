import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { respondToTask } from "../actions/taskActions";

const TaskResponseScreen = () => {
  const { token } = useParams();
  console.log(token, "token tokennnnnn");
  const [action, setAction] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taskRespond = useSelector((state) => state.taskRespond);
  const { loading, error, task } = taskRespond;

  useEffect(() => {
    if (task && submitted) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [navigate, task, submitted]);

  useEffect(() => {
    dispatch(respondToTask(token)); // Fetch task data on page load
  }, [dispatch, token]);

  const submitHandler = (selectedAction) => {
    setAction(selectedAction);
    dispatch(respondToTask(token, selectedAction));
    setSubmitted(true);
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <Card>
          <Card.Header as="h5">Task Approval</Card.Header>
          <Card.Body>
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}

            {task && submitted ? (
              <Message variant="success">
                You have successfully{" "}
                {action === "approve" ? "approved" : "rejected"} the task:{" "}
                <strong>{task.title}</strong>
              </Message>
            ) : task ? (
              <>
                <Card.Title>{task.title}</Card.Title>
                <Card.Text>{task.description}</Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Assigned by: {task.assignedBy.name}
                  </small>
                </Card.Text>
                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => submitHandler("approve")}
                    disabled={submitted}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => submitHandler("reject")}
                    disabled={submitted}
                  >
                    Reject
                  </Button>
                </div>
              </>
            ) : (
              !loading &&
              !error && (
                <Message variant="info">Loading task details...</Message>
              )
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TaskResponseScreen;
