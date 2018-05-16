class Network {
	constructor(addr, callback) {
		this.addr = addr;

		try {
			this.sock = new WebSocket(addr);
		} catch (DOMException) {
			callback(false, this, 'Invalid URL');
		}

		var parent = this;
		this.sock.onopen = function() {
			callback(true, parent);
		}

		this.sock.onerror = function() {
			callback(false, parent);
		}

		this.sock.onmessage = function(message) {
			parent.handle(message);
		}
	}

	handle(message) {
		console.log(message);
	}

	click(posn) {
		this.sock.send(`CLICK:${posn.x}:${posn.y}`);
	}
}