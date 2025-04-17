import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import {
  taskListReducer,
  taskDetailsReducer,
  taskCreateReducer,
  taskUpdateReducer,
  taskDeleteReducer,
  taskRespondReducer,
} from './reducers/taskReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
} from './reducers/userReducers';

const reducer = combineReducers({
  taskList: taskListReducer,
  taskDetails: taskDetailsReducer,
  taskCreate: taskCreateReducer,
  taskUpdate: taskUpdateReducer,
  taskDelete: taskDeleteReducer,
  taskRespond: taskRespondReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer,
  preloadedState: initialState,
});

export default store;
