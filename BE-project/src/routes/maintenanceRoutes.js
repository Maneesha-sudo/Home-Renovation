const express = require('express');
const router = express.Router();
const { addMaintenance, listMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenanceController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addMaintenance);
router.get('/', authenticate, listMaintenance);
router.put('/:id', authenticate, updateMaintenance);
router.delete('/:id', authenticate, deleteMaintenance);

module.exports = router;