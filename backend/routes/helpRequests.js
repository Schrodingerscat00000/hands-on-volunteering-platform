const express = require('express');
const router = express.Router();
const { HelpRequest } = require('../models');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const requests = await HelpRequest.findAll({
      include: [
        { model: User, as: 'poster', attributes: ['name'] },
        { model: Comment, as: 'comments', include: [{ model: User, attributes: ['name'] }] }
      ]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, urgency } = req.body;
  try {
    const validUrgencies = ['low', 'medium', 'urgent'];
    if (urgency && !validUrgencies.includes(urgency)) {
      return res.status(400).json({ error: 'Invalid urgency level' });
    }
    const request = await HelpRequest.create({
      title,
      description,
      urgency: urgency || 'medium', // Default to medium if not provided
      userId: req.user.id
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/offer', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    // Optionally track volunteers in a junction table (e.g., HelpRequestVolunteers)
    // For simplicity, we'll just return a success message here
    res.json({ message: 'Help offered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
router.post('/:id/comments', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const request = await HelpRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    const comment = await Comment.create({
      content,
      userId: req.user.id,
      helpRequestId: req.params.id
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;