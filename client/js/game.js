var network;

$(function() {

	var gamearea = $('#gamearea');
	var markers = $('#markers').children();
	var connectiondiv = $('#connection');

	var children = $('#board').children();
	
	var status = $('#status');
	var statusmsg = $('#message');

	network = null;
	var team = null;
	var turn = null;
	var waiting = true;
	var colors = {
		'1': '#ff5959',
		'2': '#6959ff'
	};

	gamearea.hide();
	status.hide();

	$('#connect').click(function() {
		var server = $('#server').val();
		var game = $('#game').val();

		$('#connect').html('Connecting...');
		$('#connect').attr('disabled', 'disabled')

		network = new Network(server, game, function(success, network, error) {
			$('#connect').removeAttr('disabled');
			$('#connect').html('Connect');
			if (success) {
				$('#lobby').html(game);

				gamearea.show();
				connectiondiv.hide();

				network.send('JOIN', game);
			} else {
				status.show();
				if (error == null) {
					statusmsg.html('Could not connect to server');				
				} else {
					statusmsg.html(error);
				}
			}
		});

		network.handle = function(msg) {
			if (msg[0] == 'PLACE') {
				var color = colors[msg[3]];
				var posn = {
					x: parseInt(msg[1]),
					y: parseInt(msg[2])
				};
				console.log(posn, color);

				placeDisk(posn, color);
			}

			if (msg[0] == 'STATE') {
				for (var i = 1; i < msg.length; i+=3) {

					var color = colors[msg[i+2]];
					var posn = {
						x: parseInt(msg[i]),
						y: parseInt(msg[i+1])
					};

					placeDisk(posn, color);

				}
			}

			if (msg[0] == 'TEAM') {
				team = msg[1];

				if (team == 4) {
					$('#tooltip').html('You are spectating');
				}
			}

			if (msg[0] == 'TURN') {
				turn = msg[1];
			}

			if (msg[0] == 'PLAYERS') {
				if (msg[1] == 1 && team != 4) $('#tooltip').html('Waiting for opponent to join...');
				
				if (msg[1] == '1' && msg[2] == '1') waiting = false;
			}

			if (msg[0] == 'SPEC') {
				$('#spec').html(msg[1]);
			}

			if (turn == team && !waiting && team != 4) {
				$('#tooltip').html('It\'s your turn!');
			}

			if (turn != team && !waiting && team != 4) {
				$('#tooltip').html('It\'s your opponents turn');
			}
		}
	});

	children.each(function(idx, child) {
		$(child).attr('index', idx);
	});

	children.click(function(event) {
		var posn = getCoord(event.target);

		network.send('PLACE', posn.x, posn.y);
	});

	children.mouseover(function(event) {
		var posn = getCoord(event.target);
		setMarker(posn.x);
	});

	function getCoord(element) {
		var y = 0;
		var index = $(element).attr('index');
		var count = index;
		while (count > 6) {
			count -= 7;
			y++;
		}
		return {x: index - (y * 7), y: y};
	}

	function placeDisk(posn, color) {
		var element = children[(posn.y * 7) + posn.x];
		var circle = $('<div></div>')[0];

		$(circle).mouseover(function(event) {
			var parent = $(event.target.parentElement);
			var posn = getCoord(parent);
			setMarker(posn.x);
		});

		circle.style['background'] = color;
		$(circle).attr('class', 'circle');
		$(element).empty();
		$(element).append(circle);
	}

	function setMarker(position) {
		if (isNaN(position)) return;

		$(markers).empty();

		var element = $(markers[position])
		var marker = $('<div></div>')[0];
		$(marker).attr('class', 'marker');
		$(element).append(marker);
	}
});
