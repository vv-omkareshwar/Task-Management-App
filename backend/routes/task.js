const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const taskController = require('../controllers/task');

// Route 1: Get all tasks for a logged-in user
router.get('/', fetchuser, taskController.fetchAllTasks);

// Route 2: Add a new task
router.post('/', fetchuser, taskController.addTask);

// Route 3: Update an existing task
router.put('/:id', fetchuser, taskController.updateTask);

// Route 4: Delete a task
router.delete('/:id', fetchuser, taskController.deleteTask);

module.exports = router;
