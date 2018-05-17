exports.Client = class {
	constructor(sock, cc) {
		this.cc = cc;
		this.sock = sock;
		this.game = null;

		var parent = this;
		this.sock.on('error', function(error) {
			parent.error(error);
		});
		
		this.sock.on('message', function(msg) {
			parent.handle(msg.split('|'));
		});

		this.sock.on('close', function() {
			if (parent.game) parent.game.disconnect(parent);
		});
	}

	send(type) {
		var msg = type;
		for (var i = 1; i < arguments.length; i++) {
			msg += `|${arguments[i]}`;
		}

		if (this.sock.readyState == 1) this.sock.send(msg);
		else if (this.game) this.game.disconnect(this);
	}

	error(error) {
		// pass
	}

	handle(msg) {
		if (msg[0] == 'JOIN')
			this.cc(this, msg[1]);

		if (this.game)
			this.game.message(this, msg);
	}
}