// backend/models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    organizerId: { type: DataTypes.INTEGER }, // Links to User
    teamId: { type: DataTypes.INTEGER }
  });

  

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'organizerId', as: 'organizer' });
    Event.belongsToMany(models.User, { through: 'UserEvents', as: 'attendees' });
    Event.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
  };
  return Event;
};