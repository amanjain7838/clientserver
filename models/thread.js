'use strict';
module.exports = (sequelize, DataTypes) => {
  const thread = sequelize.define('thread', {
    senderId: {
    	type:DataTypes.INTEGER,
    	allowNull:false,
    },
    receiverId: {
    	type:DataTypes.INTEGER,
    	allowNull:false,
    },
    message: {
    	type:DataTypes.STRING,
    	allowNull:false,
    }  }, {});
  thread.associate = function(models) {
    // associations can be defined here
    thread.belongsTo(models.user, { as:'user_sender_id',foreignKey: 'senderId' });
    thread.belongsTo(models.user, { as:'user_receiver_id',foreignKey: 'receiverId' });

  };
  return thread;
};