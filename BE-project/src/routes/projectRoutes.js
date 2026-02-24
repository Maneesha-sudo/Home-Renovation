const express = require('express');
const router = express.Router();
const { addProject, listProjects } = require('../controllers/projectController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addProject);
router.get('/', authenticate, listProjects);



module.exports = router;