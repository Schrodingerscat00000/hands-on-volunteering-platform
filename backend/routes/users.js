const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
//const auth = require('../middleware/auth');

// Middleware to verify JWT
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader); // Debug
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.replace('Bearer ', '');
  console.log('Token:', token); // Debug
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug
    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, location, bio, skills, causes } = req.body;
  const validSkills = ['teaching', 'coding', 'gardening', 'healthcare', 'design', 'writing'];
  const validCauses = ['environment', 'education', 'healthcare', 'poverty', 'animal_welfare', 'human_rights'];

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    // Validate skills and causes
    if (skills && !skills.every(s => validSkills.includes(s))) {
      return res.status(400).json({ error: 'Invalid skill provided' });
    }
    if (causes && !causes.every(c => validCauses.includes(c))) {
      return res.status(400).json({ error: 'Invalid cause provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      bio,
      skills: skills || [],
      causes: causes || []
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log('No user ID in request');
      return res.status(401).json({ error: 'Authentication failed' });
    }
    console.log('Fetching profile for user ID:', req.user.id);
    const user = await User.findByPk(req.user.id, {
      attributes: ['name', 'email', 'phone', 'location', 'bio', 'skills', 'causes'],
      include: [
        { model: require('../models').Event, as: 'events', attributes: ['name', 'date'] },
        { model: require('../models').HelpRequest, as: 'helpRequests', attributes: ['title'] }
      ]
    });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {

  const { name, phone, location, bio, skills, causes } = req.body;
  const validSkills = ['teaching', 'coding', 'gardening', 'healthcare', 'design', 'writing'];
  const validCauses = ['environment', 'education', 'healthcare', 'poverty', 'animal_welfare', 'human_rights'];

  try {
    if (skills && !skills.every(s => validSkills.includes(s))) {
      return res.status(400).json({ error: 'Invalid skill provided' });
    }
    if (causes && !causes.every(c => validCauses.includes(c))) {
      return res.status(400).json({ error: 'Invalid cause provided' });
    }
    await User.update({ name, phone, location, bio, skills, causes }, { where: { id: req.user.id } });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['name', 'email', 'points', 'verifiedHours']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;