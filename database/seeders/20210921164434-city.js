const cities = require("./sources/cities.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Cities", cities);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Cities", null, {});
  },
};
