const supabase = require('../config/supabaseClient');

// Add a new task
const addTask = async (req, res) => {
  try {
    const { project_id, title, status = "todo" } = req.body;

    if (!project_id || !title || !user_id) {
      return res.status(400).json({ message: "Project, title are required" });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ project_id, title, status, user_id }])
      .select();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({ task: data[0] });
  } catch (err) {
    console.error("Add Task Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// List tasks for a project
const listTasks = async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id) return res.status(400).json({ message: "project_id required" });

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', project_id);

    if (error) return res.status(500).json({ message: error.message });

    res.json({ tasks: data });
  } catch (err) {
    console.error("List Tasks Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update task (e.g., move between columns)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title } = req.body;

    if (!id) return res.status(400).json({ message: "Task ID is required" });

    const { data, error } = await supabase
      .from('tasks')
      .update({ status, title })
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ message: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: "Task not found" });

    res.json({ task: data[0] });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addTask, listTasks, updateTask };