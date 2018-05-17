class Network {
	constructor(addr, game, callback) {
		this.addr = addr;
		this.game = game;

		try {
			this.sock = new WebSocket(addr);
		} catch (DOMException) {
			callback(false, this, 'Invalid URL');
			return;
		}

		if (this.game == '') {
			callback(false, this, 'Game name cannot be blank');
			return;
		}

		var parent = this;
		this.sock.onopen = function() {
			callback(true, parent);
		}

		this.sock.onerror = function() {
			callback(false, parent);
		}

		this.sock.onmessage = function(message) {
			console.log(message);
			parent.handle(message.data.split('|'));
		}
	}

	send(type) {
		var msg = type;
		for (var i = 1; i < arguments.length; i++) {
			msg += `|${arguments[i]}`;
		}
		this.sock.send(msg);
	}

	handle(message) {}

	click(posn) {
		this.sock.send(`CLICK:${posn.x}:${posn.y}`);
	}
}