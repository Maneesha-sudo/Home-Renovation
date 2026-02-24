const express = require('express');
const router = express.Router();
const { addExpense, listExpenses } = require('../controllers/expenseController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/', authenticate, addExpense);
router.get('/', authenticate, listExpenses);

module.exports = router;