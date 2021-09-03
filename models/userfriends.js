'use strict';
var user = require('./user');
var thread = require('./thread');

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
    userfriends.belongsTo(models.user, { as:'muserid',foreignKey: 'userid' });
    userfriends.belongsTo(models.user, { as:'sfriendid',foreignKey: 'friendid' });
    userfriends.hasMany(models.thread,{foreignKey:'userRelation'});

    // models.userfriends.belongsTo(models.user, {foreignKey : 'friendid',targetKey:userfriends.friendid});
  };
  return userfriends;
};