var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var currentConnections = [];

io.on('connection', function(socket){
	socket.id = socket.id.slice(2);
  console.log('a user connected');

  //currentConnections.push({id: socket.id, coords: {latitude: 0, longitude: 0}});
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
    console.log('user disconnected');
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
