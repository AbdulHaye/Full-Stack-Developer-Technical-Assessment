// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('../middleware/errorMiddleware');
const taskRoutes = require('../routes/taskRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// Export the handler for Vercel
const serverless = require('serverless-http');
module.exports = serverless(app);
