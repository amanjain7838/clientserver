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
    	io.emit('users-changed', {user: socket.username, event: 'left'});   
  	});
 
	socket.on('setroom', (data) => {
		    let roomfound=0;    
		    var new_room = ("" + Math.random()).substring(2, 7);
		    for(var i=0;i<currectactiveuser.length;i++)
		    {
		      if((currectactiveuser[i]['friendid']==data.userid&&currectactiveuser[i]['userid']==data.friendid)||(currectactiveuser[i]['userid']==data.friendid&&currectactiveuser[i]['friendid']==data.userid)||(currectactiveuser[i]['friendid']==data.friendid&&currectactiveuser[i]['userid']==data.userid))
		      {
		        roomfound=1;
		        new_room=currectactiveuser[i]['roomid'];
		        break;
		      }
		    }
		    getSocketlogs(data).then(function(chatdata){
		    	socket.emit('chathistory', chatdata);	
		    });
		    // socket.leave(currentRoom);
		    socket.join(new_room);
		    let chatdetails={};
		    if(!roomfound)
		    {
		      chatdetails['friendid']=data.friendid;
		      chatdetails['userid']=data.userid;
		      chatdetails['roomid']=new_room;
		      currectactiveuser.push(chatdetails);
		    }
		    console.log(currectactiveuser)
		    socket.emit('listenroomid', {
		      content: new_room
		    })

	});

  	socket.on('send-message', (message) => {
	    let data={message: message.text,senderId:message.sender,receiverId:message.receiver, createdAt: new Date()};
	    io.to(message.roomid).emit('message',data );
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