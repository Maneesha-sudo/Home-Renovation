const supabase = require('../config/supabaseClient');

const addMaintenance = async (req, res) => {
  try {
    const item = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase.from('maintenance').insert([item]);
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ maintenance: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listMaintenance = async (req, res) => {
  try {
    const { data, error } = await supabase.from('maintenance').select('*').eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ maintenance: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('maintenance').update(updates).eq('id', id).eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ maintenance: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('maintenance').delete().eq('id', id).eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Maintenance item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addMaintenance, listMaintenance, updateMaintenance, deleteMaintenance };