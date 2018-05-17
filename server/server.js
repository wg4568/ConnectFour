const websocket = require('ws');

const client = require('./client.js');
const game = require('./game.js');

const server = new websocket.Server({ port: 5500 });

var games = {};

server.on('connection', function(conn) {
	var c = new client.Client(conn, function(client, name) {
		if (name in games) {
			games[name].connect(client);
		} else {
			games[name] = new game.Game();
			games[name].connect(client);
		}
	});

	console.log(games);
});