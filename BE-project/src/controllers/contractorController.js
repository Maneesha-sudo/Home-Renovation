const supabase = require('../config/supabaseClient');

const addContractor = async (req, res) => {
  try {
    const contractor = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase.from('contractors').insert([contractor]);
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ contractor: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listContractors = async (req, res) => {
  try {
    const { data, error } = await supabase.from('contractors').select('*').eq('user_id', req.user.id);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ contractors: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addContractor, listContractors };