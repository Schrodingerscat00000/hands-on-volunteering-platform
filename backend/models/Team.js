module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define('Team', {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // true = public, false = private
      ownerId: { type: DataTypes.INTEGER, allowNull: false } // Links to creator
    });
    Team.associate = (models) => {
      Team.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
      Team.belongsToMany(models.User, { through: 'TeamMembers', as: 'members' });
      Team.hasMany(models.Event, { foreignKey: 'teamId', as: 'events' });
    };
    return Team;
  };