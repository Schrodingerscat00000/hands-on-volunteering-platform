const { Sequelize, DataTypes } = require('sequelize');
const Team = require('./Team');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres' }
);

const db = {};
db.User = require('./User')(sequelize, DataTypes);
db.Event = require('./Event')(sequelize, DataTypes);
db.HelpRequest = require('./HelpRequest')(sequelize, DataTypes);
db.Team = require('./Team')(sequelize, DataTypes);
db.Comment = require('./Comment')(sequelize, DataTypes);

Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
module.exports = db;