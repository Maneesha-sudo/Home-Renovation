const supabase = require('../config/supabaseClient');

const addTask = async (req, res) => {
  try {
    const task = { ...req.body };
    const { data, error } = await supabase.from('tasks').insert([task]);
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ task: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listTasks = async (req, res) => {
  try {
    const { project_id } = req.query;
    const { data, error } = await supabase.from('tasks').select('*').eq('project_id', project_id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ tasks: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addTask, listTasks };