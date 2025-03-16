// backend/models/Comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER },
    helpRequestId: { type: DataTypes.INTEGER }
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.HelpRequest, { foreignKey: 'helpRequestId' });
  };
  return Comment;
};