const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');

exports.fetchAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
};

exports.addTask = [
  body('title', 'Title is required').not().isEmpty(),
  body('status', 'Status is required').not().isEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, status, priority, deadline } = req.body;
      const task = new Task({
        user: req.user.id,
        title,
        description,
        status,
        priority,
        deadline
      });

      const savedTask = await task.save();
      res.json(savedTask);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
];

exports.updateTask = async (req, res) => {
  const { title, description, status, priority, deadline } = req.body;

  const newTask = {};
  if (title) newTask.title = title;
  if (description) newTask.description = description;
  if (status) newTask.status = status;
  if (priority) newTask.priority = priority;
  if (deadline) newTask.deadline = deadline;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true });
    res.json(task);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    await Task.findByIdAndRemove(req.params.id);
    res.json({ success: "Task has been deleted" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
};
