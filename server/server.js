const websocket = require('ws');

const client = require('./client.js');
const game = require('./game.js');

const server = new websocket.Server({ port: 5500 });

var g = new game.Game();

server.on('connection', function(conn) {
	var c = new client.Client(conn);
	g.connect(c);
});