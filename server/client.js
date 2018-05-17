exports.Client = class {
	constructor(sock) {
		this.sock = sock;
		this.game = null;

		var parent = this;
		this.sock.on('error', function(error) {
			parent.error(error);
		});
		
		this.sock.on('message', function(msg) {
			parent.handle(msg.split('|'));
		});
	}

	send(type) {
		var msg = type;
		for (var i = 1; i < arguments.length; i++) {
			msg += `|${arguments[i]}`;
		}
		this.sock.send(msg);
	}

	error(error) {
		// pass
	}

	handle(msg) {
		this.game.message(this, msg);
	}
}