var path = require('path');
var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/static', express.static('static'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var currentConnections = [];

io.on('connection', function(socket){
	socket.id = socket.id.slice(2);

  currentConnections.push({id: socket.id});
  io.emit('getting clients', currentConnections);

  socket.on('setting client metadata', function(data) {
  	var index = currentConnections.map(function(e) { return e.id; }).indexOf(socket.id);
	currentConnections[index].colors = {name: data.colorName, hex: data.colorHex};
	io.emit('getting clients', currentConnections);
  });

  socket.on('setting geoCoords', function(coords) {
	  var index = currentConnections.map(function(e) { return e.id; }).indexOf(socket.id);
	  currentConnections[index].coords = coords;
	  io.emit('getting clients', currentConnections);
  });

  socket.on('adding message', function(obj) {
	  io.to('/#' + obj.recipient).emit('getting message', {sender: obj.sender, message: obj.message});
  });

  socket.on('adding notification', function(obj) {
	  io.to('/#' + obj.recipient).emit('getting notification', {recipient: obj.recipient, sender: obj.sender});
  });

  socket.on('disconnect', function(){
	currentConnections = currentConnections.filter(function(item) {return item.id != socket.id});
	io.emit('getting clients', currentConnections);
  });
});

http.listen(3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
