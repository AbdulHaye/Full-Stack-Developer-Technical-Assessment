const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('../routes/taskRoutes'); // adjust paths
const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://full-stack-developer-technical-assessment.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Handle preflight requests
  app.options('*', cors());
  
  app.use(express.json());

// Connect to MongoDB only once
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Use routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// Wrap app with serverless
const handler = serverless(app);

// Export as Vercel API function
module.exports = async (req, res) => {
  await connectDB();
  return handler(req, res);
};
