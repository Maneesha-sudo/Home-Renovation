const express = require('express');
const router = express.Router();

const { addExpense, listExpenses, deleteExpense } = require('../controllers/expenseController');
const { authenticate } = require('../utils/authMiddleware');

// Routes
router.post('/',authenticate, addExpense);         // Add new expense
router.get('/', authenticate, listExpenses);       // List all expenses for a project
router.delete('/:id', authenticate, deleteExpense); // Delete an expense

module.exports = router;