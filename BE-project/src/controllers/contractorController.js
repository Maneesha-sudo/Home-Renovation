// controllers/contractorController.js
const supabase = require('../config/supabaseClient');

/**
 * Add a new contractor
 * Accepts: { name, speciality, phone, email, past_projects, user_id (optional if auth exists) }
 */
const addContractor = async (req, res) => {
  try {
    const contractor = { ...req.body, user_id: req.user.id };

    const { data, error } = await supabase.from('contractors').insert([contractor]);
    if (error) return res.status(500).json({ message: error.message });

    console.log("Contractor added:", data[0]);
    res.status(201).json({ contractor: data[0] });
  } catch (err) {
    console.error("Error adding contractor:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * List contractors for a user
 */
const listContractors = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user_id;
    if (!userId) return res.status(400).json({ message: "user_id is required" });

    const { data, error } = await supabase.from('contractors').select('*').eq('user_id', userId);
    if (error) return res.status(500).json({ message: error.message });

    res.json({ contractors: data });
  } catch (err) {
    console.error("Error listing contractors:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update a contractor
 * Accepts contractor fields in body, params.id for contractor
 */
const updateContractor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id || req.body.user_id;

    if (!id) return res.status(400).json({ message: "Contractor id is required" });
    if (!userId) return res.status(400).json({ message: "user_id is required" });

    const { data, error } = await supabase
      .from('contractors')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(500).json({ message: error.message });
    res.json({ contractor: data[0] });
  } catch (err) {
    console.error("Error updating contractor:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a contractor
 */
const deleteContractor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id;

    if (!id) return res.status(400).json({ message: "Contractor id is required" });
    if (!userId) return res.status(400).json({ message: "user_id is required" });

    const { error } = await supabase
      .from('contractors')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: "Contractor deleted successfully" });
  } catch (err) {
    console.error("Error deleting contractor:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addContractor,
  listContractors,
  updateContractor,
  deleteContractor,
};