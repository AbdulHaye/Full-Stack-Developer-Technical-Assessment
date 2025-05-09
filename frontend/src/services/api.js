// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({ 
  // baseURL: 'http://localhost:5000/api' 
  baseURL: 'https://full-stack-developer-technical-assessment-6l1ukc833.vercel.app/api', // Make sure this matches your backend port
  withCredentials: true
});

// Add request interceptor for auth tokens
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem('userInfo')).token
    }`;
  }
  return req;
});

export default API;