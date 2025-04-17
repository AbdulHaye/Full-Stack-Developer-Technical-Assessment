import axios from "axios";
import {
  TASK_LIST_REQUEST,
  TASK_LIST_SUCCESS,
  TASK_LIST_FAIL,
  TASK_DETAILS_REQUEST,
  TASK_DETAILS_SUCCESS,
  TASK_DETAILS_FAIL,
  TASK_CREATE_REQUEST,
  TASK_CREATE_SUCCESS,
  TASK_CREATE_FAIL,
  TASK_UPDATE_REQUEST,
  TASK_UPDATE_SUCCESS,
  TASK_UPDATE_FAIL,
  TASK_DELETE_REQUEST,
  TASK_DELETE_SUCCESS,
  TASK_DELETE_FAIL,
  TASK_RESPOND_REQUEST,
  TASK_RESPOND_SUCCESS,
  TASK_RESPOND_FAIL,
} from "../constants/taskConstants";
import API from "../services/api";

export const listTasks = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await API.get("/tasks", config);

    dispatch({
      type: TASK_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TASK_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getTaskDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await API.get(`/tasks/${id}`, config);

    dispatch({
      type: TASK_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TASK_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// src/actions/taskActions.js
export const createTask = (taskData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "TASK_CREATE_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await API.post("/tasks", taskData, config);

    dispatch({
      type: "TASK_CREATE_SUCCESS",
      payload: data,
    });

    // Refresh the task list
    dispatch(listTasks());
  } catch (error) {
    dispatch({
      type: "TASK_CREATE_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateTask = (task) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await API.put(`/tasks/${task._id}`, task, config);

    dispatch({
      type: TASK_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TASK_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteTask = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: TASK_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await API.delete(`/tasks/${id}`, config);

    dispatch({
      type: TASK_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: TASK_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const respondToTask =
  (token, action = null) =>
  async (dispatch) => {
    try {
      dispatch({ type: TASK_RESPOND_REQUEST });

      let data;
      if (action) {
        // Submit response
        const config = { headers: { "Content-Type": "application/json" } };
        const res = await API.post(
          `/tasks/respond/${token}`,
          { action },
          config
        );
        data = res.data;
      } else {
        // Just fetch task details
        const res = await API.get(`/tasks/respond/${token}`);
        data = res.data;
      }

      dispatch({ type: TASK_RESPOND_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: TASK_RESPOND_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// src/actions/taskActions.js
export const sendApprovalEmail = (taskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: "TASK_SEND_APPROVAL_REQUEST" });

    const { userInfo } = getState().userLogin;

    const { data } = await API.post(
      `/tasks/${taskId}/send-approval`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    dispatch({ type: "TASK_SEND_APPROVAL_SUCCESS" });
    return data; // Return response data
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Email sending failed";

    dispatch({
      type: "TASK_SEND_APPROVAL_FAIL",
      payload: message,
    });

    throw new Error(message); // Re-throw for component handling
  }
};
