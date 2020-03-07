var models  = require('../models');
module.exports = function() { 
  this.savesocketlogs=function(message){
      createthread(message);
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
  const createthread=(message)=>{
    models.thread.create({
        senderId:message['sender'],
        receiverId:message['receiver'],
        message:message['text'],
    });
  }
}
