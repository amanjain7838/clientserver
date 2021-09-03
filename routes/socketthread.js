var models  = require('../models');
const { Op } = require("sequelize");

module.exports = function() { 
  this.savesocketlogs=function(message){
      models.userfriends.findOne({
        where: {
            [Op.or]:[
              {
                userid:message['receiver'],
                friendid:message['sender']
              },
              {
                userid:message['sender'],
                friendid:message['receiver']
              }
            ],
        },
        order: [ [ 'createdAt', 'ASC' ]],
      }).then(function(result) {
        message['userrelationid']=result['dataValues']['id'];
        createthread(message);
      });
      // models.thread.findAll({
      //     where: {senderId:1},  include: [
      //       {
      //         model: models.user,
      //         as:'user_sender_id',
      //         required: true
      //       },
      //       {
      //         model: models.user,
      //         as:'user_receiver_id',
      //         required: true
      //       }
      //     ]
      // }).then(function(data){
      //     console.log(data)
      // });
  }
  this.retrieveSocketlogs=function(data){
    return retrieveSocketlogs(data);
  }
  const createthread=(message)=>{
    console.log(message['userrelationid'])
    models.thread.create({
        senderId:message['sender'],
        receiverId:message['receiver'],
        message:message['text'],
        userRelation:message['userrelationid']
    });
  }
  const retrieveSocketlogs=(data)=>{
    return models.thread.findAll({
        where: {
            [Op.or]:[
              {
                receiverId:data['userid'],
                senderId:data['friendid']
              },
              {
                senderId:data['userid'],
                receiverId:data['friendid']
              }
            ],
        },
        order: [ [ 'createdAt', 'ASC' ]],
    }).then(function(result) {
        return result;
    });
  }
}
