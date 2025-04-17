const Task = require('../models/Task');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const config = require('../config/config');


// Create a task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Get all tasks for manager
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user.id });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      assignedBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task removed' });
  } catch (err) {
    next(err);
  }
};

// Send approval email
// backend/controllers/taskController.js
exports.sendApprovalEmail = async (req, res, next) => {
  try {
    // 1. Validate task exists
    const task = await Task.findOne({
      _id: req.params.id,
      assignedBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(500).json({ message: 'Email service not configured' });
    }

    // 3. Validate recipient email
    if (!task.assignedTo) {
      return res.status(400).json({ message: 'No recipient email specified' });
    }

    // 4. Generate token if missing
    if (!task.token) {
      task.token = uuidv4();
      await task.save();
    }

    // 5. Configure transporter with error handling
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } catch (transportError) {
      console.error('Transport creation failed:', transportError);
      return res.status(500).json({ message: 'Email service configuration error' });
    }
console.log(task,"task email data");
    // 6. Send email
    try {
      await transporter.sendMail({
        from: `"Task Manager" <${process.env.EMAIL_USER}>`,
        to: task.assignedTo,
        subject: `Task Approval: ${task.title}`,
        html: `
        <h2>Task Approval Request</h2>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description}</p>
        <a href="${process.env.FRONTEND_URL}/respond/${task.token}">
          Click here to approve/reject
        </a>
      `
      });
      return res.json({ message: 'Approval email sent successfully' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send email',
        error: emailError.response 
      });
    }

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: err.message 
    });
  }
};

// Handle task response from email link
exports.handleTaskResponse = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { action } = req.body;

    const task = await Task.findOne({ token });

    if (!task) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    if (task.tokenUsed) {
      return res.status(400).json({ message: 'Token already used' });
    }

    task.status = action === 'approve' ? 'approved' : 'rejected';
    task.tokenUsed = true;
    await task.save();

    res.json({ 
      message: `Task ${task.status}`,
      task: {
        title: task.title,
        description: task.description,
        status: task.status,
      }
    });
  } catch (err) {
    next(err);
  }
};




// controllers/taskController.js
exports.respondToTask = async (req, res) => {
  try {
    const { token, action } = req.body;

    const task = await Task.findOne({ token }).populate('assignedBy', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Invalid token or task not found' });
    }

    if (task.status === 'approved' || task.status === 'rejected') {
      return res.status(400).json({ message: 'Task has already been responded to' });
    }

    if (action === 'approve') {
      task.status = 'approved';
    } else if (action === 'reject') {
      task.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await task.save();

    res.json({
      message: `Task has been ${task.status}`,
      title: task.title,
      assignedBy: task.assignedBy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
