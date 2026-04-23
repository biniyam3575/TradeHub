const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    const userExists = await User.findByEmail(email);
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const userId = await User.create({ full_name, email, password, role });
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.full_name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};