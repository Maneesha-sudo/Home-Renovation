// controllers/templateController.js
const supabase = require('../config/supabaseClient');

const listTemplates = async (req, res) => {
  try {
    const { data, error } = await supabase.from('templates').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json({ templates: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { listTemplates };