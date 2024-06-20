var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');


app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


var name;


io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('joining msg', (username) => {
    socket.username = username;
    io.emit('chat message', { type: 'join', name: username });
  });

  socket.on('disconnect', () => {
    io.emit('chat message', { type: 'leave', name: socket.username });
  });

  socket.on('chat message', (msg) => {
    msg.name = socket.username;
    socket.broadcast.emit('chat message', { type: 'chat', msg: msg });
  });
});

server.listen(3000, () => {
  console.log('Server listening on :3000');
});