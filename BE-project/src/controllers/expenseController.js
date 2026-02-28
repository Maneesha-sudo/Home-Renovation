// src/controllers/expenseController.js
const supabase = require('../config/supabaseClient');

// Add new expense
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, project_id } = req.body;

    // Validation
    if (!title || !amount || !project_id) {
      return res.status(400).json({ message: 'Project ID, title, and amount are required' });
    }
    console.log("data", data);

    const expense = {
      user_id: req.user.id,          // associate with logged-in user
      project_id,
      title,
      amount: parseFloat(amount),
      category: category || 'Materials',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('expenses').insert([expense]).select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json({ expense: data[0] });
  } catch (err) {
    console.error('Add Expense Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// List all expenses for a project (only for the logged-in user)
const listExpenses = async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id query param is required' });

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('project_id', project_id)
      .eq('user_id', req.user.id); // only user's own expenses

    if (error) {
      console.error('Supabase Select Error:', error);
      return res.status(500).json({ message: error.message });
    }

    res.json({ expenses: data });
  } catch (err) {
    console.error('List Expenses Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete an expense (only if owned by the logged-in user)
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Supabase Delete Error:', error);
      return res.status(500).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete Expense Error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addExpense, listExpenses, deleteExpense };