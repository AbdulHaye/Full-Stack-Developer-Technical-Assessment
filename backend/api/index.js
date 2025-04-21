const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('../routes/taskRoutes');
const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middleware/errorMiddleware');

const app = express();

// Enhanced CORS Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection with better error handling
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

async function connectDB() {
  if (isConnected) return true;
  
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    connectionAttempts++;
    console.error(`MongoDB connection failed (attempt ${connectionAttempts}):`, error.message);
    
    if (connectionAttempts >= MAX_RETRIES) {
      throw new Error('Max MongoDB connection attempts reached');
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    return connectDB();
  }
}

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', dbConnected: isConnected });
});

// Global Error Handler
app.use(errorHandler);

// Wrap with serverless
const handler = serverless(app);

module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    await connectDB();
    return handler(req, res);
  } catch (error) {
    console.error('Server initialization failed:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};