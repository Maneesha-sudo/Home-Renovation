const express = require('express');
const router = express.Router();
const { addInventory, listInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addInventory);
router.get('/', authenticate, listInventory);
router.put('/:id', authenticate, updateInventory);
router.delete('/:id', authenticate, deleteInventory);

module.exports = router;