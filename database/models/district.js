const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      District.hasMany(models.Village, { foreignKey: "districtId" });
      District.belongsTo(models.City, { foreignKey: "cityId" });
    }
  }
  District.init(
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
      cityId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Cities",
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
        singular: "district",
        plural: "districts",
      },
    }
  );
  return District;
};
