const supabase = require('../config/supabaseClient');

const addProject = async (req, res) => {
  try {
    const project = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase.from('projects').insert([project]);
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ message: 'Project created', project: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listProjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ projects: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addProject, listProjects };