const villages = require("./sources/villages.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Villages", villages);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Villages", null, {});
  },
};
