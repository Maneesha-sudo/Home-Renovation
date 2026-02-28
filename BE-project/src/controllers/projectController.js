const supabase = require('../config/supabaseClient');

// Add new project
const addProject = async (req, res) => {
  try {
    const { name, description, budget, status } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = {
      title: name,
      description: description || '',
      budget: budget || 0,
      status: status || 'planning',
      user_id: req.user.id
      
    };

    const { data, error } = await supabase.from('projects').insert([project]).select();
    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({ project: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// List projects
const listProjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });

    res.json({ projects: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ message: error.message });
    if (data.length === 0) return res.status(404).json({ message: 'Project not found' });

    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addProject, listProjects, deleteProject };