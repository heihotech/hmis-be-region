module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Addresses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fullAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rw: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      villageId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Villages",
          },
          key: "id",
        },
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Addresses");
  },
};
