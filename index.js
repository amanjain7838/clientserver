const express = require('express');
const app = express();
let http = require('http').Server(app);
// const  bodyParser  =  require('body-parser');
const cors = require('cors')
// const  sqlite3  =  require('sqlite3').verbose();
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs');
const SECRET_KEY = "secretkey23456";
require('./routes/socketthread.js')();

// let io = require('socket.io')(http);
// const friendsRouter = require('./routes/friends.js');  
// let server = app.listen(3000);
let io = require('socket.io')(http);

let userRouter = require('./routes/user');  
// let socketRouter = require('./routes/socket');  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
// app.use('/socket', socketRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status=404;
  next(error);
})
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  })
})
var rooms = [];
var currectactiveuser=[];

io.on('connection', (socket) => {
  	socket.on('disconnect', function(){
    	socket.leave(socket.room);
  	});
	socket.on('setroom', (data) => {
		    socket.join(data.roomowner);
	});
	socket.on('get-chathistory', (params) => {
	    getSocketlogs(params).then(function(chatdata){
	    	io.to(params.userid).emit('chathistory', chatdata);	
	    });
  	});
  	socket.on('send-message', (message) => {
	    let data={message: message.text,senderId:message.sender,receiverId:message.receiver, createdAt: new Date()};
	    io.to(message.receiver).emit('message',data );
	    io.to(message.receiver).emit('notifyusermessage',data);
	    setSocketlogs(message);
  	});
});
function setSocketlogs(message)
{
  savesocketlogs(message);
}
function getSocketlogs(data)
{
	return retrieveSocketlogs(data);
}
 
var port = process.env.PORT || 3001;

http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});