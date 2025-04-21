const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('../routes/taskRoutes');
const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middleware/errorMiddleware');

const app = express();

// CORS Middleware
app.use(cors({
  origin: ['https://full-stack-developer-technical-assessment.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use(errorHandler);

// Wrap with serverless
const handler = serverless(app);

// Final export for Vercel
module.exports = async (req, res) => {
  // Handle CORS preflight requests manually
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://full-stack-developer-technical-assessment.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  await connectDB();
  return handler(req, res);
};
