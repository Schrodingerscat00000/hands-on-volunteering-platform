
const express = require('express');
const router = express.Router();

const categories = {
  skills: ['teaching', 'coding', 'gardening', 'healthcare', 'design', 'writing'],
  causes: ['environment', 'education', 'healthcare', 'poverty', 'animal_welfare', 'human_rights']
};

router.get('/', (req, res) => {
  res.json(categories);
});

module.exports = router;