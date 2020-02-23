const express = require('express')
const router = express.Router();
// var models  = require('../models');
// const app = express();
// let io = router.get("io");

// var server = app.listen(3000);
// let http = require('http').Server(app);
// let io = require('socket.io')(http, { path: '/connectsocket'});

var rooms = [];
router.get('/connectsocket',(req, res, next) => {
    console.log(req.io.sockets)
    req.io.on('connection', (socket) => {
          
          socket.on('disconnect', function(){
            socket.leave(socket.room);
            io.emit('users-changed', {user: socket.name, event: 'left'});   
          });
         
          socket.on('set-name', (name) => {
            socket.username = name;
            console.log(name)
            io.emit('users-changed', {user: name, event: 'joined'});    
          });
          
          // socket.on('send-message', (message) => {
          //   io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
          // });

          socket.on('add-message', (message) => {
            io.emit('message', {text: message.text, user: socket.username, created: new Date()});    
          });


          // socket.on('createroom', function (data) {
          //     var new_room = ("" + Math.random()).substring(2, 7);
          //     rooms.push(new_room);
          //     data.room = new_room;
          //     socket.emit('updatechat', 'SERVER', 'Your room is ready, invite someone using this ID:' + new_room);
          //     socket.emit('roomcreated', data);
          // });


          // socket.on('sendchat', function (data) {
          //     io.sockets.in(socket.room).emit('updatechat', socket.username, data);
          // });

    });
    // console.log(req.io)

});
router.get('/', (req, res, next) => {
        let responsearr={};
    // console.log(req.query.user)
        // responsearr['status']=0;
        // responsearr['message']='No result found';
        // responsearr['data']={};

        // models.user.findAll().then(function(user){
        //     if(user==null||user.length == 0)
        //         return res.status(200).json(responsearr);
        //     responsearr['status']=1;
        //     responsearr['message']='';
        //     responsearr['data']=user;
        // })
        // io.on('connection', (socket) => {
          
        //   socket.on('disconnect', function(){
        //     socket.leave(socket.room);
        //     io.emit('users-changed', {user: socket.username, event: 'left'});   
        //   });
         
        //   socket.on('set-name', (name) => {
        //     socket.username = name;
        //     console.log(name)
        //     io.emit('users-changed', {user: name, event: 'joined'});    
        //   });
          
        //   socket.on('send-message', (message) => {
        //     io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
        //   });

        //   socket.on('add-message', (message) => {
        //     io.emit('message', {text: message.text, user: socket.username, created: new Date()});    
        //   });


        //   socket.on('createroom', function (data) {
        //       var new_room = ("" + Math.random()).substring(2, 7);
        //       rooms.push(new_room);
        //       data.room = new_room;
        //       socket.emit('updatechat', 'SERVER', 'Your room is ready, invite someone using this ID:' + new_room);
        //       socket.emit('roomcreated', data);
        //   });


        //   socket.on('sendchat', function (data) {
        //       io.sockets.in(socket.room).emit('updatechat', socket.username, data);
        //   });

        // });
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

        return res.status(200).json(responsearr);


})


module.exports = router;