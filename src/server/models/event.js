module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    Theme: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    caption: DataTypes.STRING,
    date: DataTypes.DATE,
    venue: DataTypes.INTEGER,
    time: DataTypes.TIME
  });
  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Event.belongsTo(models.Centre, {
      foreignKey: 'centreId',
      onDelete: 'CASCADE',
    });
  };
  return Event;
};
