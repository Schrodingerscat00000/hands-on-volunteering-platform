const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { sequelize } = require('./models');
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database error:', err));
 
  

sequelize.sync({ force: false }).then(() => {
console.log('Database synced');
});

app.get('/', (req, res) => res.send('HandsOn Backend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/help-requests', require('./routes/helpRequests'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/teams', require('./routes/teams'));