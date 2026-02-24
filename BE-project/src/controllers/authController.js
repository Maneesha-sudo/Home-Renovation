const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (existingError) {
      return res.status(500).json({ message: existingError.message });
    }

    // Safely check if any user exists
    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashed }])
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(500).json({ message: 'User creation failed' });
    }

    res.status(201).json({
      message: 'User created',
      user: data[0]
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Safely check if user exists
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = data[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };