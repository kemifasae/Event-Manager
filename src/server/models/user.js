module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    isAdmin: DataTypes.INTEGER
  });
  User.associate = (models) => {
    User.hasMany(models.Event, {
      foreignKey: 'userId',
    });
  };
  return User;
};
