const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  sendApprovalEmail,
  handleTaskResponse,
} = require("../controllers/taskController");
const Task = require("../models/Task");

router.route("/").get(protect, getTasks).post(protect, createTask);

router
  .route("/:id")
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.post("/:id/send-approval", protect, sendApprovalEmail);

router.get("/respond/:token", async (req, res) => {
  try {
    const task = await Task.findOne({ token: req.params.token }).populate(
      "assignedBy",
      "name"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error); // See logs for 500
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/respond/:token", handleTaskResponse);

module.exports = router;
