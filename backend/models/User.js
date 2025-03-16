
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING }, // e.g., "+1234567890"
    location: { type: DataTypes.STRING }, // e.g., "New York, NY"
    bio: { type: DataTypes.TEXT }, // Short description
    skills: { type: DataTypes.JSON }, // e.g., ["teaching", "coding"]
    causes: { type: DataTypes.JSON } // e.g., ["environment", "education"]
  });
  User.associate = (models) => {
    User.hasMany(models.Event, { foreignKey: 'organizerId', as: 'events' });
    User.hasMany(models.HelpRequest, { foreignKey: 'userId', as: 'helpRequests' });
  };
  return User;
};