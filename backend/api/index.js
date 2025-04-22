const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('../middleware/errorMiddleware');
const taskRoutes = require('../routes/taskRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();

// 🔒 Manual CORS headers middleware — put this at the TOP before cors()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://full-stack-developer-technical-assessment.vercel.app'); // ✅ no trailing slash
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Preflight
  }
  next();
});

// 🔥 Dynamic CORS with whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'https://full-stack-developer-technical-assessment.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

// Vercel handler
const serverless = require('serverless-http');
module.exports = serverless(app);
