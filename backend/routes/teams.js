const express = require('express');
const router = express.Router();
const { Team, User, Event } = require('../models');
const auth = require('../middleware/auth');

// Create a team
router.post('/', auth, async (req, res) => {
  const { name, description, isPublic } = req.body;
  try {
    const team = await Team.create({ name, description, isPublic, ownerId: req.user.id });
    await team.addMember(req.user.id); // Owner is a member
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all public teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({ where: { isPublic: true }, include: [{ model: User, as: 'owner', attributes: ['name'] }] });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join a public team
router.post('/:id/join', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (!team.isPublic) return res.status(403).json({ error: 'This is a private team' });
    await team.addMember(req.user.id);
    res.json({ message: 'Joined team successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get team dashboard
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['name'] },
        { model: User, as: 'members', attributes: ['name'] },
        { model: Event, as: 'events', attributes: ['title', 'date'] }
      ]
    });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (!team.isPublic && !team.members.some(m => m.id === req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized access to private team' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard (top 5 teams by event count)
router.get('/leaderboard', async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [{ model: Event, as: 'events' }],
      order: [[sequelize.fn('COUNT', sequelize.col('events.id')), 'DESC']],
      group: ['Team.id'],
      limit: 5
    });
    res.json(teams.map(t => ({ name: t.name, eventCount: t.events.length })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;