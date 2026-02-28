const supabase = require('../config/supabaseClient');

const addInventory = async (req, res) => {
  try {
    const item = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase.from('inventory').insert([item]);
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ inventory: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listInventory = async (req, res) => {
  try {
    const { data, error } = await supabase.from('inventory').select('*').eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ inventory: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('inventory').update(updates).eq('id', id).eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ inventory: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('inventory').delete().eq('id', id).eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addInventory, listInventory, updateInventory, deleteInventory };