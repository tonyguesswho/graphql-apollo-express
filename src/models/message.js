'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    Message.associate = models => {
      Message.belongsTo(models.User);
    };

  };
  return Message;
};