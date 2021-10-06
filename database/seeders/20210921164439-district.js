const districts = require("./sources/districts.js");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Districts", districts);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Districts", null, {});
  },
};
