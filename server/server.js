var path = require('path');
var express = require('express');
var getDistance = require('./helpers').getDistance;

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

	socket.on('getting clients', function() {
		var index = currentConnections.map(function(e) { return e.id; }).indexOf(socket.id);
		var clientMe = currentConnections[index];
			var clients = currentConnections.filter(function(item) {
			if(item.coords) {
				var distance = getDistance(clientMe.coords.latitude, clientMe.coords.longitude, item.coords.latitude, item.coords.longitude);
				item.distance = distance;
				return distance !== 0 && distance <= 1 && (item.id !== clientMe.id);
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
		currentConnections = currentConnections.filter(function(item) {return item.id != socket.id});

		socket.broadcast.emit('get clients');
	});
});

var port = process.env.PORT || 80

http.listen(port, function(err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at ' + port + ' port');
});
