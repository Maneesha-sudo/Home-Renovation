const express = require('express');
const router = express.Router();
const { addContractor, listContractors, updateContractor, deleteContractor } = require('../controllers/contractorController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/',authenticate, addContractor);
router.get('/', authenticate, listContractors);
router.put('/:id', authenticate, updateContractor);   // Edit contractor
router.delete('/:id', authenticate, deleteContractor); // Delete contractor

module.exports = router;