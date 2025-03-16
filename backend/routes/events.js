// backend/routes/events.js
const express = require('express');
const router = express.Router();
const { Event, User } = require('../models');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', async (req, res) => {
  const { category, location, date } = req.query;
  const where = {};
  if (category) where.category = category;
  if (location) where.location = location;
  if (date) where.date = date;
  try {
    const events = await Event.findAll({ where });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, date, time, location, category } = req.body;
  try {
    // Optional: Validate category against a predefined list
    const validCategories = ['environment', 'education', 'healthcare', 'poverty', 'animal_welfare', 'human_rights'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      organizerId: req.user.id // Assuming req.user.id from auth middleware
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    await event.addAttendee(req.user.id); // Sequelize method to add user to attendees
    res.json({ message: 'Joined event successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;