'use strict';
var user = require('./user');

module.exports = (sequelize, DataTypes) => {
  const userfriends = sequelize.define('userfriends', {
    userid:{
      type: DataTypes.INTEGER,
    },
    friendid:{
      type:DataTypes.INTEGER,
    }
  }, {});
  userfriends.associate = function(models) {
    // associations can be defined here
    // models.user.hasMany(models.userfriends)
    // models.userfriends.hasOne(models.user, { as: 'HomeTeam', foreignKey: 'homeTeamId' });

    models.userfriends.belongsTo(models.user, {foreignKey : 'friendid',targetKey:userfriends.friendid});
  };
  return userfriends;
};