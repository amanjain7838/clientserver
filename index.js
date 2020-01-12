let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
 
var rooms = [];

io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    socket.leave(socket.room);
    io.emit('users-changed', {user: socket.username, event: 'left'});   
  });
 
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });
  
  socket.on('send-message', (message) => {
    io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });

  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, user: socket.username, created: new Date()});    
  });


  socket.on('createroom', function (data) {
      var new_room = ("" + Math.random()).substring(2, 7);
      rooms.push(new_room);
      data.room = new_room;
      socket.emit('updatechat', 'SERVER', 'Your room is ready, invite someone using this ID:' + new_room);
      socket.emit('roomcreated', data);
  });


  socket.on('sendchat', function (data) {
      io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });

});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});