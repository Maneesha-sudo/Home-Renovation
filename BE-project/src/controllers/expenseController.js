const supabase = require('../config/supabaseClient');

const addExpense = async (req, res) => {
  try {
    const expense = { ...req.body };
    const { data, error } = await supabase.from('expenses').insert([expense]);
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ expense: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listExpenses = async (req, res) => {
  try {
    const { project_id } = req.query;
    const { data, error } = await supabase.from('expenses').select('*').eq('project_id', project_id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ expenses: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addExpense, listExpenses };