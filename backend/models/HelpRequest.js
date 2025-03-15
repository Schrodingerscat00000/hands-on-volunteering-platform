module.exports = (sequelize, DataTypes) => {
  const HelpRequest = sequelize.define('HelpRequest', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    urgency: {
      type: DataTypes.ENUM('low', 'medium', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    userId: { type: DataTypes.INTEGER } // Links to the poster
  });
  HelpRequest.associate = (models) => {
    HelpRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'poster' });
    HelpRequest.hasMany(models.Comment, { as: 'comments' });
  };
  return HelpRequest;
};