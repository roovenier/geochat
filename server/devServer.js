var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack.config.dev');
var getDistance = require('./helpers').getDistance;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

var currentConnections = [];

io.on('connection', function(socket){
	console.log('user connected with id ' + socket.id);
	socket.id = socket.id.slice(2);

	currentConnections.push({id: socket.id});

	socket.on('getting clients', function() {
		var index = currentConnections.map(function(e) { return e.id; }).indexOf(socket.id);
		var clientMe = currentConnections[index];
			var clients = currentConnections.filter(function(item) {
			if(item.coords) {
				var distance = getDistance(clientMe.coords.latitude, clientMe.coords.longitude, item.coords.latitude, item.coords.longitude);
				item.distance = distance;
				return distance !== 0 && distance <= 5 && (item.id !== clientMe.id);
			} else {
				return false;
			}
		});

		io.to('/#' + socket.id).emit('setting clients', clients);
	});

	socket.on('setting client metadata', function(data) {
		var index = currentConnections.map(function(e) { return e.id; }).indexOf(socket.id);
		currentConnections[index].colors = {name: data.colors.colorName, hex: data.colors.colorHex};
		currentConnections[index].coords = data.coords;

		io.to('/#' + socket.id).emit('set my client data', currentConnections[index]);
		socket.broadcast.emit('get clients');
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

		socket.broadcast.emit('get clients');
	});
});

http.listen(3000, function(err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://localhost:3000');
});
