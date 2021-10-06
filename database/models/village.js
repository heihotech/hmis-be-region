const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Village extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Village.belongsTo(models.District, { foreignKey: "districtId" });
      Village.hasMany(models.Address, { foreignKey: "villageId" });
    }
  }
  Village.init(
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
      districtId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Districts",
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
        singular: "village",
        plural: "villages",
      },
    }
  );
  return Village;
};
