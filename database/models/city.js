const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      City.hasMany(models.District, { foreignKey: "cityId" });
      City.belongsTo(models.Province, { foreignKey: "provinceId" });
    }
  }
  City.init(
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
      provinceId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Provinces",
          },
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      name: {
        singular: "city",
        plural: "cities",
      },
    }
  );
  return City;
};
