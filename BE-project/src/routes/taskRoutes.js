const express = require('express');
const router = express.Router();
const { addTask, listTasks, updateTask } = require('../controllers/taskController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addTask);            // Create task
router.get('/', authenticate, listTasks);           // List tasks
router.patch('/:id', authenticate, updateTask);     // Update task (move/change title)

module.exports = router;