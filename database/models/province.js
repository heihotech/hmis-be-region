const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Province.hasMany(models.City, { foreignKey: "provinceId" });
    }
  }
  Province.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      name: {
        singular: "province",
        plural: "provinces",
      },
    }
  );
  return Province;
};
