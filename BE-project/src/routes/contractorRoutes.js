const express = require('express');
const router = express.Router();
const { addContractor, listContractors } = require('../controllers/contractorController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addContractor);
router.get('/', authenticate, listContractors);

module.exports = router;