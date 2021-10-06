const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.Village, { foreignKey: "villageId" });
    }
  }
  Address.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      fullAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rw: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      villageId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Villages",
          },
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      name: {
        singular: "address",
        plural: "addresses",
      },
    }
  );
  return Address;
};
