'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Messages',
      [
        {
          text: 'Hello',
          userId: 1,
          createdAt: Sequelize.literal('NOW()'),
          updatedAt: Sequelize.literal('NOW()')
        },
        {
          text: 'World',
          userId: 1,
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
