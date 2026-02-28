const express = require('express');
const router = express.Router();
const { addProject, listProjects, deleteProject } = require('../controllers/projectController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addProject);
router.get('/', authenticate, listProjects);
router.delete('/:id', authenticate, deleteProject);

module.exports = router;