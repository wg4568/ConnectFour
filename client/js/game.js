$(function() {

	var board = $('#board');
	var markers = $('#markers').children();
	var children = board.children();
	console.log(children);

	children.each(function(idx, child) {
		$(child).attr('index', idx);
	});

	children.click(function(event) {
		var posn = getCoord(event.target);
		var col = `rgb(${Math.floor(Math.random()*255)}, 0, 0)`;
		console.log(col);

		placeDisk(posn, col);
	});

	children.hover(function(event) {
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

		// $(circle).mouseover(function(event) {
		// 	var parent = $(event.target.parentElement);
		// 	var posn = getCoord(parent);
		// 	console.log(posn);
		// 	setMarker(posn.x);
		// });

		circle.style['background'] = color;
		$(circle).attr('class', 'circle');
		$(element).empty();
		$(element).append(circle);
	}

	function setMarker(position) {
		$(markers).empty();

		var element = $(markers[position])
		var marker = $('<div></div>')[0];
		$(marker).attr('class', 'marker');
		$(element).append(marker);
	}
});
