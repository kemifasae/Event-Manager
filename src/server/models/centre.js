module.exports = (sequelize, DataTypes) => {
  const Centre = sequelize.define('Centre', {
    Name: DataTypes.STRING,
    buildingNo: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pixUrl: DataTypes.STRING,
  });
  Centre.associate = (models) => {
    Centre.hasMany(models.Event, {
      foreignKey: 'centreId',
      onDelete: 'CASCADE',
    });
  };
  return Centre;
};
