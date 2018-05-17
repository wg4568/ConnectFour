class Grid {
	constructor(width, height, generator=function(x, y) { return 0; }) {
		this.flags = {};
		this.data = [];
		this.width = width;
		this.height = height;
		this.length = this.width * this.height;
		this.generator = generator;

		this.generate();
	}

	indexToPosn(index) {
		var y = Math.floor(index / this.width);
		var x = index - (y * this.width);
		return {x: x, y: y};
	}

	posnToIndex(x, y) {
		return (y * this.width) + x;
	}

	generate() {
		this.data = [];
		for (var i = 0; i < this.length; i++) {
			var coord = this.indexToPosn(i);
			var value = this.generator(coord.x, coord.y);
			this.data.push(value);
		}
	}

	fill(value) {
		for (var i = 0; i < this.length; i++) {
			this.data[i] = value;
		}
	}

	iterate(func) {
		var parent = this;
		this.data.forEach(function(value, index) {
			var posn = parent.indexToPosn(index);
			func(posn.x, posn.y, value);
		});
	}

	iterateRange(xmin, xmax, ymin, ymax, func) {
		for (var x = xmin; x < xmax; x++) {
			for (var y = ymin; y < ymax; y++) {
				var value = this.getPosn(x, y);
				func(x, y, value);
			}
		}
	}

	getPosn(x, y) {
		var index = this.posnToIndex(x, y);
		return this.data[index];
	}

	setPosn(x, y, value) {
		var index = this.posnToIndex(x, y);
		this.data[index] = value;
	}

	validPoint(x, y) {
		return x >= 0 && y >= 0
				&& x < this.width && y < this.height;
	}

	static IsGrid(obj) {
		return obj instanceof Grid;
	}
}

// some 'enums'
exports.EMPTY = 0;
exports.RED = 1;
exports.BLUE = 2;
exports.TIE = 3;
exports.SPEC = 4;

exports.Game = class {
	constructor() {
		this.grid = new Grid(7, 6, function(x, y) { return exports.EMPTY; });

		this.red = null;
		this.blue = null;

		this.turn = exports.RED;

		this.spectators = [];
	}

	drop(x, val) {

		var top = this.grid.getPosn(x, 0);
		if (top == exports.EMPTY) {
			var i = 0;
			while (this.grid.getPosn(x, i) == exports.EMPTY) i++;

			this.grid.setPosn(x, i - 1, val);
			return {x: x, y: i - 1};

		} else {
			return false;
		}

	}

	broadcast(type) {
		var data = [];
		for (var i = 1; i < arguments.length; i++) {
			data.push(arguments[i]);
		}

		if (this.red) this.red.send(type, ...data);
		if (this.blue) this.blue.send(type, ...data);
		this.spectators.forEach(function(s) {
			s.send(type, ...data);
		});
	}

	checkWin() {
		return false;
	}

	message(client, msg) {

		console.log(msg);

		if (msg[0] == 'PLACE') {
			var x = parseInt(msg[1]);
			var y = parseInt(msg[2]);
			var prev = this.turn;
			var r = false;

			if (this.turn == exports.RED && client == this.red) {
				r = this.drop(x, exports.RED);

				if (r) this.turn = exports.BLUE;
			}

			if (this.turn == exports.BLUE && client == this.blue) {
				r = this.drop(x, exports.BLUE);
			
				if (r) this.turn = exports.RED;
			}

			if (r) {
				this.broadcast('PLACE', r.x, r.y, prev);
				this.broadcast('TURN', this.turn);
			}

			var win = this.checkWin();
			if (win) this.broadcast('WIN', win);
		}

	}

	connect(user) {
		user.game = this;

		if (this.red == null) {
			this.red = user;
			user.send('TEAM', exports.RED);

		} else if (this.blue == null) {
			this.blue = user;
			user.send('TEAM', exports.BLUE);

		} else {
			this.spectators.push(user);
			user.send('TEAM', exports.SPEC);
		}

		this.broadcast('SPEC', this.spectators.length);
		this.broadcast('TURN', this.turn);
		this.broadcast('PLAYERS', this.red ? 1 : 0, this.blue ? 1 : 0);

		var data = [];
		this.grid.iterate(function(x, y, value) {
			if (value != exports.EMPTY) {
				data.push(x);
				data.push(y);
				data.push(value);				
			}
		});

		console.log(data);

		user.send('STATE', ...data);
	}

	disconnect(user) {
		if (user == this.red)
			this.red = null;
		if (user == this.blue)
			this.blue = null;

		var idx = this.spectators.indexOf(user);
		if (idx != -1) this.spectators.splice(idx, 1);

		this.broadcast('SPEC', this.spectators.length);
		this.broadcast('PLAYERS', this.red ? 0 : 1, this.blue ? 0 : 1);
	}
}