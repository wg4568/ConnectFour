$(function() {

	var connectiondiv = $('#connection');
	var board = $('#board');
	var markerdiv = $('#markers');
	
	var status = $('#status');
	var statusmsg = $('#message');

	var markers = markerdiv.children();
	var children = board.children();
	var network = null;

	board.hide();
	markerdiv.hide();
	status.hide();

	// $('#game').keyup(function() {
	// 	var value = $('#game').val();
	// 	var button = $('#connect');
		
	// 	if (network.isGame(value)) {
	// 		button.html("Connect to game");
	// 	} else {
	// 		button.html("Create new game");
	// 	}

	// });

	$('#connect').click(function() {
		var server = $('#server').val();
		var game = $('#game').val();

		$('#connect').html('Connecting...');
		$('#connect').attr('disabled', 'disabled')

		network = new Network(server, function(success, network, error) {
			$('#connect').removeAttr('disabled');
			$('#connect').html('Connect');
			if (success) {
				board.show();
				markerdiv.show();
				connectiondiv.hide();
			} else {
				status.show();
				if (error == null) {
					statusmsg.html('Could not connect to server');				
				} else {
					statusmsg.html(error);
				}
			}
		})
	});




	children.each(function(idx, child) {
		$(child).attr('index', idx);
	});

	children.click(function(event) {
		var posn = getCoord(event.target);
		var col = Math.random() > 0.5 ? 'red' : 'blue';

		placeDisk(posn, col);
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
