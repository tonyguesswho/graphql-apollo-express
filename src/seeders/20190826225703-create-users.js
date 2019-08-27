'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'John',
          email: 'tony@gmail.com',
          password: 'password',
          role: "ADMIN",
          createdAt: Sequelize.literal('NOW()'),
          updatedAt: Sequelize.literal('NOW()')
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
