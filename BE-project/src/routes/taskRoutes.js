const express = require('express');
const router = express.Router();
const { addTask, listTasks } = require('../controllers/taskController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addTask);
router.get('/', authenticate, listTasks);

module.exports = router;